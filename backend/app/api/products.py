from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas import products as schemas
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: schemas.ProductCreate,
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.create_product(db, product_in)


@router.get("/", response_model=dict)
async def list_products(
    search: Optional[str] = Query(None, description="Search term for name/SKU/category"),
    category: Optional[str] = Query(None, description="Filter products by category"),
    stock_status: Optional[str] = Query(None, description="Filter by stock: in_stock, low_stock, out_of_stock"),
    sort_by: str = Query("created_at", description="Field to sort by (name, sku, price, stock_quantity, created_at)"),
    sort_order: str = Query("desc", description="Sort direction (asc, desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db)
):
    products, total = await ProductService.list_products(
        db, search, category, stock_status, sort_by, sort_order, page, limit
    )
    return {
        "success": True,
        "total": total,
        "page": page,
        "limit": limit,
        "data": products
    }


@router.get("/{id}", response_model=schemas.Product)
async def get_product(
    id: UUID,
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.get_product_by_id(db, id)


@router.put("/{id}", response_model=schemas.Product)
async def update_product(
    id: UUID,
    product_in: schemas.ProductUpdate,
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.update_product(db, id, product_in)


@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_product(
    id: UUID,
    db: AsyncSession = Depends(get_db)
):
    await ProductService.delete_product(db, id)
    return {
        "success": True,
        "message": "Product successfully deleted."
    }
