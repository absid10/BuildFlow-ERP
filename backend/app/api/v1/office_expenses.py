from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.database import get_db
from app.models.office_expense import OfficeExpense
from app.api.v1.auth import get_current_user
from pydantic import BaseModel
from datetime import date
from uuid import UUID

router = APIRouter(prefix="/office-expenses", tags=["office_expenses"])

class OfficeExpenseCreate(BaseModel):
    expense_date: date
    category: str
    amount: float
    description: str | None = None
    payment_method: str | None = None
    receipt_url: str | None = None

class OfficeExpenseResponse(OfficeExpenseCreate):
    id: UUID
    created_at: date

@router.get("", response_model=List[OfficeExpenseResponse])
async def list_expenses(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(OfficeExpense).order_by(OfficeExpense.expense_date.desc()))
    return result.scalars().all()

@router.post("", response_model=OfficeExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(expense: OfficeExpenseCreate, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    db_exp = OfficeExpense(**expense.model_dump())
    db.add(db_exp)
    await db.commit()
    await db.refresh(db_exp)
    return db_exp
