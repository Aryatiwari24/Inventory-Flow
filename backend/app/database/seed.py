import asyncio
import random
import uuid
from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select, delete

# Import relative database connection and models
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.database.session import DATABASE_URL
from app.database import models

async def seed_data():
    print("Connecting to database for seeding...")
    engine = create_async_engine(DATABASE_URL, echo=False)
    AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    async with engine.begin() as conn:
        print("Creating tables in database (if not exists)...")
        await conn.run_sync(models.Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        try:
            # 1. Clear existing database records to allow clean re-seeds
            print("Purging existing records...")
            await session.execute(delete(models.OrderItem))
            await session.execute(delete(models.Order))
            await session.execute(delete(models.Product))
            await session.execute(delete(models.Customer))
            await session.commit()

            print("Database clean. Seeding products...")

            # 2. Seed Products
            products_data = [
                {
                    "name": "MacBook Pro M3 Max",
                    "sku": "ELEC-MBP-M3MX",
                    "description": "16-inch MacBook Pro with M3 Max chip, 36GB RAM, 1TB SSD. Space Black.",
                    "category": "Electronics",
                    "price": Decimal("249999.00"),
                    "stock_quantity": 12,  # Low Stock
                    "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=300"
                },
                {
                    "name": "iPhone 15 Pro Max",
                    "sku": "ELEC-IPH-15PM",
                    "description": "Titanium design, A17 Pro chip, 48MP Camera, 256GB Storage.",
                    "category": "Electronics",
                    "price": Decimal("139900.00"),
                    "stock_quantity": 42,  # In Stock
                    "image_url": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=300"
                },
                {
                    "name": "Sony WH-1000XM5 Headphones",
                    "sku": "ELEC-SNY-XM5",
                    "description": "Industry leading wireless noise cancelling headphones, Silver.",
                    "category": "Electronics",
                    "price": Decimal("29900.00"),
                    "stock_quantity": 8,  # Low Stock
                    "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300"
                },
                {
                    "name": "Ergonomic Standing Desk",
                    "sku": "OFF-DSK-STND",
                    "description": "Dual-motor motorized standing desk with dark oak wood finish tabletop.",
                    "category": "Office Supplies",
                    "price": Decimal("32500.00"),
                    "stock_quantity": 18,  # Low Stock
                    "image_url": "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=300"
                },
                {
                    "name": "Premium Office Task Chair",
                    "sku": "OFF-CHR-TASK",
                    "description": "Breathable mesh back support, 3D armrests, and dynamic lumbar alignment.",
                    "category": "Office Supplies",
                    "price": Decimal("18900.00"),
                    "stock_quantity": 25,  # In Stock
                    "image_url": "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=300"
                },
                {
                    "name": "Espresso Barista Machine",
                    "sku": "KSH-COF-BRST",
                    "description": "15-bar pump espresso maker with integrated milk frother steam wand.",
                    "category": "Kitchen Appliances",
                    "price": Decimal("21500.00"),
                    "stock_quantity": 0,  # Out of Stock
                    "image_url": "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&q=80&w=300"
                },
                {
                    "name": "Ultra-Bullet Blender",
                    "sku": "KSH-BLN-ULTR",
                    "description": "1200W high-speed blending system for nutrient extraction smoothies.",
                    "category": "Kitchen Appliances",
                    "price": Decimal("5900.00"),
                    "stock_quantity": 65,  # In Stock
                    "image_url": "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&q=80&w=300"
                },
                {
                    "name": "Apple Watch Series 9 GPS",
                    "sku": "WEAR-APW-S9",
                    "description": "45mm Midnight Aluminum Case with Sport Band. ECG and Oxygen tracking.",
                    "category": "Wearables",
                    "price": Decimal("44900.00"),
                    "stock_quantity": 30,  # In Stock
                    "image_url": "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=300"
                },
                {
                    "name": "Fitbit Charge 6 Tracker",
                    "sku": "WEAR-FIT-CHG6",
                    "description": "Advanced health & fitness tracker with built-in GPS and heart rate alerts.",
                    "category": "Wearables",
                    "price": Decimal("14900.00"),
                    "stock_quantity": 5,  # Low Stock
                    "image_url": "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=300"
                },
                {
                    "name": "Fountain Executive Pen",
                    "sku": "OFF-PEN-EXEC",
                    "description": "Gold plated iridium nib fountain pen with mahogany luxury gift box.",
                    "category": "Office Supplies",
                    "price": Decimal("2400.00"),
                    "stock_quantity": 110,  # In Stock
                    "image_url": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=300"
                }
            ]

            db_products = []
            for prod in products_data:
                db_prod = models.Product(
                    id=uuid.uuid4(),
                    name=prod["name"],
                    sku=prod["sku"],
                    description=prod["description"],
                    category=prod["category"],
                    price=prod["price"],
                    stock_quantity=prod["stock_quantity"],
                    image_url=prod["image_url"]
                )
                session.add(db_prod)
                db_products.append(db_prod)

            print("Seeding customers...")

            # 3. Seed Customers
            customers_data = [
                {"name": "Rajesh Kumar", "email": "rajesh.kumar@example.com", "phone": "+91 98765 43210", "address": "Block 4C, Green Glen Layout, Bangalore, Karnataka"},
                {"name": "Priya Sharma", "email": "priya.sharma@example.com", "phone": "+91 98123 45678", "address": "Flat 202, Regency Heights, Andheri West, Mumbai, Maharashtra"},
                {"name": "Amit Patel", "email": "amit.patel@example.com", "phone": "+91 91234 56789", "address": "22, Navrangpura Road, Ahmedabad, Gujarat"},
                {"name": "Sneha Reddy", "email": "sneha.reddy@example.com", "phone": "+91 88888 77777", "address": "H.No 12-4-89, Jubilee Hills, Hyderabad, Telangana"},
                {"name": "Vikram Singh", "email": "vikram.singh@example.com", "phone": "+91 77665 54433", "address": "C-14, Malviya Nagar, Jaipur, Rajasthan"},
                {"name": "Ananya Sen", "email": "ananya.sen@example.com", "phone": "+91 94432 10987", "address": "Salt Lake Sector II, Kolkata, West Bengal"},
                {"name": "Karan Malhotra", "email": "karan.malhotra@example.com", "phone": "+91 90123 98765", "address": "Sector 15, Gurgaon, Haryana"},
                {"name": "Nisha Verma", "email": "nisha.verma@example.com", "phone": "+91 89012 34567", "address": "Preet Vihar, New Delhi, Delhi"}
            ]

            db_customers = []
            for cust in customers_data:
                db_cust = models.Customer(
                    id=uuid.uuid4(),
                    full_name=cust["name"],
                    email=cust["email"],
                    phone_number=cust["phone"],
                    address=cust["address"]
                )
                session.add(db_cust)
                db_customers.append(db_cust)

            # Flush to get primary keys
            await session.flush()

            print("Seeding order history spanning the last 7 days...")

            # 4. Seed Orders spanning 7 days (to populate trend line chart and revenue)
            # We want total revenue to be around ₹1,25,000 as stated in the PRD example
            # We will generate orders on each of the last 7 days
            statuses = ["Completed", "Processing", "Pending", "Completed", "Cancelled", "Completed"]
            
            today = datetime.utcnow()
            orders_count = 0
            total_rev = Decimal("0.00")

            for day_offset in range(7):
                order_date = today - timedelta(days=day_offset)
                
                # Create 1 to 3 orders per day (except maybe fewer for cancelled ones)
                num_orders_today = random.randint(1, 3)
                for _ in range(num_orders_today):
                    customer = random.choice(db_customers)
                    status = random.choice(statuses)
                    
                    # Create the order
                    db_order = models.Order(
                        id=uuid.uuid4(),
                        customer_id=customer.id,
                        status=status,
                        total_amount=Decimal("0.00"),
                        created_at=order_date - timedelta(hours=random.randint(1, 10))
                    )
                    session.add(db_order)
                    await session.flush()

                    # Add 1 to 3 items to the order
                    order_items_count = random.randint(1, 2)
                    order_total = Decimal("0.00")
                    chosen_products = random.sample(db_products, order_items_count)

                    for product in chosen_products:
                        qty = random.randint(1, 2)
                        subtotal = qty * product.price
                        order_total += subtotal

                        db_item = models.OrderItem(
                            id=uuid.uuid4(),
                            order_id=db_order.id,
                            product_id=product.id,
                            quantity=qty,
                            unit_price=product.price,
                            subtotal=subtotal
                        )
                        session.add(db_item)

                    db_order.total_amount = order_total
                    if status != "Cancelled":
                        total_rev += order_total
                    orders_count += 1

            await session.commit()
            print(f"Successfully seeded database!")
            print(f"  - Products: {len(db_products)}")
            print(f"  - Customers: {len(db_customers)}")
            print(f"  - Orders: {orders_count} generated")
            print(f"  - Mock Active Revenue: INR {total_rev:,.2f}")

        except Exception as e:
            await session.rollback()
            print(f"Error seeding database: {str(e)}")
            raise
        finally:
            await session.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
