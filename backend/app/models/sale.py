"""Sale models — property sales, installments, sale documents."""

import uuid
from datetime import datetime, date
from sqlalchemy import Text, Numeric, Date, Integer, ForeignKey, Index, BigInteger, func
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class PropertySale(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "property_sales"

    property_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("property_units.id", ondelete="RESTRICT"), nullable=False
    )
    customer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("customers.id", ondelete="RESTRICT"), nullable=False
    )
    total_price: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    discount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    net_price: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    amount_paid: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    outstanding_balance: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    sale_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    agreement_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(
        Text, nullable=False, default="active"
    )  # active, completed, cancelled
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    property_unit = relationship("PropertyUnit", back_populates="sales")
    customer = relationship("Customer", back_populates="sales")
    installments = relationship("InstallmentSchedule", back_populates="sale", lazy="selectin", cascade="all, delete-orphan")
    documents = relationship("SaleDocument", back_populates="sale", lazy="selectin", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_property_sales_property_id", "property_id"),
        Index("ix_property_sales_customer_id", "customer_id"),
        Index("ix_property_sales_status", "status"),
    )


class InstallmentSchedule(Base, UUIDMixin):
    __tablename__ = "installment_schedules"

    sale_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("property_sales.id", ondelete="CASCADE"), nullable=False
    )
    installment_number: Mapped[int] = mapped_column(Integer, nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    paid_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(
        Text, nullable=False, default="pending"
    )  # pending, paid, overdue, partial
    paid_amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    sale = relationship("PropertySale", back_populates="installments")

    __table_args__ = (
        Index("ix_installment_schedules_sale_id", "sale_id"),
        Index("ix_installment_schedules_due_date", "due_date"),
        Index("ix_installment_schedules_status", "status"),
    )


class SaleDocument(Base, UUIDMixin):
    __tablename__ = "sale_documents"

    sale_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("property_sales.id", ondelete="CASCADE"), nullable=False
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

    sale = relationship("PropertySale", back_populates="documents")

    __table_args__ = (
        Index("ix_sale_documents_sale_id", "sale_id"),
    )
