from pydantic import BaseModel, Field
from typing import Optional


class OtpValidationRequestBody(BaseModel):
    otpId: str = Field(...)
    otp: str = Field(...)
    mobile: Optional[str]
