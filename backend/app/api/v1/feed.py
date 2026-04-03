from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import Post, PostComment, PostLike, User
from app.db.session import get_db
from app.schemas import CommentCreate, CommentOut, PostCreate, PostOut, UserPublic

router = APIRouter(prefix="/feed", tags=["feed"])


def _user_public(u: User) -> UserPublic:
    return UserPublic(id=u.id, name=u.name, avatar=u.avatar, avatar_color=u.avatar_color)


@router.get("/posts", response_model=list[PostOut])
def list_posts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    posts = db.execute(select(Post).order_by(Post.created_at.desc()).limit(100)).scalars().all()
    if not posts:
        return []

    post_ids = [p.id for p in posts]
    like_counts = dict(
        db.execute(select(PostLike.post_id, func.count(PostLike.id)).where(PostLike.post_id.in_(post_ids)).group_by(PostLike.post_id)).all()
    )
    comment_counts = dict(
        db.execute(select(PostComment.post_id, func.count(PostComment.id)).where(PostComment.post_id.in_(post_ids)).group_by(PostComment.post_id)).all()
    )
    liked = set(
        db.execute(
            select(PostLike.post_id).where(PostLike.post_id.in_(post_ids), PostLike.user_id == current_user.id)
        ).scalars().all()
    )
    authors = {
        u.id: u
        for u in db.execute(select(User).where(User.id.in_([p.author_id for p in posts]))).scalars().all()
    }

    return [
        PostOut(
            id=p.id,
            author=_user_public(authors[p.author_id]),
            text=p.text,
            tag=p.tag,
            emoji=p.emoji,
            created_at=p.created_at,
            likes=int(like_counts.get(p.id, 0)),
            comments=int(comment_counts.get(p.id, 0)),
            liked_by_me=p.id in liked,
        )
        for p in posts
        if p.author_id in authors
    ]


@router.post("/posts", response_model=PostOut)
def create_post(payload: PostCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = Post(
        author_id=current_user.id,
        text=payload.text.strip(),
        tag=(payload.tag or "Общее").strip() or "Общее",
        emoji=(payload.emoji.strip() if payload.emoji else None),
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return PostOut(
        id=p.id,
        author=_user_public(current_user),
        text=p.text,
        tag=p.tag,
        emoji=p.emoji,
        created_at=p.created_at,
        likes=0,
        comments=0,
        liked_by_me=False,
    )


@router.post("/posts/{post_id}/like")
def toggle_like(post_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    existing = db.execute(
        select(PostLike).where(PostLike.post_id == post_id, PostLike.user_id == current_user.id)
    ).scalar_one_or_none()
    if existing:
        db.delete(existing)
        db.commit()
        return {"liked": False}
    db.add(PostLike(post_id=post_id, user_id=current_user.id))
    db.commit()
    return {"liked": True}


@router.get("/posts/{post_id}/comments", response_model=list[CommentOut])
def list_comments(post_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    _ = current_user
    rows = db.execute(select(PostComment).where(PostComment.post_id == post_id).order_by(PostComment.created_at.asc())).scalars().all()
    if not rows:
        return []
    author_ids = {c.author_id for c in rows}
    authors = {u.id: u for u in db.execute(select(User).where(User.id.in_(author_ids))).scalars().all()}
    return [
        CommentOut(id=c.id, author=_user_public(authors[c.author_id]), text=c.text, created_at=c.created_at)
        for c in rows
        if c.author_id in authors
    ]


@router.post("/posts/{post_id}/comments", response_model=CommentOut)
def add_comment(
    post_id: int, payload: CommentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    c = PostComment(post_id=post_id, author_id=current_user.id, text=payload.text.strip())
    db.add(c)
    db.commit()
    db.refresh(c)
    return CommentOut(id=c.id, author=_user_public(current_user), text=c.text, created_at=c.created_at)

