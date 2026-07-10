from sqlalchemy import Column, Integer, String, ForeignKey , Float , DateTime, Boolean 
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True,nullable = False,index=True)
    email = Column(String, unique=True,nullable = False,index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(String, server_default=func.now())

    holding = relationship("Holding", back_populates="owner", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="owner", cascade="all, delete-orphan")


class Holding(Base):
    __tablename__ = "holdings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    coin_id = Column(String, nullable=False)
    symbol = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    wallet_address = Column(String, nullable=True)

    created_at = Column(String, server_default=func.now())

    owner = relationship("User", back_populates="holding")

class Alert(Base):
    """Price alert - wired up fully in stage 4 , model lives there from the start"""
    
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index = True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    coin_id = Column(String, nullable=False)
    target_price = Column(Float, nullable=False)
    direction = Column(String, nullable=False)   # "above" or "below"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    owner = relationship("User", back_populates="alerts")