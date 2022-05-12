from datetime import datetime
from pydantic import Field
from typing import Optional
from common_files.enums import UserTypeEnum
from models.base_model import BasicModel
from models.requests.user_details import Address

class UserDetailsModel(BasicModel):
    mobile: str = Field(..., description="Mobile Number", example='9818559742')
    countryCode: str = Field(..., description="Country Code", example='+91')
    email: Optional[str] = Field(
        description='Email Id', example='some@email.com')
    userName: str = Field(..., description='User Name', example='First Last')
    imageUrl: Optional[str] = Field(None, description='Avatar Image URL')
    address: Address = Field(None, title="Address")
    karma: int = Field(0, title="Karma")
    credibilityScore: int = Field(0, title="Credibility Score")
    dob: int = Field(None, title="Date of Birth")
    type: UserTypeEnum = Field(UserTypeEnum.COMMON, title="User Type")
    premiumTill: datetime = Field(None)