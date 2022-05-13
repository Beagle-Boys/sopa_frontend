from pydantic import Field
from typing import Optional

from models.base_model import BasicModel


class OtpValidationRequestBody(BasicModel):
    otpId: str = Field(...)
    otp: str = Field(...)
    mobile: Optional[str]
