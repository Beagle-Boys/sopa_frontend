from typing import Optional

from pydantic import Field

from models.base_model import BasicModel

class ExistingUser(BasicModel):
    countryCode: str = Field("+91")
    mobile: str = Field(...,min_length=10, max_length=10)

class UserModel(ExistingUser):
    userName: str = Field(...)
    googleId: Optional[str] = Field(None)
    email: Optional[str] = Field(None)
    imageUrl: Optional[str] = Field(None)
