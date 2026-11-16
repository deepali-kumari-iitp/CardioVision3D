import type { PatientInput } from '../types/patient'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export type PredictionResponse = {
  prediction: 'CAD' | 'Normal'
  probabilities: {
    CAD: number
    Normal: number
  }
}

export async function predictCAD(
  patientData: PatientInput
): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patient_data: patientData,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.detail || `Prediction request failed: ${response.status}`
    )
  }

  return response.json() as Promise<PredictionResponse>
}