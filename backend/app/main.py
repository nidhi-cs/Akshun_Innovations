import logging
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from time import perf_counter
from typing import AsyncIterator
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo import MongoClient

from app.api.v1.health import router as health_router
from app.api.v1.products import router as products_router
from app.api.v1.categories import router as categories_router
from app.api.v1.subcategories import router as subcategories_router
from app.api.v1.kits import router as kits_router
from app.api.v1.lab_solutions import router as lab_solutions_router
from app.api.v1.quote_requests import router as quote_requests_router
from app.api.v1.contact import router as contact_router
from app.api.v1 import product_detail_content
from app.core.config import Settings, get_settings
from app.core.indexes import ensure_mongodb_indexes

logger = logging.getLogger("akshunn")


def create_app(settings: Settings | None = None) -> FastAPI:
    app_settings = settings or get_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        client = MongoClient(
            app_settings.mongodb_uri,
            serverSelectionTimeoutMS=app_settings.mongodb_server_selection_timeout_ms,
        )
        app.state.mongo_client = client
        try:
            try:
                database = client[app_settings.mongodb_database]
            except TypeError:
                database = None

            if database is not None:
                try:
                    ensure_mongodb_indexes(database)
                except Exception:
                    logger.warning(
                        "MongoDB index initialization skipped because the database object is unavailable during startup.",
                        exc_info=True,
                    )
            yield
        finally:
            client.close()
            app.state.mongo_client = None

    application = FastAPI(
        title="AKSHUNN Intelligent Technology API",
        version="0.1.0",
        lifespan=lifespan,
    )
    application.state.rate_limit_buckets = defaultdict(deque)

    @application.middleware("http")
    async def log_requests(request: Request, call_next):
        request_id = request.headers.get("x-request-id") or str(uuid4())
        request.state.request_id = request_id
        start = perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            logger.exception(
                "Unhandled error for %s %s",
                request.method,
                request.url.path,
            )
            raise

        duration_ms = round((perf_counter() - start) * 1000, 2)
        logger.info(
            "[%s] %s %s -> %s in %.2f ms",
            request_id,
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
        )
        response.headers["X-Request-ID"] = request_id
        return response

    @application.exception_handler(RequestValidationError)
    async def handle_validation_error(request: Request, exc: RequestValidationError):
        logger.warning(
            "Validation error on %s %s: %s",
            request.method,
            request.url.path,
            exc.errors(),
        )
        return JSONResponse(
            status_code=422,
            content={
                "detail": "Request validation failed.",
                "errors": exc.errors(),
            },
        )

    @application.exception_handler(HTTPException)
    async def handle_http_exception(request: Request, exc: HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )

    @application.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, exc: Exception):
        logger.exception(
            "Unexpected error while handling %s %s",
            request.method,
            request.url.path,
        )
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error."},
        )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=app_settings.cors_allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    )

    application.include_router(health_router)
    application.include_router(products_router)
    application.include_router(categories_router)
    application.include_router(subcategories_router)
    application.include_router(kits_router)
    application.include_router(lab_solutions_router)
    application.include_router(quote_requests_router)
    application.include_router(contact_router)
    application.include_router(product_detail_content.router, prefix="/api/v1")

    return application


app = create_app()
