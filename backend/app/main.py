from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.config import FRONTEND_ORIGIN
from app.database import engine
from app.routers import auth, portfolio

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CoinFlow API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(portfolio.router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "crypto-ai-copilot"}
