import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

# Smart Fallback: Use SQLite locally outside Docker, use PostgreSQL inside Docker
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL or "@postgres" in DATABASE_URL:
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
