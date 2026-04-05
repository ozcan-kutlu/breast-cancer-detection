"""
FastAPI uygulaması: yalnızca REST API (Next.js arayüzü ayrı çalışır).
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import dataset, health, prediction
from app.state import load_ml_resources


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.ml = load_ml_resources()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="Breast Cancer Detection API",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    api_prefix = "/api"
    app.include_router(health.router, prefix=api_prefix)
    app.include_router(dataset.router, prefix=api_prefix)
    app.include_router(prediction.router, prefix=api_prefix)

    return app


app = create_app()
