from pydantic import BaseModel, Field


class ApiValidationRequestBody(BaseModel):
    auth: str = Field(...)
