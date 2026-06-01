from typing import List, Tuple, Optional
from uuid import UUID
from decimal import Decimal
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.database import models
from app.schemas import orders as schemas
from app.utils.errors import (
    ResourceNotFoundException, 
    InsufficientStockException, 
    NegativeStockException,
    InventoryFlowException
)

class OrderService:
    @staticmethod
    async def create_order(db: AsyncSession, order_in: schemas.OrderCreate) -> models.Order:
        # 1. Validate Customer
        customer = await db.get(models.Customer, order_in.customer_id)
        if not customer:
            raise ResourceNotFoundException(message=f"Customer with ID {order_in.customer_id} not found")

        # Create base order
        db_order = models.Order(
            customer_id=order_in.customer_id,
            total_amount=Decimal("0.00"),
            status="Pending"
        )
        db.add(db_order)
        await db.flush()  # Populates db_order.id

        total_amount = Decimal("0.00")
        order_items = []

        # 2. Process and Validate Items in a single transaction context
        for item in order_in.items:
            product = await db.get(models.Product, item.product_id)
            if not product:
                raise ResourceNotFoundException(message=f"Product with ID {item.product_id} not found")

            # Validate stock quantity
            if product.stock_quantity < item.quantity:
                raise InsufficientStockException(
                    message=f"Inventory insufficient for product: {product.name} (SKU: {product.sku}). Requested: {item.quantity}, Available: {product.stock_quantity}"
                )

            # Deduct stock
            new_stock = product.stock_quantity - item.quantity
            if new_stock < 0:
                raise NegativeStockException(message=f"Stock cannot be negative for product: {product.name}")
            
            product.stock_quantity = new_stock

            # Calculate prices
            subtotal = Decimal(str(item.quantity)) * product.price
            total_amount += subtotal

            # Create OrderItem
            db_item = models.OrderItem(
                order_id=db_order.id,
                product_id=product.id,
                quantity=item.quantity,
                unit_price=product.price,
                subtotal=subtotal
            )
            db.add(db_item)
            order_items.append(db_item)

        # 3. Finalize Order Totals
        db_order.total_amount = total_amount
        db_order.items = order_items

        await db.flush()
        
        # Load relationships for serialized output
        await db.refresh(db_order)
        return await OrderService.get_order_by_id(db, db_order.id)

    @staticmethod
    async def get_order_by_id(db: AsyncSession, order_id: UUID) -> models.Order:
        query = select(models.Order).where(models.Order.id == order_id).options(
            selectinload(models.Order.customer),
            selectinload(models.Order.items).selectinload(models.OrderItem.product)
        )
        result = await db.execute(query)
        order = result.scalar_one_or_none()
        if not order:
            raise ResourceNotFoundException(message=f"Order with ID {order_id} not found")
        return order

    @staticmethod
    async def list_orders(
        db: AsyncSession,
        page: int = 1,
        limit: int = 10
    ) -> Tuple[List[models.Order], int]:
        query = select(models.Order).options(
            selectinload(models.Order.customer),
            selectinload(models.Order.items).selectinload(models.OrderItem.product)
        )

        # Count total
        count_query = select(func.count()).select_from(models.Order)
        total_count_result = await db.execute(count_query)
        total_count = total_count_result.scalar_one()

        # Sort and Page
        query = query.order_by(desc(models.Order.created_at))
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)

        result = await db.execute(query)
        orders = result.scalars().all()
        return orders, total_count

    @staticmethod
    async def update_status(db: AsyncSession, order_id: UUID, status_in: schemas.OrderStatusUpdate) -> models.Order:
        order = await OrderService.get_order_by_id(db, order_id)
        old_status = order.status
        new_status = status_in.status

        if old_status == new_status:
            return order

        # Transition logic
        # If moving to Cancelled, we restore stock levels (if not already cancelled)
        if new_status == "Cancelled" and old_status in ("Pending", "Processing"):
            for item in order.items:
                product = await db.get(models.Product, item.product_id)
                if product:
                    product.stock_quantity += item.quantity

        # If moving FROM Cancelled to Pending/Processing, we check and re-deduct stock
        elif old_status == "Cancelled" and new_status in ("Pending", "Processing", "Completed"):
            for item in order.items:
                product = await db.get(models.Product, item.product_id)
                if product:
                    if product.stock_quantity < item.quantity:
                        raise InsufficientStockException(
                            message=f"Cannot reinstate order. Stock is insufficient for {product.name}. Required: {item.quantity}, Available: {product.stock_quantity}"
                        )
                    product.stock_quantity -= item.quantity

        order.status = new_status
        await db.flush()
        return order

    @staticmethod
    async def delete_order(db: AsyncSession, order_id: UUID) -> None:
        # Load full order
        order = await OrderService.get_order_by_id(db, order_id)

        # Restore stock if deleting an active (Pending/Processing) order
        if order.status in ("Pending", "Processing"):
            for item in order.items:
                product = await db.get(models.Product, item.product_id)
                if product:
                    product.stock_quantity += item.quantity

        await db.delete(order)
        await db.flush()
