from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_validator

class OrderItemCreate(BaseModel):
    product_id: UUID = Field(..., description="ID of the product to order")
    quantity: int = Field(..., gt=0, description="Quantity to purchase (must be greater than 0)")


class OrderCreate(BaseModel):
    customer_id: UUID = Field(..., description="Customer placing the order")
    items: List[OrderItemCreate] = Field(..., min_length=1, description="List of items in the order")


class OrderStatusUpdate(BaseModel):
    status: str = Field(..., description="Pending, Processing, Completed, Cancelled")

    @field_validator('status')
    @classmethod
    def validate_status(cls, value: str) -> str:
        allowed = {"Pending", "Processing", "Completed", "Cancelled"}
        if value not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return value


class OrderItem(BaseModel):
    id: UUID
    product_id: UUID
    product_name: Optional[str] = None
    product_sku: Optional[str] = None
    quantity: int
    unit_price: Decimal
    subtotal: Decimal

    model_config = {
        "from_attributes": True
    }


class Order(BaseModel):
    id: UUID
    customer_id: UUID
    customer_name: Optional[str] = None
    total_amount: Decimal
    status: str
    created_at: datetime
    items: List[OrderItem] = []

    model_config = {
        "from_attributes": True
    }
