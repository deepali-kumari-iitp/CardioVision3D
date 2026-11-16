
import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.prediction import PatientInput, PredictionResponse
from app.services.prediction_service import predict_cad
from app.services.history_service import save_prediction


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1",
    tags=["Prediction"]
)


class PredictionRequest(BaseModel):
    patient_data: PatientInput


@router.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(
    request: PredictionRequest,
    db: Session = Depends(get_db)
):
    try:
        # Convert validated input into dictionary
        patient_data = request.patient_data.model_dump(by_alias=True)

        # Generate ML prediction
        result = predict_cad(patient_data)

        # Save successful prediction in PostgreSQL
        save_prediction(
            db=db,
            patient_data=patient_data,
            prediction_result=result
        )

        logger.info("CAD prediction generated and saved successfully")

        # Preserve existing frontend response format
        return result

    except Exception:
        logger.exception("CAD prediction or database save failed")

        raise HTTPException(
            status_code=500,
            detail="Prediction service encountered an internal error."
        )
