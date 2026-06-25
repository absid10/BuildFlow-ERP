"""
BuildFlow ERP — Base SQLAlchemy Model

Per postgresql skill: UUID PKs, TIMESTAMPTZ timestamps, NOT NULL defaults.
Per database-design skill: created_at + updated_at on every table.
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP


class Base(DeclarativeBase):
    """Base model class with common columns for all tables."""
    pass


class TimestampMixin:
    """Mixin adding created_at and updated_at timestamps."""

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


class UUIDMixin:
    """Mixin adding UUID primary key."""

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
