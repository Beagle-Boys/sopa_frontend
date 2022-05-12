from services.sopa_apis import Api
from models.requests.user_model import UserModel
from models.requests.otp_validation import OtpValidationRequestBody
from common_files.config import expiring_token_db
from common_files.utils import logger


class AppService(object):
    def __init__(self, user_id:str):
        self.user_id = user_id
        self.api = Api()

    def user_logout(self):
        logger.warning("Deleting User with User Id {}".format(self.user_id))
        expiring_token_db().remove({'userId': self.user_id})
        return {"result": True}

    @staticmethod
    def register_user(type, user: UserModel):
        response = Api().register_user(type, user)
        return response.json()

    @staticmethod
    def register_user_otp_validation(otp_body: OtpValidationRequestBody):
        response = Api().register_otp_validation(otp_body)
        return response.json()

    @staticmethod
    def login_user(type, user_body: UserModel):
        response = Api().login_user(type, user_body)
        return response.json()

    @staticmethod
    def login_otp_validation(otp_body: OtpValidationRequestBody):
        return Api().login_otp_validation(otp_body).json()
