from typing import Optional
from pydantic import Field
from common_files.enums import ReservationResponseEnum
from models.base_model import BasicModel

class RespondReservationModel(BasicModel):
    reservation_id: str = Field(...)
    response: ReservationResponseEnum = Field(...)
    requested_amount: Optional[float] = Field(None)