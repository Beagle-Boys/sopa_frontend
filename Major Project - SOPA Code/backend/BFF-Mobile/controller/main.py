from typing import List, Union
from fastapi import BackgroundTasks, FastAPI, Depends, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.exception_handlers import http_exception_handler, request_validation_exception_handler
from fastapi.middleware.cors import CORSMiddleware
from models.requests.add_location_model import AddSpotLocationModel
from models.requests.respond_reservation_request import RespondReservationModel
from models.requests.timeslot import TimeSlot
from models.requests.transaction_complete import TransactionCompleteRequest
from models.requests.user_details import Location, UserDetails
from models.reservation import RaisedReservations, ReservationModel
from models.responses.generic_response import GenericResponseModel
from models.responses.initiate_premium import InitiatePremiumResponse
from models.responses.spot_model import ReviewModel, SpotModel, SpotModelObfuscated
from services.app_service import AppService
from models.requests.user_model import ExistingUser, UserModel
from models.requests.otp_validation import OtpValidationRequestBody
from common_files.utils import verify_private_spot, verify_user
from common_files.custom_exceptions import SopaExceptions
from common_files.logger_config import logger
import traceback

from models.responses.otp_verification_response import OtpVerificationResponseBody
from models.responses.expiring_token_response import ExpiringToken as ExpiringTokenModel
from models.responses.user_details import UserDetailsModel
from models.responses.logout import LogoutModel
from services.spot_image_service import SpotImageService
from services.spot_service import SpotService
from services.user_service import UserService

TAGS_METADATA = [
    {
        "name": "Authentication",
        "description": "Authentication related endpoints"
    },
    {
        "name": "User",
        "description": "User related operations"
    },
    {
        "name": "Spot",
        "description": "Spot related operations"
    },
    {
        "name": "Rent",
        "description": "Rent a spot related operations"
    },
]

app = FastAPI(title="SOPA - BFF Mobile",
              description="Mobile-BFF", openapi_tags=TAGS_METADATA)

origins = [
    "http://127.0.0.1:8000",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:*",
    "http://localhost:3000",
    "https://sopa-bff.herokuapp.com",
    "https://sopa-sharda.netlify.app/",
    "http://sopa-sharda.surge.sh",
    "https://sopa-bff.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/user/register/{type}", response_model=OtpVerificationResponseBody, tags=["Authentication"])
async def register_user(type: str, user: UserModel):
    if type in ["mobile"]:
        response = AppService.register_user(type, user)
        return response
    else:
        raise SopaExceptions(2001)


@app.post("/user/register/otp/validate", response_model=ExpiringTokenModel, tags=["Authentication"])
async def otp_registration(otp_body: OtpValidationRequestBody):
    return AppService.register_user_otp_validation(otp_body)


@app.post("/user/login/{type}", response_model=OtpVerificationResponseBody, tags=["Authentication"])
async def login_user(type: str, user: ExistingUser):
    if type in ["mobile"]:
        response = AppService.login_user(type, user)
        return response
    else:
        raise SopaExceptions(2001)


@app.post("/user/login/otp/validate", response_model=ExpiringTokenModel, tags=["Authentication"])
async def login_otp_validation(otp_body: OtpValidationRequestBody):
    return AppService.login_otp_validation(otp_body)


@app.post("/user/logout", response_model=LogoutModel, tags=["Authentication"])
async def user_logout(user_id: str = Depends(verify_user)):
    return AppService(user_id).user_logout()


@app.get('/user/details', response_model=UserDetailsModel, tags=["User"])
async def get_user_details(user_id: str = Depends(verify_user)):
    return UserService(user_id).get_user_details()


@app.put('/user/details', response_model=UserDetailsModel, tags=["User"])
async def update_user_details(payload: UserDetails, user_id: str = Depends(verify_user)):
    return UserService(user_id).set_details(payload)


@app.post('/user/spot/add', response_model=GenericResponseModel, tags=["Spot"])
async def user_spot_add(spot_details: AddSpotLocationModel, user_id: str = Depends(verify_user)):
    response = UserService(user_id).add_spot(spot_details)
    return response


@app.post('/user/spot/image/add', response_model=List[str], tags=["Spot"])
async def user_spot_image_add(images: List[str], background_tasks: BackgroundTasks, user_id: str = Depends(verify_user)):
    return SpotImageService(user_id).add_images(images, background_tasks)


@app.post('/spot/get', response_model=Union[List[SpotModel], List[SpotModelObfuscated]], tags=["Spot"])
async def spots_get(location: Location, distance: int = 5000, spend_karma: bool = True, user_id: str = Depends(verify_user)):
    return SpotService(user_id).fetch_spot(location, distance, spend_karma)

@app.get('/spot/bookmark/{spot_id}', response_model=List[SpotModel], tags=["Spot"])
async def add_bookmark(spot_id: str, user_id: str = Depends(verify_user)):
    return SpotService(user_id).bookmark_spot(spot_id)

@app.get('/spot/isbookmarked/{spot_id}', response_model=bool, tags=["Spot"])
async def get_is_bookmarked(spot_id: str, user_id: str = Depends(verify_user)):
    return SpotService(user_id).is_bookmarked(spot_id)

@app.get('/spot/bookmarks', response_model=List[SpotModel], tags=["Spot"])
async def get_bookmarks(user_id: str = Depends(verify_user)):
    return SpotService(user_id).fetch_bookmarks()

@app.delete('/spot/bookmark/{spot_id}', response_model=List[SpotModel], tags=["Spot"])
async def remove_bookmark(spot_id: str, user_id: str = Depends(verify_user)):
    return SpotService(user_id).delete_bookmark(spot_id)


@app.post('/spot/review/{spot_id}', response_model=GenericResponseModel, tags=["Spot"])
async def spot_review(spot_id: str, review: ReviewModel, user_id: str = Depends(verify_user)):
    return SpotService(user_id).review_spot(spot_id, review)


@app.get('/spot/get/{spot_id}', response_model=SpotModel, tags=["Spot"])
async def spot_get_by_id(spot_id: str, user_id: str = Depends(verify_user)):
    return SpotService(user_id).fetch_spot_by_id(spot_id)


@app.get('/spot/search', response_model=Union[List[SpotModel], List[SpotModelObfuscated]], tags=["Spot"])
async def search_spot(query: str, user_id: str = Depends(verify_user)):
    return SpotService(user_id).search_spot(query)


@app.post('/reservation/create/{spot_id}', tags=["Rent"], response_model=ReservationModel)
async def spot_reservation(timeslot: TimeSlot, user_id: str = Depends(verify_user), spot_id: str = Depends(verify_private_spot)):
    return SpotService(user_id).reserve_spot(spot_id, timeslot)


@app.post('/reservation/respond', tags=["Rent"], response_model=ReservationModel)
async def spot_reservation(response: RespondReservationModel, user_id: str = Depends(verify_user)):
    return SpotService(user_id).process_reservation_response(response)


@app.get('/reservation/list/created', tags=["Rent"], response_model=List[ReservationModel])
def list_created_reservations(user_id: str = Depends(verify_user)):
    return UserService(user_id).list_created_reservations()


@app.get('/reservation/list/raised', tags=["Rent"], response_model=List[RaisedReservations])
def list_raised_reservations(user_id: str = Depends(verify_user)):
    return UserService(user_id).list_raised_reservations()


@app.get('/reservation/list/accepted', tags=["Rent"], response_model=List[ReservationModel])
def list_accepted_reservations(user_id: str = Depends(verify_user)):
    return UserService(user_id).list_accepted_reservations()


@app.post('/user/premium/initiate', tags=["User"], response_model=InitiatePremiumResponse)
def user_initiate_premium(user_id: str = Depends(verify_user)):
    return UserService(user_id).initiate_premium()


@app.post('/user/premium/complete', tags=["User"], response_model=UserDetailsModel)
def user_complete_premium(transaction: TransactionCompleteRequest, user_id: str = Depends(verify_user)):
    return UserService(user_id).complete_premium(transaction)


@app.exception_handler(SopaExceptions)
async def handle_sopa_exceptions(request: Request, exc: SopaExceptions):
    trace = traceback.format_exc()
    logger.error(f'handle_sopa_exceptions: {trace}')
    raised_exc = HTTPException(
        status_code=exc.status_code or status.HTTP_503_SERVICE_UNAVAILABLE, detail=exc.detail())
    return await http_exception_handler(request, raised_exc)


@app.exception_handler(HTTPException)
async def handle_http_exceptions(request: Request, exc: HTTPException):
    trace = traceback.format_exc()
    logger.error(f'handle_http_exceptions: {trace}')
    return await http_exception_handler(request, exc)


@app.exception_handler(RequestValidationError)
async def handle_validation_errors(request: Request, exc: RequestValidationError):
    trace = traceback.format_exc()
    logger.error(f'handle_validation_errors: {trace}')
    response = await request_validation_exception_handler(request, exc)
    return response


@app.exception_handler(Exception)
def handle_unhandled_exceptions(request: Request, exc: Exception):
    logger.warn(f'Error caught {exc.__class__.__name__}')
    if isinstance(exc, SopaExceptions):
        return handle_sopa_exceptions(request, exc)
    elif isinstance(exc, HTTPException):
        return handle_http_exceptions(request, exc)
    elif isinstance(exc, RequestValidationError):
        return handle_validation_errors(request, exc)
    trace = traceback.format_exc()
    logger.error(f'handle_unhandled_errors: {trace}')
    return http_exception_handler(request, HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Experienced Downtime"))
