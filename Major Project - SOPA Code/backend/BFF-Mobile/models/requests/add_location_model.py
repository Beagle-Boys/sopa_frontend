from typing import List
from common_files.enums import SpotTypeEnum
from models.base_model import BasicModel
from pydantic import Field

from models.requests.user_details import Address


class AddSpotLocationModel(BasicModel):
    address: Address = Field(..., title="Address Specification")
    images: List[str] = Field(..., title="Image URLs",
                              max_items=5, min_items=2)
    type_: SpotTypeEnum = Field(
        SpotTypeEnum.PUBLIC, description="Spot Type", alias="type")
