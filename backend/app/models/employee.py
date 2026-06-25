"""Employee models — employees and salary payments."""

import uuid
from datetime import datetime, date
from sqlalchemy import Text, Numeric, Date, Boolean, ForeignKey, Index, func
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class Employee(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "employees"

    name: Mapped[str] = mapped_column(Text, nullable=False)
    phone: Mapped[str | None] = mapped_column(Text, nullable=True)
    email: Mapped[str | None] = mapped_column(Text, nullable=True)
    designation: Mapped[str | None] = mapped_column(Text, nullable=True)
    department: Mapped[str | None] = mapped_column(Text, nullable=True)
    base_salary: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    joining_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    salary_payments = relationship("SalaryPayment", back_populates="employee", lazy="selectin")

    __table_args__ = (
        Index("ix_employees_is_active", "is_active"),
    )


class SalaryPayment(Base, UUIDMixin):
    __tablename__ = "salary_payments"

    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False
    )
    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    deductions: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    bonus: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    net_amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    month_year: Mapped[str] = mapped_column(Text, nullable=False)  # e.g. "2024-06"
    payment_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(Text, nullable=False, default="pending")  # pending, paid
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    employee = relationship("Employee", back_populates="salary_payments")

    __table_args__ = (
        Index("ix_salary_payments_employee_id", "employee_id"),
        Index("ix_salary_payments_month_year", "month_year"),
    )
