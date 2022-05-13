from models.base_model import BasicModel
from pydantic import Field

class GenericResponseModel(BasicModel):
    result: bool = Field(..., description="Result")
    message: str = Field(..., description="Message")
