from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas import customers as schemas
from app.services.customer_service import CustomerService

router = APIRouter(prefix="/customers", tags=["Customers"])

class CustomerListResponse(BaseModel):
    success: bool
    total: int
    page: int
    limit: int
    data: List[schemas.Customer]


@router.post("/", response_model=schemas.Customer, status_code=status.HTTP_201_CREATED)
async def create_customer(
    customer_in: schemas.CustomerCreate,
    db: AsyncSession = Depends(get_db)
):
    return await CustomerService.create_customer(db, customer_in)


@router.get("/", response_model=CustomerListResponse)
async def list_customers(
    search: Optional[str] = Query(None, description="Search term for name, email, or phone"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db)
):
    customers, total = await CustomerService.list_customers(db, search, page, limit)
    return {
        "success": True,
        "total": total,
        "page": page,
        "limit": limit,
        "data": customers
    }


@router.get("/{id}", response_model=schemas.CustomerProfile)
async def get_customer_profile(
    id: UUID,
    db: AsyncSession = Depends(get_db)
):
    return await CustomerService.get_customer_profile(db, id)


@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_customer(
    id: UUID,
    db: AsyncSession = Depends(get_db)
):
    await CustomerService.delete_customer(db, id)
    return {
        "success": True,
        "message": "Customer successfully deleted."
    }
