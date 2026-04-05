"""FastAPI bağımlılıkları."""

from fastapi import Request

from app.state import MLResources


def get_ml(request: Request) -> MLResources:
    return request.app.state.ml
