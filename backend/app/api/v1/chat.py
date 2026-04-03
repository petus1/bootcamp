from fastapi import APIRouter, Depends
from sqlalchemy import and_, or_, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import ChatMessage, User
from app.db.session import get_db
from app.schemas import ChatPreview, MessageCreate, MessageOut
from app.services.websocket_manager import manager

router = APIRouter(prefix="/chats", tags=["chat"])


@router.get("", response_model=list[ChatPreview])
def list_chats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    messages = db.execute(
        select(ChatMessage)
        .where(or_(ChatMessage.sender_id == current_user.id, ChatMessage.recipient_id == current_user.id))
        .order_by(ChatMessage.created_at.desc())
    ).scalars()
    seen: set[int] = set()
    result: list[ChatPreview] = []
    for m in messages:
        peer_id = m.recipient_id if m.sender_id == current_user.id else m.sender_id
        if peer_id in seen:
            continue
        peer = db.get(User, peer_id)
        if not peer:
            continue
        result.append(
            ChatPreview(
                user_id=peer.id,
                name=peer.name,
                avatar=peer.avatar,
                avatar_color=peer.avatar_color,
                last_message=m.text,
                last_message_at=m.created_at,
            )
        )
        seen.add(peer_id)
    return result


@router.get("/{user_id}/messages", response_model=list[MessageOut])
def get_messages(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.execute(
        select(ChatMessage)
        .where(
            or_(
                and_(ChatMessage.sender_id == current_user.id, ChatMessage.recipient_id == user_id),
                and_(ChatMessage.sender_id == user_id, ChatMessage.recipient_id == current_user.id),
            )
        )
        .order_by(ChatMessage.created_at.asc())
    ).scalars()
    return list(rows)


@router.post("/{user_id}/messages", response_model=MessageOut)
async def send_message(
    user_id: int,
    payload: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    message = ChatMessage(sender_id=current_user.id, recipient_id=user_id, text=payload.text.strip())
    db.add(message)
    db.commit()
    db.refresh(message)
    ws_event = {
        "type": "chat:new_message",
        "data": {
            "id": message.id,
            "sender_id": message.sender_id,
            "recipient_id": message.recipient_id,
            "text": message.text,
            "created_at": message.created_at.isoformat(),
        },
    }
    await manager.broadcast_pair(current_user.id, user_id, ws_event)
    return message
