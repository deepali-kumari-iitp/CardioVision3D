
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.prediction import router as prediction_router
from app.api.history import router as history_router
from app.api.analytics import router as analytics_router


app = FastAPI(
    title="CardioVision 3D API",
    description="Cardiovascular Risk Prediction and Visualization API",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

frontend_url = os.getenv("FRONTEND_URL")

if frontend_url:
    origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to CardioVision 3D API",
        "status": "running",
    }


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CardioVision 3D Backend",
    }


app.include_router(prediction_router)
app.include_router(history_router)
app.include_router(analytics_router)
