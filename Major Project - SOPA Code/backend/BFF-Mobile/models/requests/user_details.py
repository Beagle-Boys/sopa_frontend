from pydantic import Field
from typing import Optional

from models.base_model import BasicModel


class Location(BasicModel):
    longitude: float = Field(..., ge=-180, le=180)
    latitude: float = Field(..., ge=-90, le=90)
    altitude: Optional[float] = Field(None)


class AddressData(BasicModel):
    name: str = Field(..., description="Address Tag or Name")
    address: str = Field(..., description="Full Multiline Address")

class Address(BasicModel):
    data: AddressData = Field(..., description="Address Specification")
    location: Location = Field(..., description="Location Specification")


class UserDetails(BasicModel):
    name: str = Field(..., title="Name")
    email: Optional[str] = Field(None, title="Email")
    dob: Optional[int] = Field(None, title="Date of Birth")
    address: Optional[Address] = Field(None, title="Address")
    imageUrl: Optional[str] = Field(None, description='Avatar Image URL')
