from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_validator

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Product Name")
    sku: str = Field(..., min_length=1, max_length=100, description="Unique Stock Keeping Unit (SKU)")
    description: Optional[str] = Field(None, description="Detailed product description")
    category: str = Field(..., min_length=1, max_length=100, description="Product Category")
    price: Decimal = Field(..., gt=0, description="Unit Price of the product")
    stock_quantity: int = Field(..., ge=0, description="Initial stock level (cannot be negative)")
    image_url: Optional[str] = Field(None, description="Image URL representing the product")

    @field_validator('stock_quantity')
    @classmethod
    def validate_stock(cls, value: int) -> int:
        if value < 0:
            raise ValueError("Stock cannot be negative")
        return value


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    sku: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[Decimal] = Field(None, gt=0)
    stock_quantity: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None

    @field_validator('stock_quantity')
    @classmethod
    def validate_stock(cls, value: Optional[int]) -> Optional[int]:
        if value is not None and value < 0:
            raise ValueError("Stock cannot be negative")
        return value


class Product(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }
