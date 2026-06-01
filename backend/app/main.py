from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database.session import engine, Base
from app.api import products, customers, orders, dashboard
from app.utils.errors import InventoryFlowException

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Asynchronously initialize the PostgreSQL tables on startup if they do not exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Connection pooling cleanup is handled automatically by engine disposal

app = FastAPI(
    title="InventoryFlow API",
    description="Backend API for B2B SaaS Inventory & Order Management Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# Configure CORS whitelisted origins (Production Vercel + Localhost)
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://inventory-flow-zs2o.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global custom business logic exception handler
@app.exception_handler(InventoryFlowException)
async def inventory_flow_exception_handler(request: Request, exc: InventoryFlowException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "error": exc.message,  # Backwards compatibility
            "error_code": exc.error_code
        }
    )

# Global unexpected exceptions handler (prevents leaking python stack traces to clients)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Print or log the actual exception here for server debugging if needed
    print(f"UNHANDLED ERROR: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An unexpected error occurred on the server.",
            "error": str(exc),
            "error_code": "INTERNAL_SERVER_ERROR"
        }
    )

# Root status check endpoint
@app.get("/", tags=["Status"])
async def root_status():
    return {
        "success": True,
        "message": "Welcome to InventoryFlow API. Service is online and healthy.",
        "version": "1.0.0",
        "docs_url": "/api/docs"
    }

# Include API Modules Routers
app.include_router(products.router, prefix="/api")
app.include_router(customers.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
