from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class PartnerInquiryCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    organization: str = Field(min_length=2, max_length=160)
    organization_type: str = Field(min_length=2, max_length=80)
    monthly_waste_tons: float = Field(gt=0, le=10000)
    email: EmailStr
    message: str = Field(min_length=10, max_length=2000)


class PartnerInquiryResponse(BaseModel):
    id: str
    status: str
    message: str
    created_at: datetime