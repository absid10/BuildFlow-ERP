"""
BuildFlow ERP — Dashboard Service

Per kpi-dashboard-design skill: KPI calculations (MRR equivalent, active projects, etc.)
"""

from datetime import datetime, timedelta, timezone
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project
from app.models.contractor import ContractorPayment
from app.models.investment import Investment
from app.models.sale import PropertySale
from app.schemas.dashboard import DashboardKPI, RevenueSummary, RecentActivity


async def get_dashboard_kpis(db: AsyncSession) -> DashboardKPI:
    """Calculate and return key performance indicators."""
    
    # Simple aggregates for demonstration. In a real system, 
    # we would compare to previous months to calculate trends.
    
    # 1. Active Projects
    active_projects = await db.scalar(
        select(func.count(Project.id)).where(Project.status == "in_progress")
    )

    # 2. Total Investments
    total_investments_result = await db.scalar(
        select(func.sum(Investment.total_value)).where(Investment.status == "active")
    )
    total_investments = float(total_investments_result or 0)

    # 3. Outstanding Contractor Payments
    outstanding_payments_result = await db.scalar(
        select(func.sum(ContractorPayment.amount)).where(
            or_(ContractorPayment.status == "pending", ContractorPayment.status == "overdue")
        )
    )
    outstanding_payments = float(outstanding_payments_result or 0)

    # 4. Total Property Sales (Revenue)
    total_revenue_result = await db.scalar(
        select(func.sum(PropertySale.net_price)).where(PropertySale.status == "active")
    )
    total_revenue = float(total_revenue_result or 0)

    # Fake expenses and profit for the demo
    total_expenses = outstanding_payments * 1.5
    net_profit = total_revenue - total_expenses

    return DashboardKPI(
        total_revenue=total_revenue,
        total_expenses=total_expenses,
        outstanding_payments=outstanding_payments,
        active_projects=active_projects or 0,
        total_investments=total_investments,
        net_profit=net_profit,
        revenue_trend=12.5,
        expense_trend=-5.2,
        outstanding_trend=2.1,
        projects_trend=15.0,
        investments_trend=8.4,
        profit_trend=10.5,
    )


async def get_revenue_summary(db: AsyncSession) -> list[RevenueSummary]:
    """Generate mock revenue summary chart data."""
    # In reality, this would group by month
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return [
        RevenueSummary(month=m, revenue=100000 + i * 15000, expenses=60000 + i * 8000)
        for i, m in enumerate(months)
    ]


async def get_recent_activity(db: AsyncSession) -> list[RecentActivity]:
    """Generate mock recent activity feed."""
    return [
        RecentActivity(
            id="1",
            action="Created new project",
            entity_type="Project",
            entity_id="proj_1",
            user_name="Admin User",
            created_at=datetime.now(timezone.utc).isoformat()
        ),
        RecentActivity(
            id="2",
            action="Approved payment",
            entity_type="Payment",
            entity_id="pay_1",
            user_name="John Doe",
            created_at=(datetime.now(timezone.utc) - timedelta(hours=2)).isoformat()
        )
    ]
