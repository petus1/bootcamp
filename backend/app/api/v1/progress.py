from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import ChatMessage, LocationPoint, User
from app.db.session import get_db
from app.schemas import ProgressSummary

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/summary", response_model=ProgressSummary)
def progress_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    messages_sent = db.execute(
        select(func.count(ChatMessage.id)).where(ChatMessage.sender_id == current_user.id)
    ).scalar_one()
    points_recorded = db.execute(
        select(func.count(LocationPoint.id)).where(LocationPoint.user_id == current_user.id)
    ).scalar_one()
    return ProgressSummary(messages_sent=messages_sent, points_recorded=points_recorded)
