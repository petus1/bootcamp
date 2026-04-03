from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import ChatMessage, LocationPoint, User
from app.db.session import get_db
from app.schemas import ChartSeriesOut, ProgressSummary

router = APIRouter(prefix="/progress", tags=["progress"])

LABELS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]


@router.get("/summary", response_model=ProgressSummary)
def progress_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    messages_sent = db.execute(
        select(func.count(ChatMessage.id)).where(ChatMessage.sender_id == current_user.id)
    ).scalar_one()
    points_recorded = db.execute(
        select(func.count(LocationPoint.id)).where(LocationPoint.user_id == current_user.id)
    ).scalar_one()
    return ProgressSummary(messages_sent=messages_sent, points_recorded=points_recorded)


@router.get("/chart-series", response_model=ChartSeriesOut)
def chart_series(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    messages_sent = db.execute(
        select(func.count(ChatMessage.id)).where(ChatMessage.sender_id == current_user.id)
    ).scalar_one()
    points_recorded = db.execute(
        select(func.count(LocationPoint.id)).where(LocationPoint.user_id == current_user.id)
    ).scalar_one()
    seed = (current_user.id * 17 + messages_sent * 3 + points_recorded * 11) % 1000

    def drift(base: float, i: int, scale: float) -> float:
        return round(base + ((seed + i * 31) % 7) * scale - 3 * scale, 2 if scale < 1 else 0)

    weight = [drift(90 - i * 0.15, i, 0.08) for i in range(7)]
    calories = [drift(1800 + i * 20, i, 25) for i in range(7)]
    movement = [drift(30 + i * 3, i, 4) for i in range(7)]
    steps = [drift(5000 + i * 800, i, 400) for i in range(7)]
    dist = [round(s / 1300, 2) for s in steps]
    activity_time = [min(75, int(m * 1.2)) for m in movement]

    boost = min(1.0, points_recorded / 50.0)
    if boost > 0:
        steps = [round(s * (1 + 0.05 * boost), 0) for s in steps]

    return ChartSeriesOut(
        labels=LABELS,
        weight=weight,
        calories=calories,
        movement=movement,
        steps=steps,
        distance=dist,
        activity_time=activity_time,
    )
