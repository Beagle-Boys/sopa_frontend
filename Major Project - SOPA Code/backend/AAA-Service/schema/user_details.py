from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class Location(BaseModel):
    latitude: float = Field(...)
    longitude: float = Field(...)
    altitude: Optional[float] = Field(None)

class Address(BaseModel):
    data: str = Field(..., description="Address Specification")
    location: Location = Field(..., description="Location Specification")


class UserDetailsModel(BaseModel):
    userId: str = Field(..., description="User Id")
    mobile: str = Field(..., description="Mobile Number", example='9818559742')
    countryCode: str = Field(..., description="Country Code", example='+91')
    email: Optional[str] = Field(None,description='Email Id', example='some@email.com')
    userName: str = Field(..., description='User Name', example='First Last')
    imageUrl: Optional[str] = Field(None, description='Avatar Image URL')
    address: Address = Field(None, title="Address")
    karma: int = Field(0, title="Karma")
    credibilityScore: int = Field(0, title="Credibility Score")
    dob: datetime = Field(None, title="Date of Birth")