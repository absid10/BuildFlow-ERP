"""Contractor models — contractors and their payments."""

import uuid
from datetime import datetime, date
from sqlalchemy import Text, Numeric, Date, Boolean, ForeignKey, Index, func
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class Contractor(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "contractors"

    name: Mapped[str] = mapped_column(Text, nullable=False)
    phone: Mapped[str | None] = mapped_column(Text, nullable=True)
    email: Mapped[str | None] = mapped_column(Text, nullable=True)
    specialty: Mapped[str | None] = mapped_column(Text, nullable=True)
    bank_details: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    payments = relationship("ContractorPayment", back_populates="contractor", lazy="selectin")

    __table_args__ = (
        Index("ix_contractors_is_active", "is_active"),
    )


class ContractorPayment(Base, UUIDMixin):
    __tablename__ = "contractor_payments"

    contractor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("contractors.id", ondelete="CASCADE"), nullable=False
    )
    project_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True
    )
    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    payment_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(
        Text, nullable=False, default="pending"
    )  # pending, paid, overdue, cancelled
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    approved_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    contractor = relationship("Contractor", back_populates="payments")
    project = relationship("Project", back_populates="contractor_payments")

    __table_args__ = (
        Index("ix_contractor_payments_contractor_id", "contractor_id"),
        Index("ix_contractor_payments_project_id", "project_id"),
        Index("ix_contractor_payments_status", "status"),
        Index("ix_contractor_payments_due_date", "due_date"),
    )
