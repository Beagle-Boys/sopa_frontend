import traceback
import uuid
from common_files.custom_exceptions import SopaExceptions
from common_files.config import user_db, otps_db, user_details_db, token_db
from model.requests.register_request import NewUser
from interfaces.otp_interface import OtpHandler
from model.response.otp_verification_response import OtpVerificationResponseBody
from model.requests.otp_validation_request import OtpValidationRequestBody
from model.response.expiring_token_response import ExpiringToken
from model.response.api_validation import ApiValidationResponseBody
from schema.validation import ValidationSchema
from schema.user_details import UserDetailsModel
from schema.tokens import Token
from common_files.utils import logger
from datetime import datetime
from fastapi.encoders import jsonable_encoder


class UserServiceImpl(OtpHandler):
    def __init__(self):
        logger.info("User Service Started Running")
        pass

    def __check_existing_user(self, mobile):
        user_data = user_db().find_one({"mobile": mobile})
        if user_data:
            return user_data.get("userId")
        else:
            logger.critical("User Does not Exist")
            return False

    def save_otp_body(self, validation: ValidationSchema):
        try:
            otps_db().insert(validation.dict(by_alias=True))
            logger.info("OTP for request saved")
        except Exception:
            logger.error("Error in saving the Otp validation body")
            traceback.print_exc()
            raise SopaExceptions(1004)

    def register_user_otp_verification(self, new_user: NewUser):
        """
        :param new_user:
        :return: otpId
        """
        try:
            mobile_to_send_otp = new_user.countryCode + new_user.mobile
            if self.__check_existing_user(new_user.mobile):
                logger.critical("Mobile Number Already Exists")
                raise SopaExceptions(1001)
            otp_id, otp = self.send_otp(mobile_to_send_otp, False, True)
            response = OtpVerificationResponseBody(otpId=otp_id)
            validation_schema = ValidationSchema(otpId=otp_id, otp=otp, userData=new_user, createdAt=datetime.utcnow())
            # TODO: 2 Network calls 1 can be background task
            self.save_otp_body(validation_schema)
            return response
        except Exception as err:
            return err

    def __create_new_user_details(self, new_user):
        try:
            user_details = UserDetailsModel(
                userId=new_user.get("userId"),
                imageUrl=new_user.get("imageUrl"),
                userName=new_user.get("userName"),
                mobile=new_user.get("mobile"),
                countryCode=new_user.get("countryCode"),
            )
            user_details_db().insert(jsonable_encoder(user_details))
            logger.info("New User Details created")
        except Exception as err:
            logger.info("New User Details Insertion Error")
            return err

    def __create_new_user(self, user_data):
        try:
            user_db().insert(jsonable_encoder(user_data))
            self.__create_new_user_details(user_data)
        except Exception:
            return SopaExceptions(1001)

    def __create_expiring_token(self, user_id):
        try:
            auth = str(uuid.uuid4())
            token_schema = Token(
                userId=user_id,
                createdAt=datetime.utcnow(),
                auth=auth,
            )
            expiring_token = ExpiringToken(
                auth=auth
            )
            _token = {
                "userId": token_schema.userId,
                "auth": token_schema.auth,
                "createdAt": datetime.utcnow()
            }
            token_db().insert(_token)
            return expiring_token
        except Exception:
            traceback.print_exc()
            raise SopaExceptions(1004)

    def register_otp_validation(self, otp_validation_body: OtpValidationRequestBody):
        try:
            user_data = self.validate_otp(otp_validation_body, type="register")
            if isinstance(user_data, dict):
                user_id = str(uuid.uuid4())
                user_data.update({"userId": user_id, "isActive": True})
                self.__create_new_user(user_data)
                return self.__create_expiring_token(user_id)
            else:
                raise SopaExceptions(1006)
        except Exception as err:
            return err

    def login_user_otp_verification(self, user):
        try:
            mobile_to_send_otp = user.countryCode + user.mobile
            user_id = self.__check_existing_user(user.mobile)
            if user_id:
                otp_id, otp = self.send_otp(mobile_to_send_otp, True, False)
                validation_schema = ValidationSchema(
                    otpId=otp_id,
                    otp=otp,
                    userData=user,
                    createdAt=datetime.utcnow()
                )
                self.save_otp_body(validation_schema)
                response = OtpVerificationResponseBody(otpId=otp_id)
                return response
            else:
                raise SopaExceptions(1003)

        except Exception as err:
            return err

    def login_otp_validate(self, otp_body):
        try:
            user_data = self.validate_otp(otp_body, "login")
            if isinstance(user_data, dict):
                user_id = user_data.get("userId")
                return self.__create_expiring_token(user_id)
            else:
                raise SopaExceptions(1006)
        except Exception as err:
            return err

    def api_validation(self, auth_token):
        try:
            token = token_db().find_one({"auth": auth_token})
            if token:
                validator_response = ApiValidationResponseBody(
                    is_authentic=True)
                return validator_response
            else:
                raise SopaExceptions(1003)
        except Exception as err:
            return err
