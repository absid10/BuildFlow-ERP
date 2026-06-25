"""Loan models — loans and loan payments."""

import uuid
from datetime import datetime, date
from sqlalchemy import Text, Numeric, Date, ForeignKey, Index, func
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class Loan(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "loans"

    loan_type: Mapped[str] = mapped_column(Text, nullable=False)  # lent, borrowed
    party_name: Mapped[str] = mapped_column(Text, nullable=False)
    party_phone: Mapped[str | None] = mapped_column(Text, nullable=True)
    principal_amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    amount_paid: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    outstanding_balance: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    interest_rate: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False, default=0)
    loan_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(
        Text, nullable=False, default="active"
    )  # active, settled, defaulted
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    payments = relationship("LoanPayment", back_populates="loan", lazy="selectin", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_loans_loan_type", "loan_type"),
        Index("ix_loans_status", "status"),
    )


class LoanPayment(Base, UUIDMixin):
    __tablename__ = "loan_payments"

    loan_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("loans.id", ondelete="CASCADE"), nullable=False
    )
    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    payment_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    recorded_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    loan = relationship("Loan", back_populates="payments")

    __table_args__ = (
        Index("ix_loan_payments_loan_id", "loan_id"),
    )
