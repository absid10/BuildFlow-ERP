"""
BuildFlow ERP — V1 API Router

Aggregates all v1 route modules into a single router.
"""

from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.projects import router as projects_router

v1_router = APIRouter(prefix="/api/v1")

# Include all route modules
v1_router.include_router(auth_router)
v1_router.include_router(dashboard_router)
v1_router.include_router(projects_router)

# Office Management
from app.api.v1.employees import router as employees_router
from app.api.v1.office_expenses import router as office_expenses_router
from app.api.v1.salaries import router as salaries_router

v1_router.include_router(employees_router)
v1_router.include_router(office_expenses_router)
v1_router.include_router(salaries_router)

# Additional routers will be added as modules are built:
# v1_router.include_router(contractors_router)
# v1_router.include_router(investments_router)
# v1_router.include_router(property_units_router)
# v1_router.include_router(customers_router)
# v1_router.include_router(sales_router)
# v1_router.include_router(tuesday_payments_router)
# v1_router.include_router(loans_router)
# v1_router.include_router(reports_router)
# v1_router.include_router(documents_router)
# v1_router.include_router(users_router)
# v1_router.include_router(notifications_router)
# v1_router.include_router(audit_logs_router)
# v1_router.include_router(search_router)
