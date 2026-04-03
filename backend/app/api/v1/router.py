from fastapi import APIRouter

from app.api.v1 import auth, chat, feed, profile, progress, tracking, users

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(profile.router)
api_router.include_router(users.router)
api_router.include_router(feed.router)
api_router.include_router(chat.router)
api_router.include_router(tracking.router)
api_router.include_router(progress.router)
