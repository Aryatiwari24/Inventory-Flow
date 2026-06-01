from uuid import UUID
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.database import models
from app.schemas import orders as schemas
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["Orders"])

def serialize_order(order: models.Order) -> dict:
    """Helper to convert ORM order to standard dictionary matching Pydantic schema"""
    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "customer_name": order.customer.full_name if order.customer else "Unknown Customer",
        "total_amount": order.total_amount,
        "status": order.status,
        "created_at": order.created_at,
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name if item.product else "Unknown Product",
                "product_sku": item.product.sku if item.product else "N/A",
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "subtotal": item.subtotal
            }
            for item in order.items
        ]
    }


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: schemas.OrderCreate,
    db: AsyncSession = Depends(get_db)
):
    db_order = await OrderService.create_order(db, order_in)
    return {
        "success": True,
        "message": "Order created successfully",
        "data": serialize_order(db_order)
    }


@router.get("/", response_model=dict)
async def list_orders(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db)
):
    orders, total = await OrderService.list_orders(db, page, limit)
    serialized_orders = [serialize_order(order) for order in orders]
    return {
        "success": True,
        "total": total,
        "page": page,
        "limit": limit,
        "data": serialized_orders
    }


@router.get("/{id}", response_model=dict)
async def get_order(
    id: UUID,
    db: AsyncSession = Depends(get_db)
):
    db_order = await OrderService.get_order_by_id(db, id)
    return {
        "success": True,
        "data": serialize_order(db_order)
    }


@router.put("/{id}/status", response_model=dict)
async def update_order_status(
    id: UUID,
    status_in: schemas.OrderStatusUpdate,
    db: AsyncSession = Depends(get_db)
):
    db_order = await OrderService.update_status(db, id, status_in)
    return {
        "success": True,
        "message": "Order status updated successfully",
        "data": serialize_order(db_order)
    }


@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_order(
    id: UUID,
    db: AsyncSession = Depends(get_db)
):
    await OrderService.delete_order(db, id)
    return {
        "success": True,
        "message": "Order deleted successfully, and associated inventory has been adjusted."
    }
