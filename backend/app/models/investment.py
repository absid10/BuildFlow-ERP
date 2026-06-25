"""Investment models — properties, documents, payments."""

import uuid
from datetime import datetime, date
from sqlalchemy import Text, Numeric, Date, ForeignKey, Index, BigInteger, func
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class Investment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "investments"

    property_name: Mapped[str] = mapped_column(Text, nullable=False)
    property_type: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str | None] = mapped_column(Text, nullable=True)
    total_value: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    amount_paid: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    remaining_balance: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    purchase_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(Text, nullable=False, default="active")  # active, sold, cancelled
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    documents = relationship("InvestmentDocument", back_populates="investment", lazy="selectin", cascade="all, delete-orphan")
    payments = relationship("InvestmentPayment", back_populates="investment", lazy="selectin", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_investments_status", "status"),
        Index("ix_investments_created_at", "created_at"),
    )


class InvestmentDocument(Base, UUIDMixin):
    __tablename__ = "investment_documents"

    investment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("investments.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(Text, nullable=False)
    file_url: Mapped[str] = mapped_column(Text, nullable=False)
    file_type: Mapped[str | None] = mapped_column(Text, nullable=True)
    file_size: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    uploaded_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    investment = relationship("Investment", back_populates="documents")

    __table_args__ = (
        Index("ix_investment_documents_investment_id", "investment_id"),
    )


class InvestmentPayment(Base, UUIDMixin):
    __tablename__ = "investment_payments"

    investment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("investments.id", ondelete="CASCADE"), nullable=False
    )
    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    payment_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    payment_type: Mapped[str] = mapped_column(Text, nullable=False)  # receivable, payable
    status: Mapped[str] = mapped_column(
        Text, nullable=False, default="pending"
    )  # pending, received, paid, overdue
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    investment = relationship("Investment", back_populates="payments")

    __table_args__ = (
        Index("ix_investment_payments_investment_id", "investment_id"),
        Index("ix_investment_payments_due_date", "due_date"),
        Index("ix_investment_payments_status", "status"),
    )
