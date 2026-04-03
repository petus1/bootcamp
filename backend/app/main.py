from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.security import decode_access_token
from app.db.seed import seed_demo
from app.db.session import Base, SessionLocal, engine
from app.services.websocket_manager import manager

@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_demo(db)
    finally:
        db.close()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

# Bearer в заголовке — cookies не используем; allow_credentials=True + allow_origins=["*"]
# несовместимы по спецификации CORS и ломают fetch с Authorization в части браузеров.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[x.strip() for x in settings.cors_origins.split(",")],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True}


app.include_router(api_router, prefix=settings.api_prefix)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    token = websocket.query_params.get("token")
    user_id = decode_access_token(token or "")
    if not user_id:
        await websocket.close(code=4401)
        return
    uid = int(user_id)
    await manager.connect(uid, websocket)
    await manager.send_to_user(uid, {"type": "presence:update", "data": {"online": True}})
    try:
        while True:
            _ = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(uid, websocket)
