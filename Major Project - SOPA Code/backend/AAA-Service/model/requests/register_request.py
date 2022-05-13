from pydantic import BaseModel, Field
from typing import Optional


class ExistingUser(BaseModel):
    countryCode: str = Field("+91")
    mobile: str = Field(...,min_length=10, max_length=10)

class NewUser(ExistingUser):
    userName: str = Field(...)
    googleId: Optional[str] = Field(None)
    email: Optional[str] = Field(None)
    imageUrl: Optional[str] = Field(None)
    isActive: bool = Field(False)