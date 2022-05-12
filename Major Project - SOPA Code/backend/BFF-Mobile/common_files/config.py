import hashlib
import pymongo
from common_files.constants import AWS_ACCESS_KEY_ID, AWS_ACCESS_SECRET_KEY, AWS_REGION, BOOKMARKS_DB, HISTORY_DB, MONGO_URI, DATABASE_NAME, EXPIRING_TOKEN_DB, ORDERS_DB, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RESERVATION_DB, REVIEW_DB, USER_DETAILS_DB, USER_DB, SPOT_DB
import boto3
import razorpay

mongo_connection = pymongo.MongoClient(MONGO_URI)
mongo_db = mongo_connection[DATABASE_NAME]
s3_client = boto3.client('s3',aws_access_key_id=AWS_ACCESS_KEY_ID,
                   aws_secret_access_key=AWS_ACCESS_SECRET_KEY,
                   region_name=AWS_REGION)
s3_resource = boto3.resource('s3',aws_access_key_id=AWS_ACCESS_KEY_ID,
                   aws_secret_access_key=AWS_ACCESS_SECRET_KEY,
                   region_name=AWS_REGION)
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

def payment_client():
    return razorpay_client

def expiring_token_db():
    return mongo_db[EXPIRING_TOKEN_DB]


def orders_db():
    return mongo_db[ORDERS_DB]

def spot_db():
    return mongo_db[SPOT_DB]

def user_details_db():
    return mongo_db[USER_DETAILS_DB]

def user_db():
    return mongo_db[USER_DB]

def history_db():
    return mongo_db[HISTORY_DB]

def review_db():
    return mongo_db[REVIEW_DB]

def reservations_db():
    return mongo_db[RESERVATION_DB]

def bookmarks_db():
    return mongo_db[BOOKMARKS_DB]

def default_user_img(seed:str):
    seed = hashlib.sha1(seed.encode('utf-8')).hexdigest()
    return f"https://avatars.dicebear.com/api/human/{seed}.svg"
