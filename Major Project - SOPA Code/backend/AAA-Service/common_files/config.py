import pymongo
from twilio.rest import Client
from common_files.common_constants import MONGO_URI, DATABASE_NAME, \
    USER_DB, TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, OTP_DB, USER_DETAILS_DB, TOKEN_DB

mongo_connection = pymongo.MongoClient(MONGO_URI)
mongo_db = mongo_connection[DATABASE_NAME]


def user_db():
    return mongo_db[USER_DB]


def twilio_client():
    return Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


def token_db():
    return mongo_db[TOKEN_DB]


def otps_db():
    return mongo_db[OTP_DB]


def user_details_db():
    return mongo_db[USER_DETAILS_DB]
