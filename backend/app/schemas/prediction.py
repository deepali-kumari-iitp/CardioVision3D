
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class PatientInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    # Demographic and clinical measurements
    Age: float = Field(ge=0, le=120)
    Weight: float = Field(gt=0)
    Length: float = Field(gt=0)
    Sex: Literal["Male", "Fmale"]
    BMI: float = Field(gt=0)

    # Numeric binary features
    DM: int = Field(ge=0, le=1)
    HTN: int = Field(ge=0, le=1)
    Current_Smoker: int = Field(ge=0, le=1, alias="Current Smoker")
    EX_Smoker: int = Field(ge=0, le=1, alias="EX-Smoker")
    FH: int = Field(ge=0, le=1)

    # Categorical clinical features
    Obesity: Literal["Y", "N"]
    CRF: Literal["Y", "N"]
    CVA: Literal["Y", "N"]
    Airway_disease: Literal["Y", "N"] = Field(alias="Airway disease")
    Thyroid_Disease: Literal["Y", "N"] = Field(alias="Thyroid Disease")
    CHF: Literal["Y", "N"]
    DLP: Literal["Y", "N"]

    BP: float
    PR: float
    Edema: int = Field(ge=0, le=1)
    Weak_Peripheral_Pulse: Literal["Y", "N"] = Field(alias="Weak Peripheral Pulse")
    Lung_rales: Literal["Y", "N"] = Field(alias="Lung rales")
    Systolic_Murmur: Literal["Y", "N"] = Field(alias="Systolic Murmur")
    Diastolic_Murmur: Literal["Y", "N"] = Field(alias="Diastolic Murmur")
    Typical_Chest_Pain: int = Field(ge=0, le=1, alias="Typical Chest Pain")
    Dyspnea: Literal["Y", "N"]
    Function_Class: float = Field(alias="Function Class")
    Atypical: Literal["Y", "N"]
    Nonanginal: Literal["Y", "N"]
    LowTH_Ang: Literal["Y", "N"] = Field(alias="LowTH Ang")

    # ECG features
    Q_Wave: int = Field(ge=0, le=1, alias="Q Wave")
    St_Elevation: int = Field(ge=0, le=1, alias="St Elevation")
    St_Depression: int = Field(ge=0, le=1, alias="St Depression")
    Tinversion: int = Field(ge=0, le=1)
    LVH: Literal["Y", "N"]
    Poor_R_Progression: Literal["Y", "N"] = Field(alias="Poor R Progression")
    BBB: Literal["N", "LBBB", "RBBB"]

    # Laboratory features
    FBS: float
    CR: float
    TG: float
    LDL: float
    HDL: float
    BUN: float
    ESR: float
    HB: float
    K: float
    Na: float
    WBC: float
    Lymph: float
    Neut: float
    PLT: float
    EF_TTE: float = Field(alias="EF-TTE")
    Region_RWMA: float = Field(alias="Region RWMA")
    VHD: Literal["N", "mild", "Moderate", "Severe"]


class PredictionResponse(BaseModel):
    prediction: Literal["CAD", "Normal"]
    probabilities: dict[str, float]
