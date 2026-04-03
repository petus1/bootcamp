from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import User
from app.db.session import get_db
from app.schemas import UserPublic

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserPublic])
def list_other_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.execute(select(User).where(User.id != current_user.id).order_by(User.name)).scalars().all()
    return list(rows)
