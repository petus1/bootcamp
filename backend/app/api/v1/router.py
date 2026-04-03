from fastapi import APIRouter

from app.api.v1 import auth, chat, profile, progress, tracking

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(profile.router)
api_router.include_router(chat.router)
api_router.include_router(tracking.router)
api_router.include_router(progress.router)
