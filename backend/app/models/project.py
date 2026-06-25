"""Project models — project, expenses, documents."""

import uuid
from datetime import datetime, date
from sqlalchemy import Text, Numeric, Date, Integer, ForeignKey, Index, BigInteger, func
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class Project(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "projects"

    name: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    budget: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    spent: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False, default=0)
    status: Mapped[str] = mapped_column(
        Text, nullable=False, default="planning"
    )  # planning, in_progress, on_hold, completed, cancelled
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    progress_percent: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    location: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    # Relationships
    expenses = relationship("ProjectExpense", back_populates="project", lazy="selectin", cascade="all, delete-orphan")
    documents = relationship("ProjectDocument", back_populates="project", lazy="selectin", cascade="all, delete-orphan")
    contractor_payments = relationship("ContractorPayment", back_populates="project", lazy="selectin")
    property_units = relationship("PropertyUnit", back_populates="project", lazy="selectin")

    __table_args__ = (
        Index("ix_projects_status", "status"),
        Index("ix_projects_created_by", "created_by"),
        Index("ix_projects_created_at", "created_at"),
    )


class ProjectExpense(Base, UUIDMixin):
    __tablename__ = "project_expenses"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False
    )
    expense_type: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(15, 2), nullable=False)
    expense_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    vendor_name: Mapped[str | None] = mapped_column(Text, nullable=True)
    receipt_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, server_default=func.now()
    )

    project = relationship("Project", back_populates="expenses")

    __table_args__ = (
        Index("ix_project_expenses_project_id", "project_id"),
        Index("ix_project_expenses_date", "expense_date"),
        Index("ix_project_expenses_type", "expense_type"),
    )


class ProjectDocument(Base, UUIDMixin):
    __tablename__ = "project_documents"

    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False
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

    project = relationship("Project", back_populates="documents")

    __table_args__ = (
        Index("ix_project_documents_project_id", "project_id"),
    )
