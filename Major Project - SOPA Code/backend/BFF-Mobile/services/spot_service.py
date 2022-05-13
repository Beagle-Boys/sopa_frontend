import json
import traceback
from typing import List
import uuid
import re
import pymongo

from fastapi import HTTPException

from common_files.config import bookmarks_db, reservations_db, review_db, spot_db, user_db
from common_files.constants import KARMA_FOR_SEARCHING_SPOT
from common_files.custom_exceptions import SopaExceptions
from common_files.enums import ReservationResponseEnum, ReservationStatusEnum
from models.requests.respond_reservation_request import RespondReservationModel
from models.requests.timeslot import TimeSlot
from models.requests.user_details import Location
from models.responses.generic_response import GenericResponseModel
from models.responses.spot_model import PublicReviewModel, PublicUserModel, ReviewModel, ReviewProcessModel, SpotModel, SpotModelObfuscated, SpotProcessModel
from datetime import datetime
from common_files.utils import logger, verify_reservation_response
from schemas.reservation_schema import ReservationSchema
from services.user_service import UserService
from pymongo import ReturnDocument


class SpotService(object):
    def __init__(self, user_id: str):
        self.user_id = user_id

    def __get_spot_rating(self, spot_data: SpotProcessModel) -> float:
        data = review_db().aggregate([
            {
                "$match": {
                    "spotId": spot_data.spotId
                }
            },
            {
                "$group": {
                    "_id": None,
                    "avg_rating": {
                        "$avg": "$stars"
                    }
                }
            }
        ])
        data = list(data)
        logger.info(f"Spot Rating {list(data)}")
        if len(data) > 0:
            return data[0]["avg_rating"]
        return 0

    def __spot_data_to_spot_model(self, spot_data: SpotProcessModel) -> SpotModel:
        user_details = UserService(self.user_id).get_user_details()
        user_details = PublicUserModel(**user_details.dict(by_alias=True))
        data = SpotModel(**{
            **spot_data.dict(by_alias=True),
            "by": user_details,
            "totalRating": self.__get_spot_rating(spot_data)
        })
        if len(data.reviews) > 0:
            return data
        reviews = self.fetch_reviews(data.spotId)
        data.reviews = reviews
        return data

    def __review_data_to_public_review_model(self, review_data: ReviewProcessModel) -> PublicReviewModel:
        user_id = review_data.from_
        user_details = UserService(user_id).get_user_details()
        user_details = PublicUserModel(**user_details.dict(by_alias=True))
        return PublicReviewModel(**{
            **review_data.dict(by_alias=True),
            **user_details.dict(by_alias=True)
        })

    def fetch_reviews(self, spot_id: str, max_items: int = 10) -> List[PublicReviewModel]:
        reviews = list(review_db().find({
            "spotId": spot_id
        }, limit=max_items))
        return [self.__review_data_to_public_review_model(ReviewProcessModel(**review)) for review in reviews]

    def review_spot(self, spot_id: str, review: ReviewModel):
        process_model = ReviewProcessModel(**{
            **review.dict(by_alias=True),
            "reviewId": str(uuid.uuid4()),
            "from": self.user_id,
            "date": datetime.now(),
            "spotId": spot_id
        })
        logger.info(f"Adding Review {process_model}")
        spot_exists = spot_db().update_one(
            {"spotId": spot_id}, {"$inc": {"useCount": 1}})
        if spot_exists.matched_count == 0:
            logger.info("Spot Review Failed, Spot not found")
            return GenericResponseModel(result=False, message="Spot not found")
        review_db().update_one({
            "spotId": spot_id,
            "userId": self.user_id
        }, {
            "$set": {
                "date": process_model.date,
                "comment": review.comment,
                "stars": review.stars
            },
            "$setOnInsert": {
                **process_model.dict(by_alias=True, exclude={"date", "comment", "stars"})
            }
        }, upsert=True)
        return GenericResponseModel(result=True, message="Reviewed Successfully")

    def fetch_spot(self, location: Location, distance: int, spend_karma: bool = True):
        is_premium = UserService(self.user_id).is_premium()
        spots = list(spot_db().find({
            "address.location": {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [location.longitude, location.latitude],
                    },
                    "$maxDistance": distance
                }
            }
        }))
        spots = [self.__spot_data_to_spot_model(
            SpotProcessModel(**spot)) for spot in spots]
        spent_karma = True
        if spend_karma and not is_premium:
            try:
                updated = user_db().update_one({
                    "userId": self.user_id,
                    "karma": {
                        "$gte": KARMA_FOR_SEARCHING_SPOT
                    }
                }, {
                    "$inc": {
                        "karma": -KARMA_FOR_SEARCHING_SPOT
                    }
                })
                if updated.modified_count == 0:
                    spent_karma = False
            except Exception:
                logger.error('Failed deducting karma')
                logger.error(traceback.format_exc())
                spent_karma = False
        if (not spend_karma or not spent_karma) and not is_premium:
            logger.info(f'SPEND KARMA {spend_karma}')
            spots = [SpotModelObfuscated(
                **spot.dict(by_alias=True, exclude={'address'})) for spot in spots]
        return spots

    def fetch_spot_by_id(self, spot_id: str):
        spot = spot_db().find_one({"spotId": spot_id})
        if spot:
            return self.__spot_data_to_spot_model(SpotProcessModel(**spot))
        else:
            raise SopaExceptions(2001)

    def process_reservation_response(self, reservation_response: RespondReservationModel):
        verify_reservation_response(reservation_response, self.user_id)
        if reservation_response.response == ReservationResponseEnum.REJECTED:
            updated = reservations_db().find_one_and_update({
                "reservation_id": reservation_response.reservation_id,
            }, {
                "$set": {
                    "status": ReservationStatusEnum.DENIED
                }
            }, return_document=ReturnDocument.AFTER)
            updated = ReservationSchema(**updated)
            return updated
            # TODO: notify user
        if reservation_response.requested_amount is None:
            raise SopaExceptions(6004)
        updated = reservations_db().find_one_and_update({
            "reservation_id": reservation_response.reservation_id
        }, {
            "$set": {
                "status": ReservationStatusEnum.AWAITING_PAYMENT,
                "amount": reservation_response.requested_amount
            }
        }, return_document=ReturnDocument.AFTER)
        updated = ReservationSchema(**updated)
        reservations_db().update_many({
            "spot_id": updated.spot_id,
            "reservation_id": {
                "$ne": updated.reservation_id
            }
        }, {
            "$set": {
                "status": ReservationStatusEnum.DENIED
            }
        })
        # TODO: notify user
        return updated

    def reserve_spot(self, spot_id: str, timeslot: TimeSlot):
        own_spot = spot_db().count_documents(
            {"spotId": spot_id, "by": self.user_id})
        if own_spot > 0:
            raise HTTPException(
                status_code=400, detail="You can't reserve your own spot")
        start_time = int(timeslot.start)
        end_time = int(timeslot.end)
        if start_time > 2359 or end_time > 2359 or start_time < 0 or end_time < 0 or start_time >= end_time:
            raise SopaExceptions(6001)
        exists = reservations_db().find_one({
            "spot_id": spot_id,
            "$or": [
                {
                    "$and": [
                        {"timeslot.start": {"$lte": start_time}},
                        {"timeslot.end": {"$gte": end_time}}
                    ]
                },
                {
                    "$and": [
                        {"timeslot.start": {"$lte": end_time}},
                        {"timeslot.end": {"$gte": start_time}}
                    ]
                }
            ],
            "status": {
                "$in": [ReservationStatusEnum.AWAITING_PAYMENT.value, ReservationStatusEnum.APPROVED.value]
            }
        })
        if exists:
            raise SopaExceptions(6002, error_data=json.dumps({
                'slot': exists.get('timeslot', None)
            }))
        reservation = ReservationSchema(**{
            "reservation_id": str(uuid.uuid4()),
            "spot_id": spot_id,
            "timeslot": {
                "start": start_time,
                "end": end_time
            },
            "reserved_by": self.user_id,
            "created_at": datetime.utcnow(),
            "status": ReservationStatusEnum.PENDING.value
        })
        inserted = reservations_db().insert_one(reservation.dict(by_alias=True))
        if not inserted.inserted_id:
            raise SopaExceptions(6003)
        # TODO: ping the owner
        return reservation

    def search_spot(self, query: str):
        query = re.escape(query)
        if len(query) < 3:
            raise SopaExceptions(4002)
        spots = list(spot_db().find({
            "$or": [
                {
                    "address.data.name": {
                        "$regex": query,
                        "$options": "im"
                    }
                },
                {
                    "address.data.address": {
                        "$regex": query,
                        "$options": "im"
                    }
                }
            ]
        }).sort('useCount', pymongo.DESCENDING))
        spots = [self.__spot_data_to_spot_model(
            SpotProcessModel(**spot)) for spot in spots]
        return spots

    def bookmark_spot(self, spot_id: str):
        _ = self.fetch_spot_by_id(spot_id)
        result = bookmarks_db().update_one({
            "user_id": self.user_id,
        }, {
            "$set": {
                f"bookmarks.{spot_id}": 1
            }
        }, upsert=True)
        return self.fetch_bookmarks()

    def is_bookmarked(self, spot_id: str):
        _ = self.fetch_spot_by_id(spot_id)
        result = bookmarks_db().find_one({
            "user_id": self.user_id,
            f"bookmarks.{spot_id}": 1
        })
        return result is not None

    def delete_bookmark(self, spot_id: str):
        _ = self.fetch_spot_by_id(spot_id)
        result = bookmarks_db().update_one({
            "user_id": self.user_id,
            f"bookmarks.{spot_id}": {
                "$exists": True
            }
        }, {
            "$set": {
                f"bookmarks.{spot_id}": 0
            }
        })
        return self.fetch_bookmarks()

    def fetch_bookmarks(self):
        bookmarks = bookmarks_db().find_one({"user_id": self.user_id})
        if not bookmarks:
            bookmarks = {}
        spot_ids = list(bookmarks.get("bookmarks", {}).keys())
        spot_ids = [
            spot_id for spot_id in spot_ids if bookmarks.get("bookmarks", {}).get(spot_id, 0) == 1]
        spots = spot_db().find({"spotId": {"$in": spot_ids}})
        resultant_spots = []
        for spot in spots:
            resultant_spots.append(
                self.__spot_data_to_spot_model(SpotProcessModel(**spot)))
        return resultant_spots
