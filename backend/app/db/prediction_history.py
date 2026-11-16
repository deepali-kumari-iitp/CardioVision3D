
from datetime import datetime
from typing import Any

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    DateTime,
    Float,
    Identity,
    Index,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    __table_args__ = (
        CheckConstraint(
            "prediction IN ('CAD', 'Normal')",
            name="prediction_history_prediction_check",
        ),
        CheckConstraint(
            "cad_probability BETWEEN 0 AND 1",
            name="prediction_history_cad_probability_check",
        ),
        CheckConstraint(
            "normal_probability BETWEEN 0 AND 1",
            name="prediction_history_normal_probability_check",
        ),
        Index(
            "ix_prediction_history_created_at_id",
            "created_at",
            "id",
        ),
        Index(
            "ix_prediction_history_prediction_created_at",
            "prediction",
            "created_at",
        ),
    )

    id: Mapped[int] = mapped_column(
        BigInteger,
        Identity(always=True),
        primary_key=True,
    )

    patient_data: Mapped[dict[str, Any]] = mapped_column(
        JSONB,
        nullable=False,
    )

    prediction: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
    )

    cad_probability: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    normal_probability: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
