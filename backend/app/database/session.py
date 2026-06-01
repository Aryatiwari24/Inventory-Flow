import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

# Smart Fallback & Scheme Adaptation
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Render Production PostgreSQL internal URI (automatically formatted for asyncpg)
    DATABASE_URL = "postgresql+asyncpg://inventory_user:KeuStKHvNriUASNpsuSrEZ1OH2zv9vqY@dpg-d8et8td7vvec73dveq3g-a/inventory_km3p"

# If the URL starts with raw postgresql://, adapt it for asyncpg
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Safely fallback to SQLite locally if we cannot reach the internal Docker or Render hostnames
if "@postgres" in DATABASE_URL or ("@dpg-" in DATABASE_URL and os.name == 'nt' and not os.getenv("RENDER")):
    DATABASE_URL = "sqlite+aiosqlite:///./inventoryflow.db"

# Create an async database engine (works seamlessly for both PostgreSQL and SQLite)
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True
)

# Async session maker
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Declarative base model
Base = declarative_base()

# Async database session generator dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
