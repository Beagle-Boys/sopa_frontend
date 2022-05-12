from pydantic import Field

from models.base_model import BasicModel


class LogoutModel(BasicModel):
    result: bool = Field(...,description='Success')