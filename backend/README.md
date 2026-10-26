# AKSHUNN Backend

Phase 1 provides the FastAPI foundation only. The existing frontend and its
local product catalogue remain unchanged; product, quote, contact, and admin
APIs are not included yet.

## Requirements

- Python 3.10 or newer
- A MongoDB server or MongoDB Atlas connection URI

## Local setup

Run these commands from the repository root:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` and set `MONGODB_URI` to your MongoDB connection URI. Do
not commit `.env` or put database credentials in source code. The local
development default shown in `.env.example` assumes MongoDB is listening on
`localhost:27017`.

Configure `MONGODB_DATABASE` for the database name and
`CORS_ALLOWED_ORIGINS` as a JSON array of browser origins allowed to call this
API, for example:

```dotenv
CORS_ALLOWED_ORIGINS=["http://localhost:3000"]
```

For production, set the allowed origins to the deployed frontend origin(s).
`MONGODB_SERVER_SELECTION_TIMEOUT_MS` controls how long MongoDB connectivity
checks wait before reporting an unavailable database.

## Run the backend

From `backend/` with the virtual environment activated:

```powershell
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`; interactive API documentation
is at `http://127.0.0.1:8000/docs`. Check service and MongoDB connectivity at
`http://127.0.0.1:8000/api/v1/health`. The health check returns HTTP 503 when
MongoDB is unavailable.

## Run tests

From `backend/` with dependencies installed:

```powershell
python -m pytest
```

Tests use a fake MongoDB client and do not require a running MongoDB instance.
