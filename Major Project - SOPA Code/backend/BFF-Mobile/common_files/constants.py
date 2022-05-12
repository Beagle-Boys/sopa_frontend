STAGE = "prod"
DATABASE_NAME = "SOPA_CUSTOMER_APP"
MONGO_URI = f"INSERT_YOUR_OWN"

EXPIRING_TOKEN_DB = "expiring_tokens"
USER_DETAILS_DB = "user_details"
USER_DB = "users"
HISTORY_DB = "history"
SPOT_DB = "spots"
REVIEW_DB = "reviews"
RESERVATION_DB = "reservations"
ORDERS_DB = "orders"
BOOKMARKS_DB = "bookmarks"

X_INTERNAL_KEY = "YOUR_X_INTERNAL_KEY"
AUTH_SERVICE = "AUTH"

# ------------- Endpoints ---------------------
BASE_URL = "https://sopa-aaa.herokuapp.com"
REGISTER_USER = 'register'
VALIDATE_REGISTER_OTP = 'register/otp/validate'
USER_LOGIN = 'login/{type}'
VALIDATE_LOGIN_OTP = 'login/otp/validate'
AUTH_USER = 'authenticate/api'
LOGIN_USER = 'login'

# ------------- CONFIG ---------------------
KARMA_FOR_PRIVATE_SPOT = 20
KARMA_FOR_PUBLIC_SPOT = 30
KARMA_FOR_SEARCHING_SPOT = 5

# ------------- AWS ---------------------
AWS_ACCESS_KEY_ID = "YOUR_AWS_ACCESS_KEY_ID"
AWS_ACCESS_SECRET_KEY = "YOUR_AWS_ACCESS_SECRET_KEY"
AWS_REGION = "ap-south-1"

PRIVATE_IMAGE_BUCKET = "private-spot-image-bucket"
PUBLIC_IMAGE_BUCKET = "public-spot-image-bucket"

RAZORPAY_KEY_ID = "YOUR_RAZORPAY_KEY_ID"
RAZORPAY_KEY_SECRET = "YOUR_RAZORPAY_KEY_SECRET"