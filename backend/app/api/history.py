
from datetime import date, datetime, time, timedelta, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.prediction_history import PredictionHistory


router = APIRouter(
    prefix="/api/v1",
    tags=["Prediction History"],
)


@router.get("/history")
def get_prediction_history(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=5, ge=1, le=100),
    prediction: Literal["CAD", "Normal"] | None = Query(default=None),
    prediction_id: int | None = Query(default=None, ge=1),
    date_from: date | None = Query(default=None),
    date_to: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if date_from and date_to and date_from > date_to:
        raise HTTPException(
            status_code=400,
            detail="Start date cannot be after end date.",
        )

    statement = select(PredictionHistory)

    # Prediction class filter
    if prediction is not None:
        statement = statement.where(
            PredictionHistory.prediction == prediction
        )

    # Exact prediction ID search
    if prediction_id is not None:
        statement = statement.where(
            PredictionHistory.id == prediction_id
        )

    # Inclusive start date in UTC
    if date_from is not None:
        start_datetime = datetime.combine(
            date_from,
            time.min,
            tzinfo=timezone.utc,
        )

        statement = statement.where(
            PredictionHistory.created_at >= start_datetime
        )

    # Inclusive end date using next-day exclusive boundary
    if date_to is not None:
        end_datetime = datetime.combine(
            date_to + timedelta(days=1),
            time.min,
            tzinfo=timezone.utc,
        )

        statement = statement.where(
            PredictionHistory.created_at < end_datetime
        )

    # Count matching records before pagination
    count_statement = (
        select(func.count())
        .select_from(statement.subquery())
    )

    total_records = db.scalar(count_statement) or 0

    # Stable ordering and pagination
    records_statement = (
        statement
        .order_by(
            desc(PredictionHistory.created_at),
            desc(PredictionHistory.id),
        )
        .offset((page - 1) * limit)
        .limit(limit)
    )

    records = db.scalars(records_statement).all()

    return {
        "total": total_records,
        "page": page,
        "limit": limit,
        "records": [
            {
                "id": record.id,
                "prediction": record.prediction,
                "probabilities": {
                    "CAD": record.cad_probability,
                    "Normal": record.normal_probability,
                },
                "patient_data": record.patient_data,
                "created_at": record.created_at,
            }
            for record in records
        ],
    }


@router.get("/history/{prediction_id}")
def get_prediction_details(
    prediction_id: int,
    db: Session = Depends(get_db),
):
    record = db.get(PredictionHistory, prediction_id)

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction record not found",
        )

    return {
        "id": record.id,
        "prediction": record.prediction,
        "probabilities": {
            "CAD": record.cad_probability,
            "Normal": record.normal_probability,
        },
        "patient_data": record.patient_data,
        "created_at": record.created_at,
    }
