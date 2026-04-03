from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import User
from app.db.session import get_db
from app.schemas import ProfilePatch, UserOut

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("", response_model=UserOut)
def update_profile(
    payload: ProfilePatch, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    if payload.name is not None:
        current_user.name = payload.name
    if payload.avatar is not None:
        current_user.avatar = payload.avatar
    if payload.avatar_color is not None:
        current_user.avatar_color = payload.avatar_color
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
