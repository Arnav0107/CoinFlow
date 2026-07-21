from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ============ AUTH ============

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(min_length=6)


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ============ HOLDINGS ============

class HoldingCreate(BaseModel):
    coin_id: str          # e.g. "bitcoin" (must match CoinGecko id, validated in Stage 2)
    symbol: str            # e.g. "BTC"
    amount: float = Field(gt=0)
    wallet_address: Optional[str] = None


class HoldingUpdate(BaseModel):
    amount: float = Field(gt=0)


class HoldingResponse(BaseModel):
    id: int
    coin_id: str
    symbol: str
    amount: float
    wallet_address: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ============ ALERTS (schema ready now, endpoints land in Stage 4) ============

class AlertCreate(BaseModel):
    coin_id: str
    target_price: float = Field(gt=0)
    direction: str = Field(pattern="^(above|below)$")


class AlertResponse(BaseModel):
    id: int
    coin_id: str
    target_price: float
    direction: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
