from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field, EmailStr

class CustomerBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255, description="Full Name")
    email: EmailStr = Field(..., description="Unique customer email address")
    phone_number: Optional[str] = Field(None, max_length=50, description="Contact Phone Number")
    address: Optional[str] = Field(None, description="Physical billing/shipping address")


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = None


class Customer(CustomerBase):
    id: UUID
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


# Small schema to represent orders in Customer Profile
class CustomerOrderSummary(BaseModel):
    id: UUID
    total_amount: Decimal
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


# Profile Schema containing purchase history
class CustomerProfile(Customer):
    orders: List[CustomerOrderSummary] = []
    total_spent: Decimal = Decimal("0.00")
    order_count: int = 0

    model_config = {
        "from_attributes": True
    }
