import traceback
import uuid
import hashlib
from common_files.config import default_user_img, orders_db, reservations_db, spot_db, user_db, payment_client
from common_files.constants import KARMA_FOR_PRIVATE_SPOT, KARMA_FOR_PUBLIC_SPOT, PRIVATE_IMAGE_BUCKET, PUBLIC_IMAGE_BUCKET, RAZORPAY_KEY_SECRET, RESERVATION_DB, SPOT_DB
from common_files.custom_exceptions import SopaExceptions
from common_files.enums import SpotTypeEnum, UserTypeEnum, ReservationStatusEnum
from models.requests.add_location_model import AddSpotLocationModel
from models.requests.transaction_complete import TransactionCompleteRequest
from models.requests.user_details import UserDetails
from models.reservation import RaisedReservations, ReservationModel
from models.responses.generic_response import GenericResponseModel
from models.responses.initiate_premium import InitiatePremiumResponse, PaymentPrefill, RazorpayOrderModel
from models.responses.spot_model import SpotModel, SpotProcessModel
from models.responses.user_details import UserDetailsModel
from pymongo import ReturnDocument
from datetime import datetime, timedelta
from common_files.utils import logger
import hmac
from common_files.config import s3_resource, s3_client


class UserService(object):

    def __init__(self, user_id):
        self.user_id = user_id
        self.user_details = None

    def __image_exists(self, image_id: str) -> bool:
        # bucket = s3_resource.Bucket(PRIVATE_IMAGE_BUCKET)
        # for object in bucket.objects.all():
        #     logger.info(
        #         f"{object.key} {image_id}.jpeg {object.key == f'{image_id}.jpeg'}")
        #     if object.key == f'{image_id}.jpeg':
        #         return True
        # return False
        try:
            s3_client.head_object(
                Bucket=PRIVATE_IMAGE_BUCKET, Key=f'{image_id}.jpeg')
            return True
        except Exception as e:
            logger.error(f"Image {image_id} not found {e}")
            return False

    def __move_image(self, image_id: str) -> bool:
        copy_source = {
            'Bucket': PRIVATE_IMAGE_BUCKET,
            'Key': f'{image_id}.jpeg'
        }
        s3_resource.meta.client.copy(
            copy_source, PUBLIC_IMAGE_BUCKET, f'{image_id}.jpeg')

    def add_spot(self, spot: AddSpotLocationModel):
        spot_process_model = SpotProcessModel(**{
            **spot.dict(by_alias=True),
            "spotId": str(uuid.uuid4()),
            "by": self.user_id,
            "addedTimestamp": datetime.now(),
            "lastActivity": datetime.now()
        })
        images_exist = [self.__image_exists(
            image_id) for image_id in spot.images]
        if not all(images_exist):
            raise SopaExceptions(2002)
        for image in spot.images:
            self.__move_image(image)
        # [
        #     "7a6010fc-c17b-4909-a023-ae79292f3eaa",
        #     "82944e7c-e1f0-4215-ba84-e3e9e274f27f",
        #     "c37e4a2c-9fb4-43d4-80c3-d47c78e48688"
        # ]
        logger.info(f"Adding Spot {spot_process_model}")
        # spot_db().create_index(
        #    [("address.location", "2dsphere")], background=True)
        result = spot_db().update_one({
            "address.location": {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [spot_process_model.address.location.longitude, spot_process_model.address.location.latitude],
                    },
                    "$maxDistance": 100
                }
            }
        }, {
            "$setOnInsert": spot_process_model.dict(by_alias=True)
        }, upsert=True)
        if result.matched_count > 0:
            logger.info("Spot Add Failed, Already exists a nearby spot")
            return GenericResponseModel(result=False, message="Already exists a nearby spot")
        else:
            logger.info("Spot Added Successfully")
            karma = KARMA_FOR_PUBLIC_SPOT
            if spot.type_ is SpotTypeEnum.PRIVATE:
                karma = KARMA_FOR_PRIVATE_SPOT
            user_db().update_one({
                "userId": self.user_id
            }, {
                "$inc": {
                    "karma": karma
                }
            })
            return GenericResponseModel(result=True, message="Spot Added Successfully")

    def get_user_details(self, use_cache=False):

        if use_cache and self.user_details:
            return self.user_details

        response = user_db().find_one({"userId": self.user_id}, {
            "_id": 0,
            "userId": 1,
            "mobile": 1,
            "countryCode": 1,
            "email": 1,
            "userName": 1,
            "imageUrl": 1,
            "address": 1,
            "karma": 1,
            "premiumTill": 1,
            "credibilityScore": 1,
            "dob": 1,
            "type": 1
        })
        if response.get('imageUrl', None) is None:
            response['imageUrl'] = default_user_img(response["mobile"])
        self.user_details = UserDetailsModel(**response)
        return self.user_details

    def set_details(self, details: UserDetails) -> UserDetailsModel:
        data = user_db().find_one_and_update({
            "userId": self.user_id,
        }, {
            "$set": details.dict(by_alias=True),
        }, return_document=ReturnDocument.AFTER)
        if data:
            del data['_id']
            return UserDetailsModel(**data)
        raise SopaExceptions(5001)

    def get_favorite_spots(self):
        spots = list(spot_db().find({
            "$query": {
                f"reviews.{self.user_id}": {"$exists": True}
            },
            "$orderby": {
                f"reviews.{self.user_id}.stars": -1
            }
        }).limit(10))
        return [SpotModel(**spot) for spot in spots]

    def is_premium(self) -> bool:
        return user_db().count_documents(
            {"userId": self.user_id, "type": UserTypeEnum.PREMIUM.value}) > 0

    def list_created_reservations(self):
        reservations = list(reservations_db().aggregate([
            {
                "$match": {
                    "reserved_by": self.user_id
                }
            }, {
                "$lookup": {
                    "from": SPOT_DB,
                    "localField": "spot_id",
                    "foreignField": "spotId",
                    "as": "spot"
                }
            }, {
                "$unwind": "$spot"
            }, {
                "$project": {
                    "name": "$spot.address.data.name",
                    "reservation_id": 1,
                    "spot_id": 1,
                    "timeslot": 1,
                    "created_at": 1,
                    "status": 1,
                    "_id": 0
                }
            }
        ]))
        return [ReservationModel(**reservation) for reservation in reservations]

    def list_raised_reservations(self):
        reservations = spot_db().aggregate([
            {
                "$match": {
                    "by": self.user_id,
                    "type": SpotTypeEnum.PRIVATE.value
                }
            },
            {
                "$project": {
                    "spotId": 1,
                    "name": "$address.data.name",
                    "_id": 0,
                }
            },
            {
                "$lookup": {
                    "from": RESERVATION_DB,
                    "localField": "spotId",
                    "foreignField": "spot_id",
                    "as": "reservations"
                }
            },
            {
                "$project": {
                    "spot_id": "$spotId",
                    "name": 1,
                    "reservations": 1
                }
            }
        ])
        reservations = list(reservations)
        logger.info(f'RAISED RESERVATIONS {reservations}')
        return [RaisedReservations(**reservation) for reservation in reservations]

    def list_accepted_reservations(self):
        reservations = list(reservations_db().aggregate([
            {
                "$match": {
                    "reserved_by": self.user_id
                }
            }, {
                "$lookup": {
                    "from": SPOT_DB,
                    "localField": "spot_id",
                    "foreignField": "spotId",
                    "as": "spot"
                }
            }, {
                "$unwind": "$spot"
            },
            {
                "$match": {
                    "status": ReservationStatusEnum.AWAITING_PAYMENT
                }
            }, {
                "$project": {
                    "name": "$spot.address.data.name",
                    "reservation_id": 1,
                    "spot_id": 1,
                    "timeslot": 1,
                    "created_at": 1,
                    "status": 1,
                    "_id": 0
                }
            }
        ]))
        return [ReservationModel(**reservation) for reservation in reservations]

    def initiate_premium(self):
        receipt_id = str(uuid.uuid4())
        order = {
            "amount": 1000,
            "currency": "INR",
            "receipt": receipt_id,
            "notes": {
                "paymentFor": "premium"
            }
        }
        user_details = self.get_user_details()
        try:
            orders_db().insert_one({
                **order,
                "user_id": self.user_id,
                "status": "inititating"
            })
        except:
            logger.error(traceback.format_exc())
            raise SopaExceptions(7001)
        try:
            razorpay_order = payment_client().order.create(data=order)
            razorpay_order = RazorpayOrderModel(**razorpay_order)
            orders_db().update_one({
                "receipt": receipt_id
            }, {
                "$set": {
                    **razorpay_order.dict(by_alias=True),
                }
            })
        except Exception:
            logger.error(traceback.format_exc())
            raise SopaExceptions(7002)
        response = InitiatePremiumResponse(
            order_id=razorpay_order.id,
            amount=razorpay_order.amount,
            receipt=receipt_id,
            prefill=PaymentPrefill(
                email=user_details.email or "",
                contact=user_details.mobile,
                name=user_details.userName
            )
        )
        return response

    def complete_premium(self, transaction: TransactionCompleteRequest):
        try:
            existing_order = orders_db().find_one({
                "receipt": transaction.receipt
            })
            if existing_order.get("id", None):
                generated_signature = hmac.new(
                    RAZORPAY_KEY_SECRET.encode('utf-8'),
                    f'{existing_order["id"]}|{transaction.razorpay_payment_id}'.encode(
                        'utf-8'),
                    digestmod=hashlib.sha256
                ).hexdigest()
                # generated_signature = hashlib.sha256(
                #     existing_order["id"] + "|" + transaction.razorpay_payment_id, RAZORPAY_KEY_SECRET)
                if str(generated_signature) != transaction.razorpay_signature:
                    raise SopaExceptions(7003)
                payment_client().utility.verify_payment_signature({
                    'razorpay_order_id': transaction.razorpay_order_id,
                    'razorpay_payment_id': transaction.razorpay_payment_id,
                    'razorpay_signature': generated_signature
                })
            else:
                raise SopaExceptions(7005)
        except SopaExceptions as e:
            logger.error(traceback.format_exc())
            raise e
        except Exception:
            logger.error(traceback.format_exc())
            raise SopaExceptions(7005)
        try:
            orders_db().update_one({
                "id": transaction.razorpay_order_id
            }, {
                "$set": {
                    "status": "completed",
                    **transaction.dict(by_alias=True)
                }
            })
            user_details = self.get_user_details()
            premium_till = user_details.premiumTill
            if not premium_till:
                premium_till = datetime.utcnow() + timedelta(days=180)
            else:
                premium_till += timedelta(days=180)
            details = user_db().find_one_and_update({
                "userId": self.user_id
            }, {
                "$set": {
                    "premiumTill": premium_till,
                    "type": UserTypeEnum.PREMIUM.value
                }
            }, return_document=ReturnDocument.AFTER)
        except Exception:
            logger.error(traceback.format_exc())
            raise SopaExceptions(7004)
        return UserDetailsModel(**details)

    """
    NOTE: Work in progress
    def get_history(self,formattedDate:str = sopa_date_format(None,True)) -> list:
        data = history_db().find({
            "userId": self.userId,
            "formattedDate": formattedDate
        },{
            "_id": 0,
        })
        spotsids = list(data)
        spots_data = spot_db().find({
            "spotId": {
                "$in": [spot["spotId"] for spot in spotsids]
            }
        })
        spots = list(spots_data)
        return His
    """


"""
"$match": {
                "by": self.user_id,
                "type": SpotTypeEnum.PRIVATE.value
            }},
            {
               "$project": {
                    "spotId": 1,
                    "_id": 0
                }
            },
            {
                "$lookup": {
                    "from": RESERVATION_DB,
                    "localField": "spotId",
                    "foreignField": "spot_id",
                    "as": "reservations"
                }
            },
            {"$unwind": "$reservations"}
"""
