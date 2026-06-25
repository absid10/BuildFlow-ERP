"""
BuildFlow ERP — Application Configuration

Uses Pydantic Settings for type-safe environment variable management.
Per fastapi-pro skill: Environment configuration with Pydantic Settings.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/buildflow_erp"

    # JWT Auth
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production-min-256-bits"
    REFRESH_SECRET_KEY: str = "your-refresh-secret-key-change-this-in-production-min-256-bits"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"

    # File Uploads
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 10_485_760  # 10MB
    ALLOWED_FILE_TYPES: list[str] = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173"

    # App
    APP_NAME: str = "BuildFlow ERP"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — loaded once."""
    return Settings()
