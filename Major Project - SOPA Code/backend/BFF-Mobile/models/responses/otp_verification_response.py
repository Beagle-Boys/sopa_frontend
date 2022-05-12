from pydantic import Field

from models.base_model import BasicModel


class OtpVerificationResponseBody(BasicModel):
    otpId: str = Field(...)

