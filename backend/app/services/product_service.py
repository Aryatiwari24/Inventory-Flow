from typing import List, Tuple, Optional
from uuid import UUID
from sqlalchemy import select, func, or_, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import models
from app.schemas import products as schemas
from app.utils.errors import DuplicateSKUException, ResourceNotFoundException, DeleteRestrictedException

class ProductService:
    @staticmethod
    async def create_product(db: AsyncSession, product_in: schemas.ProductCreate) -> models.Product:
        # Check SKU uniqueness
        sku_check = await db.execute(
            select(models.Product).where(models.Product.sku == product_in.sku)
        )
        if sku_check.scalar_one_or_none() is not None:
            raise DuplicateSKUException()

        db_product = models.Product(
            name=product_in.name,
            sku=product_in.sku,
            description=product_in.description,
            category=product_in.category,
            price=product_in.price,
            stock_quantity=product_in.stock_quantity,
            image_url=product_in.image_url
        )
        db.add(db_product)
        await db.flush()
        return db_product

    @staticmethod
    async def get_product_by_id(db: AsyncSession, product_id: UUID) -> models.Product:
        product = await db.get(models.Product, product_id)
        if not product:
            raise ResourceNotFoundException(message=f"Product with ID {product_id} not found")
        return product

    @staticmethod
    async def list_products(
        db: AsyncSession,
        search: Optional[str] = None,
        category: Optional[str] = None,
        stock_status: Optional[str] = None,  # in_stock, low_stock, out_of_stock
        sort_by: str = "created_at",
        sort_order: str = "desc",
        page: int = 1,
        limit: int = 10
    ) -> Tuple[List[models.Product], int]:
        query = select(models.Product)
        
        # Apply Search Filters
        if search:
            search_filter = f"%{search}%"
            query = query.where(
                or_(
                    models.Product.name.ilike(search_filter),
                    models.Product.sku.ilike(search_filter),
                    models.Product.category.ilike(search_filter)
                )
            )

        # Apply Category Filter
        if category:
            query = query.where(models.Product.category == category)

        # Apply Stock Status Filter
        if stock_status:
            if stock_status == "out_of_stock":
                query = query.where(models.Product.stock_quantity == 0)
            elif stock_status == "low_stock":
                query = query.where(models.Product.stock_quantity > 0).where(models.Product.stock_quantity <= 20)
            elif stock_status == "in_stock":
                query = query.where(models.Product.stock_quantity > 20)

        # Calculate Total Count before pagination
        count_query = select(func.count()).select_from(query.subquery())
        total_count_result = await db.execute(count_query)
        total_count = total_count_result.scalar_one()

        # Apply Sorting
        model_column = getattr(models.Product, sort_by, models.Product.created_at)
        if sort_order == "desc":
            query = query.order_by(desc(model_column))
        else:
            query = query.order_by(asc(model_column))

        # Apply Pagination
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)

        result = await db.execute(query)
        products = result.scalars().all()
        return products, total_count

    @staticmethod
    async def update_product(
        db: AsyncSession, product_id: UUID, product_in: schemas.ProductUpdate
    ) -> models.Product:
        product = await ProductService.get_product_by_id(db, product_id)
        
        # If updating SKU, check uniqueness
        if product_in.sku is not None and product_in.sku != product.sku:
            sku_check = await db.execute(
                select(models.Product).where(models.Product.sku == product_in.sku)
            )
            if sku_check.scalar_one_or_none() is not None:
                raise DuplicateSKUException()

        update_data = product_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)

        await db.flush()
        return product

    @staticmethod
    async def delete_product(db: AsyncSession, product_id: UUID) -> None:
        product = await ProductService.get_product_by_id(db, product_id)

        # Check if the product has orders (safety rules)
        linked_orders = await db.execute(
            select(models.OrderItem).where(models.OrderItem.product_id == product_id).limit(1)
        )
        if linked_orders.scalar_one_or_none() is not None:
            raise DeleteRestrictedException(
                message="Cannot delete product because it is referenced in one or more orders. Try updating its stock to 0 instead."
            )

        await db.delete(product)
        await db.flush()
