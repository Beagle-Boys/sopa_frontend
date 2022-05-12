from datetime import datetime
from typing import List, Optional
from models.base_model import BasicModel
from pydantic import Field

from models.requests.add_location_model import AddSpotLocationModel


class ReviewModel(BasicModel):
    comment: str = Field(..., description="Comment")
    stars: int = Field(..., description="Stars", ge=1, le=5)


class PublicUserModel(BasicModel):
    userName: str = Field(..., description="User Name")
    imageUrl: Optional[str] = Field(None, description="User Image")


class PublicReviewModel(ReviewModel, PublicUserModel):
    date: datetime = Field(..., description="Date")


class ReviewProcessModel(ReviewModel):
    reviewId: str = Field(..., description="Review Id")
    from_: str = Field(..., description="From userid", alias="from")
    date: datetime = Field(..., description="timestamp")
    spotId: str = Field(..., description="Spot Id")


class SpotProcessModel(AddSpotLocationModel):
    spotId: str = Field(..., description="Spot Id")
    by: str = Field(..., description="User Id")
    addedTimestamp: datetime = Field(..., description="Added Timestamp")
    useCount: int = Field(0, description="Use Count")
    lastActivity: datetime = Field(..., description="Last Activity")
    totalRating: float = Field(0, description="Total Rating")


class SpotModel(AddSpotLocationModel):
    spotId: str = Field(..., description="Spot Id")
    reviews: List[PublicReviewModel] = Field([], description="Reviews")
    by: PublicUserModel = Field(..., description="User Details")
    addedTimestamp: datetime = Field(..., description="Added Timestamp")
    useCount: int = Field(0, description="Use Count")
    lastActivity: datetime = Field(..., description="Last Activity")
    totalRating: float = Field(0, description="Total Rating")


class SpotModelObfuscated(SpotModel):
    address: None = Field(None)
