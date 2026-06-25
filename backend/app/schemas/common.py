"""
Common Pydantic schemas — shared pagination, error responses.

Per fastapi-pro skill: Pydantic V2 for data validation and serialization.
"""

from datetime import datetime
from typing import Generic, TypeVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str


class PaginatedResponse(BaseModel, Generic[T]):
    """Standard paginated response."""
    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int

    model_config = ConfigDict(from_attributes=True)


class PaginationParams(BaseModel):
    """Query params for pagination."""
    page: int = 1
    page_size: int = 20
    sort_by: str | None = None
    sort_order: str = "desc"  # asc or desc
    search: str | None = None


class MessageResponse(BaseModel):
    """Generic success message."""
    message: str


class IDResponse(BaseModel):
    """Response containing just an ID."""
    id: UUID
