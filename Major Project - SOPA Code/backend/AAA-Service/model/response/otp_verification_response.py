from pydantic import BaseModel, Field


class OtpVerificationResponseBody(BaseModel):
    otpId: str = Field(...)

