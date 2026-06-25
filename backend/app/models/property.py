"""Property Unit model — individual units within projects."""

import uuid
from sqlalchemy import Text, Numeric, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class PropertyUnit(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "property_units"

    project_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True
    )
    unit_number: Mapped[str] = mapped_column(Text, nullable=False)
    unit_type: Mapped[str | None] = mapped_column(Text, nullable=True)
    area_sqft: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    price: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    status: Mapped[str] = mapped_column(
        Text, nullable=False, default="available"
    )  # available, reserved, sold
    floor: Mapped[str | None] = mapped_column(Text, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    project = relationship("Project", back_populates="property_units")
    sales = relationship("PropertySale", back_populates="property_unit", lazy="selectin")

    __table_args__ = (
        Index("ix_property_units_project_id", "project_id"),
        Index("ix_property_units_status", "status"),
    )
