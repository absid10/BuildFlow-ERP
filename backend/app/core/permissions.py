"""
BuildFlow ERP — RBAC Permissions

Per auth-implementation-patterns skill:
- Role-based access control with permission matrix
- Permission enforcement at route level
- Least privilege principle

Roles: admin, accountant, sales, manager
"""

from functools import wraps
from typing import Callable

from fastapi import Depends

from app.core.exceptions import ForbiddenError

# Permission matrix: role -> allowed actions
ROLE_PERMISSIONS = {
    "admin": {
        "users:read", "users:write", "users:delete",
        "projects:read", "projects:write", "projects:delete",
        "contractors:read", "contractors:write", "contractors:delete",
        "employees:read", "employees:write", "employees:delete",
        "office_expenses:read", "office_expenses:write", "office_expenses:delete",
        "investments:read", "investments:write", "investments:delete",
        "sales:read", "sales:write", "sales:delete",
        "customers:read", "customers:write", "customers:delete",
        "property_units:read", "property_units:write", "property_units:delete",
        "loans:read", "loans:write", "loans:delete",
        "documents:read", "documents:write", "documents:delete",
        "reports:read", "reports:export",
        "tuesday_payments:read", "tuesday_payments:export",
        "audit_logs:read",
        "notifications:read", "notifications:write",
        "dashboard:read",
    },
    "accountant": {
        "projects:read",
        "contractors:read", "contractors:write",
        "employees:read", "employees:write",
        "office_expenses:read", "office_expenses:write",
        "investments:read", "investments:write",
        "sales:read",
        "customers:read",
        "property_units:read",
        "loans:read", "loans:write",
        "documents:read", "documents:write",
        "reports:read", "reports:export",
        "tuesday_payments:read", "tuesday_payments:export",
        "notifications:read", "notifications:write",
        "dashboard:read",
    },
    "sales": {
        "projects:read",
        "contractors:read",
        "customers:read", "customers:write",
        "property_units:read",
        "sales:read", "sales:write",
        "investments:read",
        "documents:read", "documents:write",
        "reports:read",
        "notifications:read", "notifications:write",
        "dashboard:read",
    },
    "manager": {
        "projects:read", "projects:write",
        "contractors:read", "contractors:write",
        "employees:read",
        "office_expenses:read",
        "investments:read",
        "sales:read",
        "customers:read",
        "property_units:read",
        "loans:read",
        "documents:read", "documents:write",
        "reports:read",
        "tuesday_payments:read",
        "notifications:read", "notifications:write",
        "dashboard:read",
    },
}


def has_permission(role: str, permission: str) -> bool:
    """Check if a role has a specific permission."""
    role_perms = ROLE_PERMISSIONS.get(role, set())
    return permission in role_perms


def require_permission(permission: str):
    """Dependency that checks if current user has the required permission."""
    def permission_checker(current_user=Depends(_get_current_user_stub)):
        if not has_permission(current_user.role, permission):
            raise ForbiddenError(
                detail=f"Role '{current_user.role}' lacks permission: {permission}"
            )
        return current_user
    return permission_checker


def _get_current_user_stub():
    """Placeholder — replaced by actual get_current_user dependency in routes."""
    pass
