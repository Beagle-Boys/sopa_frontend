from pydantic import BaseModel, Field
from datetime import datetime


class Token(BaseModel):
    userId: str = Field(...)
    auth: str = Field(...)
    createdAt: datetime = Field(...)
