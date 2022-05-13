from pydantic import BaseModel, Field


class ApiValidationResponseBody(BaseModel):
    is_authentic: bool = Field(...)
