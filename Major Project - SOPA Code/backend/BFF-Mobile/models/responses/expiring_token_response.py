from pydantic import Field

from models.base_model import BasicModel


class ExpiringToken(BasicModel):
    auth: str = Field(...)
