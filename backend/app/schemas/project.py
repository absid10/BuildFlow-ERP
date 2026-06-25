"""
BuildFlow ERP — Project Pydantic Schemas
"""

from datetime import date
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict, field_validator, model_validator

PROJECT_CATEGORIES = {
    "architecture_consultancy",
    "construction",
    "interior_design",
    "layout_development",
    "plotting_survey",
    "renovation",
}

PROJECT_TYPES = {
    "independent_house", "villa", "apartment", "row_house",
    "office_building", "shopping_complex", "mall", "hotel", "hospital",
    "factory", "warehouse",
    "road", "layout", "school", "college",
    "farm_house", "resort",
}

OWNERSHIP_TYPES = {"self_owned", "client_owned", "joint_venture", "partnership"}

PAYMENT_TERMS = {
    "fixed_price", "monthly_billing", "running_bill",
    "milestone_based", "time_material", "custom",
}

AREA_UNITS_LAND = {"sq_ft", "sq_m", "acres", "guntha", "hectare"}
AREA_UNITS_BUILT = {"sq_ft", "sq_m"}


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
    name: str = Field(..., min_length=1, max_length=100)
    category: str
    project_type: str
    ownership: str
    client_name: Optional[str] = None
    budget: float = Field(default=0, ge=0)
    status: str = Field(default="planning", pattern="^(planning|in_progress|on_hold|completed|cancelled)$")
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    progress_percent: int = Field(default=0, ge=0, le=100)
    location: Optional[str] = None
    payment_terms: Optional[str] = None
    total_land_area: Optional[float] = Field(None, ge=0)
    total_land_area_unit: Optional[str] = None
    built_up_area: Optional[float] = Field(None, ge=0)
    built_up_area_unit: Optional[str] = None

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        if v not in PROJECT_CATEGORIES:
            raise ValueError(f"Invalid category. Must be one of: {', '.join(sorted(PROJECT_CATEGORIES))}")
        return v

    @field_validator("project_type")
    @classmethod
    def validate_project_type(cls, v: str) -> str:
        if v not in PROJECT_TYPES:
            raise ValueError(f"Invalid project type")
        return v

    @field_validator("ownership")
    @classmethod
    def validate_ownership(cls, v: str) -> str:
        if v not in OWNERSHIP_TYPES:
            raise ValueError(f"Invalid ownership type")
        return v

    @field_validator("payment_terms")
    @classmethod
    def validate_payment_terms(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in PAYMENT_TERMS:
            raise ValueError(f"Invalid payment terms")
        return v

    @model_validator(mode="after")
    def validate_ownership_fields(self):
        if self.ownership == "self_owned":
            self.client_name = None
            self.payment_terms = None
        elif self.ownership != "client_owned":
            self.payment_terms = None
        return self


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = None
    project_type: Optional[str] = None
    ownership: Optional[str] = None
    client_name: Optional[str] = None
    budget: Optional[float] = Field(None, ge=0)
    status: Optional[str] = Field(None, pattern="^(planning|in_progress|on_hold|completed|cancelled)$")
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    progress_percent: Optional[int] = Field(None, ge=0, le=100)
    location: Optional[str] = None
    payment_terms: Optional[str] = None
    total_land_area: Optional[float] = Field(None, ge=0)
    total_land_area_unit: Optional[str] = None
    built_up_area: Optional[float] = Field(None, ge=0)
    built_up_area_unit: Optional[str] = None


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


class ProjectNameCheckResponse(BaseModel):
    exists: bool
    matching_names: list[str] = []
