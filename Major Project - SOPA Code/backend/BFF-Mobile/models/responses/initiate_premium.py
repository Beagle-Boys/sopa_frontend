from typing import Optional
from pydantic import Field
from common_files.constants import RAZORPAY_KEY_ID
from models.base_model import BasicModel


class RazorpayOrderModel(BasicModel):
    id: str
    entity: str
    amount: float
    amount_paid: float
    amount_due: float
    currency: str
    receipt: str
    offer_id: Optional[str]
    status: str
    attempts: float
    notes: dict
    created_at: float

class PaymentPrefill(BasicModel):
    email: str =  Field("")
    contact: str = Field(...,min_length=10,max_length=10)
    name: str = Field("")


class InitiatePremiumResponse(BasicModel):
    order_id: str
    name: str = Field("SOPA - Parking Premium")
    amount: float
    receipt: str
    currency: str = Field("INR")
    prefill: PaymentPrefill
    key: str = Field(RAZORPAY_KEY_ID)
