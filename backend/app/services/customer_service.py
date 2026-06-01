from typing import List, Tuple, Optional
from uuid import UUID
from decimal import Decimal
from sqlalchemy import select, func, or_, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import models
from app.schemas import customers as schemas
from app.utils.errors import DuplicateEmailException, ResourceNotFoundException, DeleteRestrictedException

class CustomerService:
    @staticmethod
    async def create_customer(db: AsyncSession, customer_in: schemas.CustomerCreate) -> models.Customer:
        # Check email uniqueness
        email_check = await db.execute(
            select(models.Customer).where(models.Customer.email == customer_in.email)
        )
        if email_check.scalar_one_or_none() is not None:
            raise DuplicateEmailException()

        db_customer = models.Customer(
            full_name=customer_in.full_name,
            email=customer_in.email,
            phone_number=customer_in.phone_number,
            address=customer_in.address
        )
        db.add(db_customer)
        await db.flush()
        return db_customer

    @staticmethod
    async def get_customer_by_id(db: AsyncSession, customer_id: UUID) -> models.Customer:
        customer = await db.get(models.Customer, customer_id)
        if not customer:
            raise ResourceNotFoundException(message=f"Customer with ID {customer_id} not found")
        return customer

    @staticmethod
    async def get_customer_profile(db: AsyncSession, customer_id: UUID) -> schemas.CustomerProfile:
        customer = await CustomerService.get_customer_by_id(db, customer_id)

        # Get customer orders
        orders_query = select(models.Order).where(models.Order.customer_id == customer_id).order_by(desc(models.Order.created_at))
        result = await db.execute(orders_query)
        orders = result.scalars().all()

        total_spent = Decimal("0.00")
        order_summaries = []
        for order in orders:
            order_summaries.append(
                schemas.CustomerOrderSummary(
                    id=order.id,
                    total_amount=order.total_amount,
                    status=order.status,
                    created_at=order.created_at
                )
            )
            # Sum up total spent from completed/non-cancelled orders
            if order.status != "Cancelled":
                total_spent += order.total_amount

        return schemas.CustomerProfile(
            id=customer.id,
            full_name=customer.full_name,
            email=customer.email,
            phone_number=customer.phone_number,
            address=customer.address,
            created_at=customer.created_at,
            orders=order_summaries,
            total_spent=total_spent,
            order_count=len(orders)
        )

    @staticmethod
    async def list_customers(
        db: AsyncSession,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 10
    ) -> Tuple[List[models.Customer], int]:
        query = select(models.Customer)

        # Apply multi-field search (name, email, phone)
        if search:
            search_filter = f"%{search}%"
            query = query.where(
                or_(
                    models.Customer.full_name.ilike(search_filter),
                    models.Customer.email.ilike(search_filter),
                    models.Customer.phone_number.ilike(search_filter)
                )
            )

        # Calculate Total Count before pagination
        count_query = select(func.count()).select_from(query.subquery())
        total_count_result = await db.execute(count_query)
        total_count = total_count_result.scalar_one()

        # Apply Pagination & default sort
        query = query.order_by(desc(models.Customer.created_at))
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)

        result = await db.execute(query)
        customers = result.scalars().all()
        return customers, total_count

    @staticmethod
    async def delete_customer(db: AsyncSession, customer_id: UUID) -> None:
        customer = await CustomerService.get_customer_by_id(db, customer_id)

        # Restrict deletion if customer has orders
        linked_orders = await db.execute(
            select(models.Order).where(models.Order.customer_id == customer_id).limit(1)
        )
        if linked_orders.scalar_one_or_none() is not None:
            raise DeleteRestrictedException(
                message="Cannot delete customer because they have order history associated with them."
            )

        await db.delete(customer)
        await db.flush()
