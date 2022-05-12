import traceback
from fastapi import Header, HTTPException
import pymongo
from common_files.config import expiring_token_db, reservations_db, spot_db
from datetime import datetime
from common_files.enums import ReservationStatusEnum, SpotTypeEnum
from common_files.logger_config import logger
from models.requests.respond_reservation_request import RespondReservationModel
from models.responses.spot_model import SpotProcessModel
from schemas.reservation_schema import ReservationSchema


def verify_private_spot(spot_id: str):
    count = spot_db().count_documents({
        "spotId": spot_id,
        "type": SpotTypeEnum.PRIVATE.value
    })
    if count == 0:
        raise HTTPException(
            status_code=400, detail="Invalid Spot ID")
    return spot_id

def verify_reservation_response(response:RespondReservationModel, user_id: str):
    res_id = response.reservation_id
    try:
        reservation = reservations_db().find_one({
            "reservation_id": res_id
        })
        if not reservation:
            raise HTTPException(status_code=432, detail="Invalid Reservation")
        del reservation["_id"]
        reservation = ReservationSchema(**reservation)
        logger.debug(f'Reservation Status {reservation.status}')
        if reservation.status is not ReservationStatusEnum.PENDING.value:
            raise HTTPException(status_code=432, detail="Reservation request expired or already processed")
        spot = spot_db().find_one({
            "spotId": reservation.spot_id
        })
        if not spot:
            raise HTTPException(status_code=432, detail="Spot does not exist anymore")
        del spot["_id"]
        spot = SpotProcessModel(**spot)
        if spot.by != user_id:
            raise HTTPException(status_code=432, detail="Spot does not belong to user")
        if spot.type_ is not SpotTypeEnum.PRIVATE.value:
            raise HTTPException(status_code=432, detail="Spot is public")
    except HTTPException as e:
        raise e
    except Exception:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=432, detail="Unexpected Error occured")

async def verify_user(x_sopa_key: str = Header(...)):
    """
    middleware to verify auth token
    args:
        auth: received as header param. Contains a hex encoded auth token
    raises:
        401 : Unauthorized when token is not matched.
    returns:
        None: return value for dependencies like these are discarded even
              though if something is returned
    """
    try:
        token_details = expiring_token_db().find_one_and_update({
            "auth": x_sopa_key
        },{
            "$set": {
                "createdAt": datetime.utcnow()
            }
        },return_document=pymongo.ReturnDocument.AFTER)
        logger.info(token_details)
        if token_details is None:
            raise HTTPException(status_code=401, detail="Unauthorized")
        return token_details.get("userId")
    except pymongo.errors.PyMongoError as error:
        logger.error(error)
        raise HTTPException(
            status_code=432, detail="Unexpected error occured! Try again later")


def identify_user_id_for_session(auth) -> str:
    token_details = expiring_token_db().find_one({"auth": auth})
    return token_details.get("userId")


def current_date(year: bool, month: bool, timestamp: bool):
    now = datetime.now()
    if year:
        return str(now.year)
    elif month:
        if now.month < 10:
            _month = "0" + str(now.month)
        else:
            _month = str(now.month)
        return _month
    elif timestamp:
        return str(now)


def sopa_date_format(timestamp, today: bool):
    if today:
        return current_date(True, False, False)[-2:] + current_date(False, True, False)
    if timestamp:
        date = timestamp.split(" ")[0]
        date_split = date.split("-")
        return date_split[0][-2:] + date_split[1]


def delta_time_days(input_timestamp, comparing_timestamp, delta_type: str):
    """
    :param input_timestamp:
    :param comparing_timestamp:
    :param delta_type: "D" for days and "H" for Hours
    :return:
    """
    datetime_object1 = datetime.fromisoformat(input_timestamp)
    datetime_object2 = datetime.fromisoformat(comparing_timestamp)
    delta_days = datetime_object1 - datetime_object2
    if delta_type.upper() == "D":
        return delta_days
    elif delta_type.upper() == "H":
        return divmod(delta_days.total_seconds(), 60)[0] // 60


def epoch_to_sopa(epoch, today=False):
    timestamp = epoch_to_datetime(epoch)
    return sopa_date_format(timestamp, False)


def epoch_to_datetime(epoch):
    epoch = epoch / 1000
    return datetime.fromtimestamp(epoch).strftime("%Y-%m-%d %H:%M:%S")
