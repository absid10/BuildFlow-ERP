from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.database import get_db
from app.models.employee import SalaryPayment, Employee
from app.api.v1.auth import get_current_user
from pydantic import BaseModel
from datetime import date
from uuid import UUID

router = APIRouter(prefix="/salaries", tags=["salaries"])

class SalaryPaymentCreate(BaseModel):
    employee_id: UUID
    month_year: str
    base_amount: float
    bonus: float = 0
    deductions: float = 0
    net_amount: float
    payment_date: date | None = None
    status: str = "pending"

class SalaryPaymentResponse(SalaryPaymentCreate):
    id: UUID
    employee_name: str | None = None

@router.get("", response_model=List[SalaryPaymentResponse])
async def list_salaries(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(SalaryPayment, Employee.name).join(Employee).order_by(SalaryPayment.payment_date.desc()))
    rows = result.all()
    
    responses = []
    for payment, emp_name in rows:
        resp = SalaryPaymentResponse(
            id=payment.id,
            employee_id=payment.employee_id,
            month_year=payment.month_year,
            base_amount=payment.base_amount,
            bonus=payment.bonus,
            deductions=payment.deductions,
            net_amount=payment.net_amount,
            payment_date=payment.payment_date,
            status=payment.status,
            employee_name=emp_name
        )
        responses.append(resp)
    return responses

@router.post("", response_model=SalaryPaymentResponse, status_code=status.HTTP_201_CREATED)
async def create_salary(salary: SalaryPaymentCreate, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    db_sal = SalaryPayment(**salary.model_dump())
    db.add(db_sal)
    await db.commit()
    await db.refresh(db_sal)
    
    # Fetch employee name for response
    emp = await db.execute(select(Employee).filter(Employee.id == salary.employee_id))
    emp_record = emp.scalar_one()
    
    resp = SalaryPaymentResponse(
        **db_sal.__dict__,
        employee_name=emp_record.name
    )
    return resp
