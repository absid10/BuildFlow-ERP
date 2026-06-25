"""
BuildFlow ERP — Dashboard API Routes
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.dashboard import DashboardKPI, RevenueSummary, RecentActivity
from app.services import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/kpis", response_model=DashboardKPI)
async def get_kpis(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get key performance indicators for the dashboard."""
    return await dashboard_service.get_dashboard_kpis(db)


@router.get("/revenue-summary", response_model=list[RevenueSummary])
async def get_revenue_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get revenue vs expense chart data."""
    return await dashboard_service.get_revenue_summary(db)


@router.get("/recent-activity", response_model=list[RecentActivity])
async def get_recent_activity(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get recent activity feed."""
    return await dashboard_service.get_recent_activity(db)
