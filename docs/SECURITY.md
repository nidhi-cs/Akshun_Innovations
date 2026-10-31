# Security Notes

## Environment Variables

- Keep all MongoDB credentials, private URLs, and admin material in backend `.env` files only.
- Do not hardcode secrets in source files.
- Only public frontend values are exposed through `NEXT_PUBLIC_` variables.

## CORS

- The backend only allows explicitly configured origins.
- Creds are enabled only for trusted origins.
- Wildcard origins are not used with credentials enabled.

## Validation and Error Handling

- Incoming request bodies are validated with Pydantic.
- Validation and server errors return controlled JSON payloads without stack traces.
- Logs do not include secrets, tokens, or raw Authorization headers.

## Rate Limiting

- Public POST endpoints for quote requests and contact messages are protected by in-memory rate limiting.
- This works reliably in single-process deployments.
- For multi-instance production deployments, Redis or another shared store should replace the local in-memory bucket.

## Data Handling

- MongoDB connection strings and database credentials stay in the backend environment.
- The frontend never writes secrets to the browser bundle.
- Existing data is preserved and no destructive database migration is introduced.
