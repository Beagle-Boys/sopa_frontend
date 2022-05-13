from pydantic import BaseModel, Field


class ExpiringToken(BaseModel):
    auth: str = Field(...)
