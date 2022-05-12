from pydantic import Field
from models.base_model import BasicModel

class TimeSlot(BasicModel):
    start: str = Field(...,regex=r'((0[0-9])|(1[0-9])|(2[0-3]))([0-5][0-9])')
    end: str = Field(...,regex=r'((0[0-9])|(1[0-9])|(2[0-3]))([0-5][0-9])')