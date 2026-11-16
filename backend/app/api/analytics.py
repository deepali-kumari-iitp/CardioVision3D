
from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.prediction_history import PredictionHistory


router = APIRouter(
    prefix="/api/v1",
    tags=["Database Analytics"],
)


@router.get("/analytics")
def get_prediction_analytics(
    days: int = Query(default=30, ge=7, le=365),
    db: Session = Depends(get_db),
):
    """
    Returns database-wide prediction statistics and daily trends.

    Daily dates are grouped using the PostgreSQL session timezone.
    """

    # Overall statistics across every prediction record
    summary_statement = select(
        func.count(PredictionHistory.id).label("total"),
        func.coalesce(
            func.sum(
                case(
                    (PredictionHistory.prediction == "CAD", 1),
                    else_=0,
                )
            ),
            0,
        ).label("cad"),
        func.coalesce(
            func.sum(
                case(
                    (PredictionHistory.prediction == "Normal", 1),
                    else_=0,
                )
            ),
            0,
        ).label("normal"),
        func.avg(
            PredictionHistory.cad_probability
        ).label("average_cad_probability"),
    )

    summary = db.execute(summary_statement).one()

    total = int(summary.total or 0)
    cad = int(summary.cad or 0)
    normal = int(summary.normal or 0)

    cad_percentage = (
        round((cad / total) * 100, 2) if total else 0.0
    )

    normal_percentage = (
        round((normal / total) * 100, 2) if total else 0.0
    )

    average_cad_probability = (
        round(float(summary.average_cad_probability), 4)
        if summary.average_cad_probability is not None
        else None
    )

    # Daily prediction counts for the requested period
    start_date = date.today() - timedelta(days=days - 1)

    daily_statement = (
        select(
            func.date(PredictionHistory.created_at).label("date"),
            func.count(PredictionHistory.id).label("total"),
            func.sum(
                case(
                    (PredictionHistory.prediction == "CAD", 1),
                    else_=0,
                )
            ).label("cad"),
            func.sum(
                case(
                    (PredictionHistory.prediction == "Normal", 1),
                    else_=0,
                )
            ).label("normal"),
        )
        .where(
            PredictionHistory.created_at >= start_date
        )
        .group_by(func.date(PredictionHistory.created_at))
        .order_by(func.date(PredictionHistory.created_at))
    )

    daily_records = db.execute(daily_statement).all()

    daily_trend = [
        {
            "date": record.date.isoformat(),
            "total": int(record.total or 0),
            "cad": int(record.cad or 0),
            "normal": int(record.normal or 0),
        }
        for record in daily_records
    ]

    return {
        "summary": {
            "total_predictions": total,
            "cad_predictions": cad,
            "normal_predictions": normal,
            "cad_percentage": cad_percentage,
            "normal_percentage": normal_percentage,
            "average_cad_probability": average_cad_probability,
        },
        "daily_trend": daily_trend,
        "period_days": days,
    }
