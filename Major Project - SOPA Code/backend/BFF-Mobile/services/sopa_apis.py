from common_files.constants import VALIDATE_LOGIN_OTP, BASE_URL, \
    X_INTERNAL_KEY, LOGIN_USER, REGISTER_USER, VALIDATE_REGISTER_OTP, AUTH_SERVICE
from collections import OrderedDict
import requests
from fastapi.encoders import jsonable_encoder
from models.requests.user_model import ExistingUser, UserModel
from models.requests.otp_validation import OtpValidationRequestBody
from common_files.utils import logger
from common_files.enums import Code
from fastapi import HTTPException

class Api(object):
    def __init__(self):
        self.base_url = BASE_URL

    def __get_headers(self, product_tag):
        """
        To get  headers
        :return: str
        """
        return {
            'x-internal-key': X_INTERNAL_KEY,
            'x-product-key': Code().product_key(product_tag)
        }

    def __get_url(self, endpoint):
        return "{base_url}/{endpoint}".format(**{
            "base_url": BASE_URL,
            "endpoint": endpoint
        })

    def __request(self, method: str, url: str, request_body, product_tag: str):
        headers = self.__get_headers(product_tag)
        logger.info("HITTING API: {}".format(url))
        response = requests.request(method=method, url=url, json=request_body, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        else:
            logger.info("SUCCESSFULL HIT")
            print(response.text)
        return response

    def register_user(self, type: str, user_body: UserModel):
        url = self.__get_url(REGISTER_USER) + '/{}'.format(type)
        request_body = jsonable_encoder(user_body)
        response = self.__request("POST", url, request_body, AUTH_SERVICE)
        return response

    def register_otp_validation(self, otp_body: OtpValidationRequestBody):
        url = self.__get_url(VALIDATE_REGISTER_OTP)
        request_body = jsonable_encoder(otp_body)
        response = self.__request("POST", url, request_body, AUTH_SERVICE)
        return response

    def login_user(self, type: str, user_body: ExistingUser):
        url = self.__get_url(LOGIN_USER) + '/{}'.format(type)
        request_body = user_body.dict(by_alias=True)#jsonable_encoder(user_body)
        print("REQUEST",request_body)
        response = self.__request("POST", url, request_body, AUTH_SERVICE)
        return response

    def login_otp_validation(self, otp_body: OtpValidationRequestBody):
        url = self.__get_url(VALIDATE_LOGIN_OTP)
        request_body = jsonable_encoder(otp_body)
        return self.__request("POST", url, request_body, AUTH_SERVICE)