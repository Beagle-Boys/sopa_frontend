from datetime import datetime
from typing import List, Optional
from common_files.enums import ReservationStatusEnum
from models.base_model import BasicModel
from schemas.timeslot_schema import TimeSlotSchema

class ReservationModel(BasicModel):
    reservation_id: str
    spot_id: str
    name: Optional[str]
    timeslot: TimeSlotSchema
    created_at: datetime
    status: ReservationStatusEnum
    amount: Optional[float]

class RaisedReservations(BasicModel):
    spot_id: str
    name: Optional[str]
    reservations: List[ReservationModel]