# Deployment Guide

## Prerequisites

- Python 3.13
- Node.js 20+
- MongoDB 7.x or MongoDB Atlas
- A production frontend domain and HTTPS certificate
- Backend process manager such as systemd, PM2, Docker, or a managed platform

## Backend Environment

Create `backend/.env` from `backend/.env.example` and populate the values for the target environment.

Required keys:

- `MONGODB_URI`
- `MONGODB_DATABASE`
- `CORS_ALLOWED_ORIGINS`
- `MONGODB_SERVER_SELECTION_TIMEOUT_MS`
- `APP_ENV`
- `LOG_LEVEL`

Example:

```env
MONGODB_URI=mongodb://user:password@mongodb.example.internal:27017/akshunn_innovations?authSource=admin
MONGODB_DATABASE=akshunn_innovations
CORS_ALLOWED_ORIGINS=["https://www.example.com"]
MONGODB_SERVER_SELECTION_TIMEOUT_MS=3000
APP_ENV=production
LOG_LEVEL=INFO
```

Never commit `.env` files. Keep credentials only on the server or secret manager.

## Backend Startup

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
```

Production-safe deployment notes:

- Disable debug mode in production.
- Keep `APP_ENV=production`.
- Use HTTPS termination at the reverse proxy or load balancer.
- Route health checks through the `/api/v1/health` endpoint.

## Frontend Environment

Create `frontend/.env.local` from `frontend/.env.example`.

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

Keep all secrets on the backend. Only expose public values through `NEXT_PUBLIC_` variables.

## CORS

The backend reads allowed origins from `CORS_ALLOWED_ORIGINS`. This should be a strict allowlist and must not use wildcard origins when credentials are enabled.

## Health and Readiness

- Health: `GET /api/v1/health`
- OpenAPI: `GET /docs`

## Production Troubleshooting

- Check the application logs for validation and request errors.
- Confirm MongoDB connectivity and credentials.
- Ensure the frontend API URL matches your deployed backend origin.
- Verify the CORS allowlist contains the production frontend domain.

## Rollback Considerations

- Keep the previous deployed build available.
- Roll back the backend and frontend together when schema or API contract changes are introduced.
- Preserve MongoDB data and avoid destructive migration steps.
