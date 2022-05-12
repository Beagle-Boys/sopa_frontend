from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from model.requests.register_request import ExistingUser, NewUser
from model.requests.otp_validation_request import OtpValidationRequestBody
from common_files.custom_exceptions import SopaExceptions
from service.user_service_impl import UserServiceImpl
from model.requests.api_validation import ApiValidationRequestBody
from common_files.dependencies import verify_host

from model.response.otp_verification_response import OtpVerificationResponseBody
from model.response.expiring_token_response import ExpiringToken as ExpiringTokenModel
from model.response.api_validation import ApiValidationResponseBody

app = FastAPI(title="SOPA Auth Service", description="AAA Service")

origins = [
    "http://127.0.0.1:8000",
    "https://sopa-bff.herokuapp.com/",
    "https://sopa-aaa.onrender.com/",
    "https://sopa-bff.onrender.com/docs"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register/{type}", dependencies=[Depends(verify_host)], response_model=OtpVerificationResponseBody)
async def register(type: str, new_user: NewUser, x_internal_key: str = Header(None)):
    if type == "mobile":
        response = UserServiceImpl().register_user_otp_verification(new_user)
        if isinstance(response, SopaExceptions):
            raise HTTPException(status_code=432, detail=str(response))
        else:
            return response


@app.post("/register/otp/validate", dependencies=[Depends(verify_host)], response_model=ExpiringTokenModel)
async def registration_otp_validate(otp_validation_body: OtpValidationRequestBody,x_internal_key: str = Header(None)):
    response = UserServiceImpl().register_otp_validation(otp_validation_body=otp_validation_body)
    if isinstance(response, SopaExceptions):
        raise HTTPException(status_code=403, detail=str(response))
    else:
        return response


@app.post("/login/{type}", dependencies=[Depends(verify_host)], response_model=OtpVerificationResponseBody)
async def login(type: str, user: ExistingUser,x_internal_key: str = Header(None)):
    if type == "mobile":
        response = UserServiceImpl().login_user_otp_verification(user)
        if isinstance(response, SopaExceptions):
            raise HTTPException(status_code=402, detail=str(response))
        else:
            return response


@app.post("/login/otp/validate", dependencies=[Depends(verify_host)], response_model=ExpiringTokenModel)
async def login_otp_validate(otp_validation_body: OtpValidationRequestBody,x_internal_key: str = Header(None)):
    response = UserServiceImpl().login_otp_validate(otp_validation_body)
    if isinstance(response, SopaExceptions):
        raise HTTPException(status_code=403, detail=str(response))
    else:
        return response


@app.post("/authenticate/api", dependencies=[Depends(verify_host)], response_model=ApiValidationResponseBody)
async def api_validation(api_validator: ApiValidationRequestBody,x_internal_key: str = Header(None)):
    response = UserServiceImpl().api_validation(api_validator.auth)
    if isinstance(response, SopaExceptions):
        raise HTTPException(status_code=403, detail=str(response))
    else:
        return response
