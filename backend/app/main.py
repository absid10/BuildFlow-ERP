"""
BuildFlow ERP — FastAPI Application Entry Point

Per fastapi-pro skill:
- Lifespan events for startup/shutdown
- CORS configuration
- Custom exception handlers
- OpenAPI documentation
- Static file serving for uploads
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.api.v1.router import v1_router
from app.config import get_settings
from app.core.security import hash_password
from app.database import engine, async_session_factory
from app.models import Base
from app.models.user import User
from sqlalchemy import select

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Create upload directory
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Create tables (dev only — use Alembic in production)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed default admin user if no users exist
    async with async_session_factory() as session:
        result = await session.execute(select(User).limit(1))
        if result.scalar_one_or_none() is None:
            admin = User(
                email="admin@buildflow.com",
                password_hash=hash_password("admin123"),
                full_name="System Admin",
                role="admin",
                is_active=True,
            )
            session.add(admin)
            await session.commit()
            print("✅ Default admin user created: admin@buildflow.com / admin123")

    yield

    # Shutdown
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Construction ERP and Real Estate Management System",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory at module level so StaticFiles doesn't fail
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Static files for uploads
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API routes
app.include_router(v1_router)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch unhandled exceptions — per error-handling-patterns skill."""
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."},
    )


# Health check
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "app": settings.APP_NAME, "version": settings.APP_VERSION}
