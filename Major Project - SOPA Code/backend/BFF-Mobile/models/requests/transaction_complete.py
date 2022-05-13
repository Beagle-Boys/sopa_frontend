from models.base_model import BasicModel

class TransactionCompleteRequest(BasicModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    receipt: str