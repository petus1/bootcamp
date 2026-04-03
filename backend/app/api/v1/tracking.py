from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import LocationPoint, TrackingSession, User
from app.db.session import get_db
from app.schemas import TrackingPointIn, TrackingPointOut, TrackingStartResponse
from app.services.websocket_manager import manager

router = APIRouter(prefix="/tracking", tags=["tracking"])


@router.post("/start", response_model=TrackingStartResponse)
def start_tracking(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(TrackingSession).filter(
        TrackingSession.user_id == current_user.id, TrackingSession.is_active.is_(True)
    ).update({"is_active": False, "stopped_at": datetime.utcnow()})
    session = TrackingSession(user_id=current_user.id, is_active=True)
    db.add(session)
    db.commit()
    db.refresh(session)
    return TrackingStartResponse(session_id=session.id)


@router.post("/point", response_model=TrackingPointOut)
async def push_point(payload: TrackingPointIn, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    active_session = db.execute(
        select(TrackingSession)
        .where(TrackingSession.user_id == current_user.id, TrackingSession.is_active.is_(True))
        .order_by(desc(TrackingSession.started_at))
    ).scalar_one_or_none()
    point = LocationPoint(
        user_id=current_user.id,
        session_id=active_session.id if active_session else None,
        lat=payload.lat,
        lon=payload.lon,
        accuracy=payload.accuracy,
        speed=payload.speed,
    )
    db.add(point)
    db.commit()
    db.refresh(point)

    event = {
        "type": "tracking:position_update",
        "data": {
            "user_id": current_user.id,
            "lat": point.lat,
            "lon": point.lon,
            "accuracy": point.accuracy,
            "speed": point.speed,
            "created_at": point.created_at.isoformat(),
        },
    }
    await manager.send_to_user(current_user.id, event)
    return point


@router.post("/stop")
def stop_tracking(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    active = db.execute(
        select(TrackingSession)
        .where(TrackingSession.user_id == current_user.id, TrackingSession.is_active.is_(True))
        .order_by(desc(TrackingSession.started_at))
    ).scalar_one_or_none()
    if active:
        active.is_active = False
        active.stopped_at = datetime.utcnow()
        db.add(active)
        db.commit()
    return {"ok": True}


@router.get("/live", response_model=TrackingPointOut | None)
def live_point(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    point = db.execute(
        select(LocationPoint).where(LocationPoint.user_id == current_user.id).order_by(desc(LocationPoint.created_at))
    ).scalar_one_or_none()
    return point
