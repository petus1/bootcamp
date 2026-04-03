# Bootcamp MVP

## Frontend
- Static app: `index.html`, `styles.css`, `js/app.js`
- Backend integration is enabled through `API_BASE` (default `http://127.0.0.1:8000/api/v1`)

## Backend (Python/FastAPI)
- Location: `backend/`
- Run locally:
  1. `cd backend`
  2. `python -m venv .venv`
  3. `.venv\\Scripts\\activate` (Windows)
  4. `pip install -r requirements.txt`
  5. Copy `.env.example` to `.env`
  6. `uvicorn app.main:app --reload --port 8000`

## Docker Compose
- From repo root run: `docker compose up --build`
- Services:
  - API: `http://127.0.0.1:8000`
  - PostgreSQL: `localhost:5432`
  - Redis: `localhost:6379`

## API quick checks
- `GET /health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/chats`
- `POST /api/v1/tracking/start`