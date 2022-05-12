from pydantic import Field

from models.base_model import BasicModel


class ApiValidationResponseBody(BasicModel):
    is_authentic: bool = Field(...)
