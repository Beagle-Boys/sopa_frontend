import uuid
from abc import abstractmethod
from common_files.common_constants import TWILIO_NUMBER
from common_files.config import otps_db, twilio_client, user_db
import random
from common_files.custom_exceptions import SopaExceptions
from model.requests.otp_validation_request import OtpValidationRequestBody
from schema.validation import ValidationSchema
from common_files.utils import logger


class OtpHandler(object):

    @abstractmethod
    def send_otp(self, mobile, is_login, is_register):
        try:
            otp = "1234"#random.randint(1000, 9999)
            message = None
            """if is_login:
                message = twilio_client().messages.create(
                    body='{} is your One Time Password (OTP) for SOPA App Login. The OTP expires in 10 mins'.format(
                        otp),
                    from_=TWILIO_NUMBER,
                    to=mobile
                )

            elif is_register:
                message = twilio_client().messages.create(
                    body='{} is your One Time Password (OTP) for phone no. verification on SOPA '
                         'platform. The OTP expires in 10 mins'.format(
                        otp),
                    from_=TWILIO_NUMBER,
                    to=mobile
                )
            """
            #logger.info("OTP SENT SUCCESSFULLY WITH M-SID {}".format(message.sid))
            otp_id = str(uuid.uuid4())
            return otp_id, otp
        except Exception:
            raise SopaExceptions(1004)

    @abstractmethod
    def save_otp_body(self, validation: ValidationSchema):
        pass

    @abstractmethod
    def validate_otp(self, otp_validation_body: OtpValidationRequestBody, type):
        otp_obj = otps_db().find_one({"otpId": otp_validation_body.otpId,"userData.mobile":otp_validation_body.mobile})
        if otp_obj and otp_obj.get("otp") == otp_validation_body.otp:
            if type == "login":
                return user_db().find_one({"mobile": otp_validation_body.mobile})
            else:
                return otp_obj.get("userData")
        else:
            raise SopaExceptions(1006)
