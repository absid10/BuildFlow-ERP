"""
BuildFlow ERP — Auth Service

Per clean-code skill: Single responsibility — handles only authentication logic.
Per auth-implementation-patterns skill: JWT lifecycle, password verification.
"""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestError, ConflictError, NotFoundError, UnauthorizedError
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)
from app.config import get_settings
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse

settings = get_settings()


async def login_user(db: AsyncSession, data: LoginRequest) -> TokenResponse:
    """Authenticate user and return JWT tokens."""
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    # Don't reveal if user exists — per api-security skill
    if user is None or not verify_password(data.password, user.password_hash):
        raise UnauthorizedError("Invalid email or password")

    if not user.is_active:
        raise UnauthorizedError("Account is deactivated")

    access_token = create_access_token(str(user.id), user.email, user.role)
    refresh_token = create_refresh_token(str(user.id))

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


async def register_user(db: AsyncSession, data: RegisterRequest) -> User:
    """Register a new user. Admin only."""
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none() is not None:
        raise ConflictError("A user with this email already exists")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        full_name=data.full_name,
        role=data.role,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


async def refresh_tokens(db: AsyncSession, refresh_token: str) -> TokenResponse:
    """Refresh access token using a valid refresh token."""
    from jose import JWTError

    try:
        payload = decode_refresh_token(refresh_token)
        user_id = payload.get("sub")
    except JWTError:
        raise UnauthorizedError("Invalid refresh token")

    result = await db.execute(select(User).where(User.id == UUID(user_id)))
    user = result.scalar_one_or_none()

    if user is None or not user.is_active:
        raise UnauthorizedError("User not found or deactivated")

    new_access = create_access_token(str(user.id), user.email, user.role)
    new_refresh = create_refresh_token(str(user.id))

    return TokenResponse(
        access_token=new_access,
        refresh_token=new_refresh,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


async def change_password(
    db: AsyncSession, user: User, current_password: str, new_password: str
) -> None:
    """Change user password after verifying current password."""
    if not verify_password(current_password, user.password_hash):
        raise BadRequestError("Current password is incorrect")

    user.password_hash = hash_password(new_password)
    await db.flush()
