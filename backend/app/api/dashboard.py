from datetime import datetime, timedelta
from decimal import Decimal
from fastapi import APIRouter, Depends
from sqlalchemy import select, func, Date
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.database import models

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/", response_model=dict)
async def get_dashboard_data(db: AsyncSession = Depends(get_db)):
    # 1. Total Products
    products_count_res = await db.execute(select(func.count(models.Product.id)))
    total_products = products_count_res.scalar_one()

    # 2. Total Customers
    customers_count_res = await db.execute(select(func.count(models.Customer.id)))
    total_customers = customers_count_res.scalar_one()

    # 3. Total Orders
    orders_count_res = await db.execute(select(func.count(models.Order.id)))
    total_orders = orders_count_res.scalar_one()

    # 4. Total Revenue (exclude Cancelled orders)
    revenue_res = await db.execute(
        select(func.sum(models.Order.total_amount)).where(models.Order.status != "Cancelled")
    )
    total_revenue_val = revenue_res.scalar_one()
    total_revenue = float(total_revenue_val) if total_revenue_val is not None else 0.0

    # 5. Low Stock Products (stock_quantity > 0 and stock_quantity <= 20)
    low_stock_res = await db.execute(
        select(func.count(models.Product.id))
        .where(models.Product.stock_quantity > 0)
        .where(models.Product.stock_quantity <= 20)
    )
    low_stock = low_stock_res.scalar_one()

    # 6. Out of Stock Products (stock_quantity == 0)
    out_of_stock_res = await db.execute(
        select(func.count(models.Product.id)).where(models.Product.stock_quantity == 0)
    )
    out_of_stock = out_of_stock_res.scalar_one()

    # 7. Inventory Distribution
    in_stock_res = await db.execute(
        select(func.count(models.Product.id)).where(models.Product.stock_quantity > 20)
    )
    in_stock = in_stock_res.scalar_one()

    distribution = {
        "in_stock": in_stock,
        "low_stock": low_stock,
        "out_of_stock": out_of_stock
    }

    # 8. Top 5 Best-Selling Products
    top_products_query = (
        select(
            models.Product.id,
            models.Product.name,
            models.Product.sku,
            func.sum(models.OrderItem.quantity).label("total_sold"),
            func.sum(models.OrderItem.subtotal).label("revenue")
        )
        .join(models.OrderItem, models.Product.id == models.OrderItem.product_id)
        .group_by(models.Product.id)
        .order_by(func.sum(models.OrderItem.quantity).desc())
        .limit(5)
    )
    top_products_res = await db.execute(top_products_query)
    top_products_raw = top_products_res.all()
    
    top_products = [
        {
            "id": row.id,
            "name": row.name,
            "sku": row.sku,
            "total_sold": int(row.total_sold),
            "revenue": float(row.revenue)
        }
        for row in top_products_raw
    ]

    # 9. Orders Trend (Last 7 Days)
    # We will build a continuous list of the last 7 dates to prevent blanks
    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=6)
    
    trend_query = (
        select(
            func.cast(models.Order.created_at, Date).label("order_date"),
            func.count(models.Order.id).label("count"),
            func.sum(models.Order.total_amount).label("revenue")
        )
        .where(models.Order.created_at >= start_date)
        .group_by(func.cast(models.Order.created_at, Date))
        .order_by(func.cast(models.Order.created_at, Date))
    )
    
    trend_res = await db.execute(trend_query)
    trend_raw = trend_res.all()
    
    trend_map = {row.order_date: (int(row.count), float(row.revenue or 0)) for row in trend_raw}
    
    orders_trend = []
    current_date = start_date
    while current_date <= end_date:
        count, revenue = trend_map.get(current_date, (0, 0.0))
        orders_trend.append({
            "date": current_date.strftime("%b %d"),
            "orders": count,
            "revenue": revenue
        })
        current_date += timedelta(days=1)

    # 10. Low Stock Alerts List (retrieve names of items needing attention)
    alert_products_res = await db.execute(
        select(models.Product)
        .where(models.Product.stock_quantity <= 20)
        .order_by(models.Product.stock_quantity.asc())
        .limit(10)
    )
    alert_products = alert_products_res.scalars().all()
    stock_alerts = [
        {
            "id": p.id,
            "name": p.name,
            "sku": p.sku,
            "stock_quantity": p.stock_quantity,
            "category": p.category
        }
        for p in alert_products
    ]

    return {
        "success": True,
        "widgets": {
            "total_products": total_products,
            "total_customers": total_customers,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "low_stock_count": low_stock
        },
        "charts": {
            "distribution": distribution,
            "top_products": top_products,
            "orders_trend": orders_trend
        },
        "stock_alerts": stock_alerts
    }
