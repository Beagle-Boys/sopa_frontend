from typing import Optional
from pydantic import BaseModel, Field


class UserSchema(BaseModel):
    userId: str = Field(...)
    userName: Optional[str]
    mobile: Optional[str]
    googleId: Optional[str]
    email: Optional[str]
    imageUrl: Optional[str]
    isActive: bool = Field(...)
