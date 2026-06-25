"""
BuildFlow ERP — Projects API Routes
"""

import os
import uuid as uuid_lib
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

from app.database import get_db
from app.core.permissions import require_permission
from app.models.user import User
from app.models.project import Project
from app.config import get_settings
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectDetailResponse,
    ProjectExpenseCreate,
    ProjectExpenseResponse,
    ProjectDocumentCreate,
    ProjectDocumentResponse,
    ProjectNameCheckResponse,
)
from app.schemas.common import PaginatedResponse
from app.services import project_service

router = APIRouter(prefix="/projects", tags=["Projects"])
settings = get_settings()

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".xls", ".xlsx"}


@router.get("/check-name", response_model=ProjectNameCheckResponse)
async def check_project_name(
    name: str = Query(..., min_length=1, max_length=100),
    exclude_id: UUID | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("projects:read")),
):
    """Check if a project name already exists (case-insensitive)."""
    matches = await project_service.check_project_name(db, name, exclude_id)
    return ProjectNameCheckResponse(exists=len(matches) > 0, matching_names=matches)


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
    """Add a document record to a project."""
    document = await project_service.add_project_document(db, project_id, data, current_user)
    return ProjectDocumentResponse.model_validate(document)


@router.post("/{project_id}/documents/upload", response_model=ProjectDocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    project_id: UUID,
    file: UploadFile = File(...),
    title: str = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("projects:write")),
):
    """Upload a project document file."""
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type not allowed. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}")

    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum size of {settings.MAX_UPLOAD_SIZE // (1024 * 1024)}MB")

    project_dir = os.path.join(settings.UPLOAD_DIR, "projects", str(project_id))
    os.makedirs(project_dir, exist_ok=True)

    stored_name = f"{uuid_lib.uuid4()}{ext}"
    file_path = os.path.join(project_dir, stored_name)
    with open(file_path, "wb") as f:
        f.write(content)

    file_url = f"/uploads/projects/{project_id}/{stored_name}"
    doc_data = ProjectDocumentCreate(
        title=title,
        file_url=file_url,
        file_type=file.content_type,
        file_size=len(content),
    )
    document = await project_service.add_project_document(db, project_id, doc_data, current_user)
    return ProjectDocumentResponse.model_validate(document)


@router.delete("/{project_id}/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    project_id: UUID,
    document_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_permission("projects:write")),
):
    """Delete a project document."""
    await project_service.delete_project_document(db, project_id, document_id)
