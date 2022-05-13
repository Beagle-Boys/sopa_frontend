from models.requests.timeslot import TimeSlot

class TimeSlotSchema(TimeSlot):
    start: int
    end: int