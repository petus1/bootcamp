"""Demo users and sample messages (idempotent)."""

from sqlalchemy import func, select, text
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.models import ChatMessage, Post, PostComment, PostLike, User

DEMO_PASSWORD = "demo1234"
ACTIVE_EMAIL_DOMAIN = "@bootcamp.app"
LEGACY_EMAIL_DOMAIN = "@bootcamp.local"
DEMO_EMAIL = f"demo{ACTIVE_EMAIL_DOMAIN}"
LEGACY_DEMO_EMAIL = f"demo{LEGACY_EMAIL_DOMAIN}"

DEMO_USERS = [
    ("ana@bootcamp.app", "Аня", "А", "#E91E63"),
    ("dima@bootcamp.app", "Дима", "Д", "#3F51B5"),
    ("masha@bootcamp.app", "Маша", "М", "#9C27B0"),
    ("sergey@bootcamp.app", "Серёжа", "С", "#FF9800"),
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

    # Create feed tables if missing (SQLite-only bootstrap)
    db.execute(
        text(
            "CREATE TABLE IF NOT EXISTS posts ("
            "id INTEGER PRIMARY KEY, "
            "author_id INTEGER NOT NULL, "
            "text TEXT NOT NULL, "
            "tag VARCHAR(80) NOT NULL DEFAULT 'Общее', "
            "emoji VARCHAR(16) NULL, "
            "created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
            ")"
        )
    )
    db.execute(
        text(
            "CREATE TABLE IF NOT EXISTS post_likes ("
            "id INTEGER PRIMARY KEY, "
            "post_id INTEGER NOT NULL, "
            "user_id INTEGER NOT NULL, "
            "created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
            ")"
        )
    )
    db.execute(
        text(
            "CREATE TABLE IF NOT EXISTS post_comments ("
            "id INTEGER PRIMARY KEY, "
            "post_id INTEGER NOT NULL, "
            "author_id INTEGER NOT NULL, "
            "text TEXT NOT NULL, "
            "created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
            ")"
        )
    )
    db.commit()


def seed_demo(db: Session) -> None:
    ensure_schema(db)
    demo = db.execute(select(User).where(User.email == DEMO_EMAIL)).scalar_one_or_none()
    if not demo:
        # Migrate legacy local-domain demo account to a valid domain.
        demo = db.execute(select(User).where(User.email == LEGACY_DEMO_EMAIL)).scalar_one_or_none()
        if demo:
            demo.email = DEMO_EMAIL
            db.commit()
            db.refresh(demo)
    if not demo:
        demo = User(
            email=DEMO_EMAIL,
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
            legacy_email = email.replace(ACTIVE_EMAIL_DOMAIN, LEGACY_EMAIL_DOMAIN)
            # Migrate legacy local-domain peer accounts to valid domain.
            u = db.execute(select(User).where(User.email == legacy_email)).scalar_one_or_none()
            if u:
                u.email = email
                db.commit()
                db.refresh(u)
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

    # Feed seed (idempotent-ish)
    existing_posts = db.execute(select(func.count(Post.id))).scalar_one()
    if existing_posts == 0:
        demo_posts = [
            ("Активность", "Утренняя пробежка 5 км по парку! Кто со мной завтра? 🌤", None),
            ("Рецепт", "Сделала ПП-пиццу на цветной капусте — вкусно и легко 🍕", "🍕"),
            ("Мотивация", "Неделя без пропусков! Маленькие шаги каждый день дают результат.", "🔥"),
        ]
        created = []
        for tag, text_body, emoji in demo_posts:
            p = Post(author_id=demo.id, text=text_body, tag=tag, emoji=emoji)
            db.add(p)
            db.commit()
            db.refresh(p)
            created.append(p)
        if created:
            db.add(PostComment(post_id=created[0].id, author_id=peers[0].id, text="Круто! Я тоже хочу начать."))
            db.add(PostLike(post_id=created[0].id, user_id=peers[1].id))
            db.add(PostLike(post_id=created[0].id, user_id=demo.id))
            db.commit()
