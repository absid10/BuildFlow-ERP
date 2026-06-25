from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.database import get_db
from app.models.employee import Employee
from app.api.v1.auth import get_current_user
from pydantic import BaseModel
from datetime import date
from uuid import UUID

router = APIRouter(prefix="/employees", tags=["employees"])

class EmployeeCreate(BaseModel):
    name: str
    designation: str
    department: str
    phone: str | None = None
    email: str | None = None
    join_date: date
    base_salary: float
    is_active: bool = True

class EmployeeResponse(EmployeeCreate):
    id: UUID

@router.get("", response_model=List[EmployeeResponse])
async def list_employees(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(Employee).order_by(Employee.name))
    return result.scalars().all()

@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    db_emp = Employee(**employee.model_dump())
    db.add(db_emp)
    await db.commit()
    await db.refresh(db_emp)
    return db_emp

@router.put("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(employee_id: UUID, employee: EmployeeCreate, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(Employee).filter(Employee.id == employee_id))
    db_emp = result.scalar_one_or_none()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    for key, value in employee.model_dump().items():
        setattr(db_emp, key, value)
    
    await db.commit()
    await db.refresh(db_emp)
    return db_emp
