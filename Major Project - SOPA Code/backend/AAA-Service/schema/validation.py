from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field


class ValidationSchema(BaseModel):
    otpId: str = Field(...)
    otp: str = Field(...)
    createdAt: datetime
    userData: Optional[Any] = Field(None)

