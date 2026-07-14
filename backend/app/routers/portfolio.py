from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.auth_utils import get_current_user
from app.database import get_db

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


@router.post("/", response_model=schemas.HoldingResponse, status_code=status.HTTP_201_CREATED)
def add_holding(
    holding: schemas.HoldingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_holding(db, holding, current_user.id)


@router.get("/", response_model=list[schemas.HoldingResponse])
def list_holdings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_holdings(db, current_user.id)


@router.put("/{holding_id}", response_model=schemas.HoldingResponse)
def update_holding(
    holding_id: int,
    data: schemas.HoldingUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    holding = crud.get_holding(db, current_user.id, holding_id)
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")
    return crud.update_holding(db, holding, data)


@router.delete("/{holding_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_holding(
    holding_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    holding = crud.get_holding(db, current_user.id, holding_id)
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")
    crud.delete_holding(db, holding)
