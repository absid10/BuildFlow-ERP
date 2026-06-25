"""Office Expense model."""

import uuid
from datetime import datetime, date
from sqlalchemy import Text, Numeric, Date, ForeignKey, Index, func
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, UUIDMixin


class OfficeExpense(Base, UUIDMixin):
    __tablename__ = "office_expenses"

    category: Mapped[str] = mapped_column(
        Text, nullable=False
    )  # rent, utilities, supplies, maintenance, misc
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    expense_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    receipt_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (
        Index("ix_office_expenses_date", "expense_date"),
        Index("ix_office_expenses_category", "category"),
    )
