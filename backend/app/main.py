from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth


app = FastAPI(
    title="API Proyecto Integrador",
    version="1.0.0"
)


origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(auth.router)


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