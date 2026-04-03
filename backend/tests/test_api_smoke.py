import os
import sys
from pathlib import Path

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///./test.db"
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["ok"] is True
