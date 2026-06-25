"""
BuildFlow ERP — Projects API Routes
"""

from uuid import UUID
from typing import Sequence

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.core.permissions import require_permission
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectDetailResponse,
    ProjectExpenseCreate,
    ProjectExpenseResponse,
    ProjectDocumentCreate,
    ProjectDocumentResponse,
)
from app.schemas.common import PaginatedResponse
from app.services import project_service
from sqlalchemy import func, select
from app.models.project import Project

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("/", response_model=PaginatedResponse[ProjectResponse])
async def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("projects:read")),
):
    """List projects with pagination."""
    projects = await project_service.get_projects(db, skip=skip, limit=limit)
    total = await db.scalar(select(func.count(Project.id)))
    
    return PaginatedResponse(
        items=[ProjectResponse.model_validate(p) for p in projects],
        total=total or 0,
        page=(skip // limit) + 1,
        page_size=limit,
        total_pages=((total or 0) + limit - 1) // limit
    )


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("projects:write")),
):
    """Create a new project."""
    project = await project_service.create_project(db, data, current_user)
    return ProjectResponse.model_validate(project)


@router.get("/{project_id}", response_model=ProjectDetailResponse)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("projects:read")),
):
    """Get project details including expenses and documents."""
    project = await project_service.get_project(db, project_id)
    return ProjectDetailResponse.model_validate(project)


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("projects:write")),
):
    """Update a project."""
    project = await project_service.update_project(db, project_id, data)
    return ProjectResponse.model_validate(project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("projects:delete")),
):
    """Delete a project."""
    await project_service.delete_project(db, project_id)


@router.post("/{project_id}/expenses", response_model=ProjectExpenseResponse, status_code=status.HTTP_201_CREATED)
async def add_expense(
    project_id: UUID,
    data: ProjectExpenseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("projects:write")),
):
    """Add an expense to a project."""
    expense = await project_service.add_project_expense(db, project_id, data, current_user)
    return ProjectExpenseResponse.model_validate(expense)


@router.post("/{project_id}/documents", response_model=ProjectDocumentResponse, status_code=status.HTTP_201_CREATED)
async def add_document(
    project_id: UUID,
    data: ProjectDocumentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("projects:write")),
):
    """Add a document to a project."""
    document = await project_service.add_project_document(db, project_id, data, current_user)
    return ProjectDocumentResponse.model_validate(document)
