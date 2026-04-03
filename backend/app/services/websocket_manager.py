from collections import defaultdict

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[int, set[WebSocket]] = defaultdict(set)

    async def connect(self, user_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections[user_id].add(websocket)

    def disconnect(self, user_id: int, websocket: WebSocket) -> None:
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_to_user(self, user_id: int, payload: dict) -> None:
        sockets = list(self.active_connections.get(user_id, set()))
        for socket in sockets:
            await socket.send_json(payload)

    async def broadcast_pair(self, user_a: int, user_b: int, payload: dict) -> None:
        await self.send_to_user(user_a, payload)
        if user_b != user_a:
            await self.send_to_user(user_b, payload)


manager = ConnectionManager()
