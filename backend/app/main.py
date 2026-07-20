"""Punto de entrada de la API y del frontend en producción."""

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers import ai, auth


app = FastAPI(
    title="API Proyecto Integrador",
    version="1.0.0"
)


# Live Server durante desarrollo; producción agrega su dominio mediante .env.
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
]

origins.extend(
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(auth.router)
app.include_router(ai.router)


@app.get("/")
def inicio():
    return {
        "success": True,
        "message": "API funcionando correctamente"
    }


@app.get("/health")
def comprobar_estado():
    return {
        "success": True,
        "status": "healthy"
    }


# En producción una única URL sirve API y archivos estáticos.
frontend_dir = Path(__file__).resolve().parents[2] / "frontend"

if frontend_dir.is_dir():
    app.mount(
        "/",
        StaticFiles(directory=str(frontend_dir), html=True),
        name="frontend"
    )
