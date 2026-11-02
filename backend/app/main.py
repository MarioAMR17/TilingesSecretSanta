from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .config import settings
from .database import Base, SessionLocal, engine
from .routers import participantes, resultado, sorteo
from .seed import seed_participantes, seed_restricciones

Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    seed_participantes(db)
    seed_restricciones(db)

app = FastAPI(title="Tilinge Posada API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(participantes.router)
app.include_router(sorteo.router)
app.include_router(resultado.router)


@app.get("/")
def root():
    return {"status": "ok"}
