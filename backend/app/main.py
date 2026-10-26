from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

from app.api.v1.health import router as health_router
from app.core.config import Settings, get_settings

from app.api.v1.products import router as products_router
from app.api.v1.categories import router as categories_router

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
            yield
        finally:
            client.close()
            app.state.mongo_client = None

    application = FastAPI(
        title="AKSHUNN Intelligent Technology API",
        version="0.1.0",
        lifespan=lifespan,
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=app_settings.cors_allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    application.include_router(health_router)
    application.include_router(products_router)
    application.include_router(categories_router)
    return application


app = create_app()
