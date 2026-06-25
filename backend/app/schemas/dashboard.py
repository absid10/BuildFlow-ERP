"""
Dashboard Pydantic schemas.
"""

from pydantic import BaseModel

class DashboardKPI(BaseModel):
    total_revenue: float
    total_expenses: float
    outstanding_payments: float
    active_projects: int
    total_investments: float
    net_profit: float
    revenue_trend: float
    expense_trend: float
    outstanding_trend: float
    projects_trend: float
    investments_trend: float
    profit_trend: float


class RevenueSummary(BaseModel):
    month: str
    revenue: float
    expenses: float


class RecentActivity(BaseModel):
    id: str
    action: str
    entity_type: str
    entity_id: str
    user_name: str
    created_at: str
