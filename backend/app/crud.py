from sqlalchemy.orm import Session

from app import models
from app import schemas 
from app.auth_utils import hash_password


# ============ USER ============

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ============ HOLDINGS ============

def get_holdings(db:Session, user_id:int):
    return db.query(models.Holding).filter(models.Holding.user_id == user_id).all()

def get_holding(db:Session, user_id:int , holding_id:int):
    return db.query(models.Holding).filter(models.Holding.id == holding_id, models.Holding.user_id == user_id).first()

def create_holding(db: Session, holding: schemas.HoldingCreate, user_id:int)-> models.Holding:
    db_holding = models.Holding(**holding.model_dump(), user_id=user_id)
    db.add(db_holding)
    db.commit()
    db.refresh(db_holding)
    return db_holding

def update_holding(db:Session, holding: models.Holding, data: schemas.HoldingUpdate)->models.Holding:
    holding.amount = data.amount
    db.commit()
    db.refresh(holding)
    return holding



def delete_holding(db: Session, holding: models.Holding) -> None:
    db.delete(holding)
    db.commit()