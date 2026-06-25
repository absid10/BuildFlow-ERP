"""
BuildFlow ERP — Project Service
"""

from uuid import UUID
from typing import Sequence
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import NotFoundError
from app.models.project import Project, ProjectExpense, ProjectDocument
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectExpenseCreate, ProjectDocumentCreate
from app.models.user import User


async def get_projects(db: AsyncSession, skip: int = 0, limit: int = 100) -> Sequence[Project]:
    result = await db.execute(select(Project).order_by(Project.created_at.desc()).offset(skip).limit(limit))
    return result.scalars().all()


async def get_project(db: AsyncSession, project_id: UUID) -> Project:
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.expenses), selectinload(Project.documents))
        .where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise NotFoundError("Project")
    return project


async def create_project(db: AsyncSession, project_in: ProjectCreate, current_user: User) -> Project:
    project = Project(**project_in.model_dump(), created_by=current_user.id)
    db.add(project)
    await db.flush()
    await db.refresh(project)
    return project


async def update_project(db: AsyncSession, project_id: UUID, project_in: ProjectUpdate) -> Project:
    project = await get_project(db, project_id)
    
    update_data = project_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
        
    await db.flush()
    await db.refresh(project)
    return project


async def delete_project(db: AsyncSession, project_id: UUID) -> None:
    project = await get_project(db, project_id)
    await db.delete(project)
    await db.flush()


async def add_project_expense(
    db: AsyncSession, project_id: UUID, expense_in: ProjectExpenseCreate, current_user: User
) -> ProjectExpense:
    project = await get_project(db, project_id)
    
    expense = ProjectExpense(
        **expense_in.model_dump(),
        project_id=project.id,
        created_by=current_user.id
    )
    db.add(expense)
    
    # Update project spent amount
    project.spent = float(project.spent) + expense_in.amount
    
    await db.flush()
    await db.refresh(expense)
    return expense


async def add_project_document(
    db: AsyncSession, project_id: UUID, doc_in: ProjectDocumentCreate, current_user: User
) -> ProjectDocument:
    project = await get_project(db, project_id)
    
    document = ProjectDocument(
        **doc_in.model_dump(),
        project_id=project.id,
        uploaded_by=current_user.id
    )
    db.add(document)
    await db.flush()
    await db.refresh(document)
    return document
