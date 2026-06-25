"""
BuildFlow ERP — Project Pydantic Schemas
"""

from datetime import date
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

# --- Project Expense ---
class ProjectExpenseBase(BaseModel):
    expense_type: str = Field(..., pattern="^(material|labor|equipment|overhead|other)$")
    description: Optional[str] = None
    amount: float = Field(..., gt=0)
    expense_date: Optional[date] = None
    vendor_name: Optional[str] = None
    receipt_url: Optional[str] = None

class ProjectExpenseCreate(ProjectExpenseBase):
    pass

class ProjectExpenseResponse(ProjectExpenseBase):
    id: UUID
    project_id: UUID
    created_by: Optional[UUID] = None
    created_at: str

    model_config = ConfigDict(from_attributes=True)

# --- Project Document ---
class ProjectDocumentBase(BaseModel):
    title: str
    file_url: str
    file_type: Optional[str] = None
    file_size: Optional[int] = None

class ProjectDocumentCreate(ProjectDocumentBase):
    pass

class ProjectDocumentResponse(ProjectDocumentBase):
    id: UUID
    project_id: UUID
    uploaded_by: Optional[UUID] = None
    created_at: str

    model_config = ConfigDict(from_attributes=True)

# --- Project ---
class ProjectBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    budget: float = Field(default=0, ge=0)
    status: str = Field(default="planning", pattern="^(planning|in_progress|on_hold|completed|cancelled)$")
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    progress_percent: int = Field(default=0, ge=0, le=100)
    location: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = None
    budget: Optional[float] = Field(None, ge=0)
    status: Optional[str] = Field(None, pattern="^(planning|in_progress|on_hold|completed|cancelled)$")
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    progress_percent: Optional[int] = Field(None, ge=0, le=100)
    location: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: UUID
    spent: float
    created_by: Optional[UUID] = None
    created_at: str
    updated_at: str

    model_config = ConfigDict(from_attributes=True)

class ProjectDetailResponse(ProjectResponse):
    expenses: list[ProjectExpenseResponse] = []
    documents: list[ProjectDocumentResponse] = []
    
    model_config = ConfigDict(from_attributes=True)
