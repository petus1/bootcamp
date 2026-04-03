"""Demo users and sample messages (idempotent)."""

from sqlalchemy import func, select, text
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.models import ChatMessage, User


DEMO_PASSWORD = "demo1234"

DEMO_USERS = [
    ("ana@bootcamp.local", "Аня", "А", "#E91E63"),
    ("dima@bootcamp.local", "Дима", "Д", "#3F51B5"),
    ("masha@bootcamp.local", "Маша", "М", "#9C27B0"),
    ("sergey@bootcamp.local", "Серёжа", "С", "#FF9800"),
]


def ensure_schema(db: Session) -> None:
    """SQLite: add missing columns if DB was created before schema change."""
    bind = db.get_bind()
    if bind.dialect.name != "sqlite":
        return
    rows = db.execute(text("PRAGMA table_info(chat_messages)")).fetchall()
    col_names = {r[1] for r in rows}
    if "category" not in col_names:
        db.execute(text("ALTER TABLE chat_messages ADD COLUMN category VARCHAR(80) NOT NULL DEFAULT 'Общее'"))
        db.commit()


def seed_demo(db: Session) -> None:
    ensure_schema(db)
    demo = db.execute(select(User).where(User.email == "demo@bootcamp.local")).scalar_one_or_none()
    if not demo:
        demo = User(
            email="demo@bootcamp.local",
            password_hash=get_password_hash(DEMO_PASSWORD),
            name="Демо-пользователь",
            avatar="Д",
            avatar_color="#2BC4A7",
        )
        db.add(demo)
        db.commit()
        db.refresh(demo)

    peers: list[User] = []
    for email, name, av, color in DEMO_USERS:
        u = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
        if not u:
            u = User(
                email=email,
                password_hash=get_password_hash(DEMO_PASSWORD),
                name=name,
                avatar=av,
                avatar_color=color,
            )
            db.add(u)
            db.commit()
            db.refresh(u)
        peers.append(u)

    if not peers:
        return

    # Sample threaded messages with categories (first peer only, to keep noise low)
    first = peers[0]
    count = db.execute(
        select(func.count(ChatMessage.id)).where(
            ChatMessage.sender_id == demo.id, ChatMessage.recipient_id == first.id
        )
    ).scalar_one()
    if count == 0:
        samples = [
            ("Спорт", "Привет! Пойдёшь завтра на пробежку? 🏃"),
            ("Питание", "Записал завтрак в дневник: овсянка + ягоды 🥣"),
            ("Мотивация", "Ты молодец, держишь ритм!"),
            ("Советы", "Попробуй пить воду за 20 мин до еды — так легче контролировать аппетит."),
            ("Общее", "Напиши, как прошла тренировка."),
        ]
        for cat, txt in samples:
            db.add(
                ChatMessage(
                    sender_id=demo.id,
                    recipient_id=first.id,
                    text=txt,
                    category=cat,
                )
            )
        db.add(
            ChatMessage(
                sender_id=first.id,
                recipient_id=demo.id,
                text="Спасибо за рецепт! 🙏 Сегодня сделала салат на ужин.",
                category="Рецепт",
            )
        )
        db.commit()
