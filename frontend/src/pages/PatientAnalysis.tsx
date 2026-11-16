
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { PatientInput } from '../types/patient'
import { calculateBMI } from '../utils/bmi'
import { predictCAD } from '../services/predictionService'
import type { PredictionResponse } from '../services/predictionService'

type NumericBinaryField =
  | 'DM' | 'HTN' | 'Current Smoker' | 'EX-Smoker' | 'FH'
  | 'Edema' | 'Typical Chest Pain' | 'Q Wave'
  | 'St Elevation' | 'St Depression' | 'Tinversion'

type ClinicalYesNoField =
  | 'Weak Peripheral Pulse' | 'Lung rales' | 'Systolic Murmur'
  | 'Diastolic Murmur' | 'Dyspnea' | 'Atypical'
  | 'Nonanginal' | 'LowTH Ang'

type LabField =
  | 'FBS' | 'CR' | 'TG' | 'LDL' | 'HDL' | 'BUN'
  | 'ESR' | 'HB' | 'K' | 'Na' | 'WBC' | 'Lymph'
  | 'Neut' | 'PLT' | 'EF-TTE'

type FinalCardiacField =
  | 'LVH' | 'Poor R Progression' | 'BBB'
  | 'Region RWMA' | 'VHD'

type NumericField =
  | 'Age' | 'Weight' | 'Length' | 'BP' | 'PR' | 'Function Class'

const medicalFields: {
  field:
    | 'Obesity' | 'CRF' | 'CVA' | 'Airway disease'
    | 'Thyroid Disease' | 'CHF' | 'DLP'
  label: string
}[] = [
  { field: 'Obesity', label: 'Obesity' },
  { field: 'CRF', label: 'Chronic Renal Failure (CRF)' },
  { field: 'CVA', label: 'Cerebrovascular Accident (CVA)' },
  { field: 'Airway disease', label: 'Airway Disease' },
  { field: 'Thyroid Disease', label: 'Thyroid Disease' },
  { field: 'CHF', label: 'Congestive Heart Failure (CHF)' },
  { field: 'DLP', label: 'Dyslipidemia (DLP)' },
]

const binaryFields: { field: NumericBinaryField; label: string }[] = [
  { field: 'DM', label: 'Diabetes Mellitus (DM)' },
  { field: 'HTN', label: 'Hypertension (HTN)' },
  { field: 'Current Smoker', label: 'Current Smoker' },
  { field: 'EX-Smoker', label: 'Former Smoker' },
  { field: 'FH', label: 'Family History' },
  { field: 'Edema', label: 'Edema' },
  { field: 'Typical Chest Pain', label: 'Typical Chest Pain' },
  { field: 'Q Wave', label: 'Q Wave' },
  { field: 'St Elevation', label: 'ST Elevation' },
  { field: 'St Depression', label: 'ST Depression' },
  { field: 'Tinversion', label: 'T Inversion' },
]

const examinationFields: {
  field: ClinicalYesNoField
  label: string
}[] = [
  { field: 'Weak Peripheral Pulse', label: 'Weak Peripheral Pulse' },
  { field: 'Lung rales', label: 'Lung Rales' },
  { field: 'Systolic Murmur', label: 'Systolic Murmur' },
  { field: 'Diastolic Murmur', label: 'Diastolic Murmur' },
  { field: 'Dyspnea', label: 'Dyspnea' },
  { field: 'Atypical', label: 'Atypical Chest Pain' },
  { field: 'Nonanginal', label: 'Nonanginal Chest Pain' },
  { field: 'LowTH Ang', label: 'Low-threshold Angina' },
]

const laboratoryFields: { field: LabField; label: string }[] = [
  { field: 'FBS', label: 'Fasting Blood Sugar (FBS)' },
  { field: 'CR', label: 'Creatinine (CR)' },
  { field: 'TG', label: 'Triglycerides (TG)' },
  { field: 'LDL', label: 'LDL Cholesterol' },
  { field: 'HDL', label: 'HDL Cholesterol' },
  { field: 'BUN', label: 'Blood Urea Nitrogen (BUN)' },
  { field: 'ESR', label: 'Erythrocyte Sedimentation Rate (ESR)' },
  { field: 'HB', label: 'Hemoglobin (HB)' },
  { field: 'K', label: 'Potassium (K)' },
  { field: 'Na', label: 'Sodium (Na)' },
  { field: 'WBC', label: 'White Blood Cell Count (WBC)' },
  { field: 'Lymph', label: 'Lymphocytes (Lymph)' },
  { field: 'Neut', label: 'Neutrophils (Neut)' },
  { field: 'PLT', label: 'Platelet Count (PLT)' },
  { field: 'EF-TTE', label: 'Ejection Fraction (EF-TTE)' },
]

const finalCardiacFields: {
  field: FinalCardiacField
  label: string
  type: 'yesno' | 'bbb' | 'number' | 'vhd'
}[] = [
  { field: 'LVH', label: 'Left Ventricular Hypertrophy (LVH)', type: 'yesno' },
  { field: 'Poor R Progression', label: 'Poor R Wave Progression', type: 'yesno' },
  { field: 'BBB', label: 'Bundle Branch Block (BBB)', type: 'bbb' },
  { field: 'Region RWMA', label: 'Regional Wall Motion Abnormality', type: 'number' },
  { field: 'VHD', label: 'Valvular Heart Disease (VHD)', type: 'vhd' },
]

const requiredFields: (keyof PatientInput)[] = [
  'Age', 'Weight', 'Length', 'Sex', 'BMI',
  'DM', 'HTN', 'Current Smoker', 'EX-Smoker', 'FH',
  'Obesity', 'CRF', 'CVA', 'Airway disease',
  'Thyroid Disease', 'CHF', 'DLP',
  'BP', 'PR', 'Edema',
  'Weak Peripheral Pulse', 'Lung rales',
  'Systolic Murmur', 'Diastolic Murmur',
  'Typical Chest Pain', 'Dyspnea', 'Function Class',
  'Atypical', 'Nonanginal', 'LowTH Ang',
  'Q Wave', 'St Elevation', 'St Depression',
  'Tinversion', 'LVH', 'Poor R Progression', 'BBB',
  'FBS', 'CR', 'TG', 'LDL', 'HDL', 'BUN',
  'ESR', 'HB', 'K', 'Na', 'WBC', 'Lymph',
  'Neut', 'PLT', 'EF-TTE', 'Region RWMA', 'VHD',
]

function PatientAnalysis() {
  const [patientData, setPatientData] = useState<Partial<PatientInput>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSample, setIsLoadingSample] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [apiError, setApiError] = useState('')
  const [sampleMessage, setSampleMessage] = useState('')
  const [predictionResult, setPredictionResult] =
    useState<PredictionResponse | null>(null)

  const inputClass =
    'w-full rounded-lg border border-white/10 bg-[#070b0a] px-4 py-3 text-sm text-white outline-none focus:border-emerald-400'

  function updateNumericField(field: NumericField, value: string) {
    setPatientData((previous) => {
      const updated: Partial<PatientInput> = {
        ...previous,
        [field]: value === '' ? undefined : Number(value),
      }

      if (
        typeof updated.Weight === 'number' &&
        typeof updated.Length === 'number'
      ) {
        updated.BMI =
          calculateBMI(updated.Weight, updated.Length) ?? undefined
      } else {
        updated.BMI = undefined
      }

      return updated
    })
    setPredictionResult(null)
  }

  function updateYesNoField(
    field: (typeof medicalFields)[number]['field'],
    value: string,
  ) {
    setPatientData((previous) => ({
      ...previous,
      [field]: value === '' ? undefined : (value as 'Y' | 'N'),
    }))
    setPredictionResult(null)
  }

  function updateBinaryField(field: NumericBinaryField, value: string) {
    setPatientData((previous) => ({
      ...previous,
      [field]: value === '' ? undefined : Number(value),
    }))
    setPredictionResult(null)
  }

  function updateClinicalField(field: ClinicalYesNoField, value: string) {
    setPatientData((previous) => ({
      ...previous,
      [field]: value === '' ? undefined : (value as 'Y' | 'N'),
    }))
    setPredictionResult(null)
  }

  function updateLabField(field: LabField, value: string) {
    setPatientData((previous) => ({
      ...previous,
      [field]: value === '' ? undefined : Number(value),
    }))
    setPredictionResult(null)
  }

  function updateFinalCardiacField(field: FinalCardiacField, value: string) {
    setPatientData((previous) => {
      const updated = { ...previous }

      if (field === 'Region RWMA') {
        updated['Region RWMA'] = value === '' ? undefined : Number(value)
      } else if (field === 'LVH') {
        updated.LVH = value === '' ? undefined : (value as 'Y' | 'N')
      } else if (field === 'Poor R Progression') {
        updated['Poor R Progression'] =
          value === '' ? undefined : (value as 'Y' | 'N')
      } else if (field === 'BBB') {
        updated.BBB =
          value === '' ? undefined : (value as 'N' | 'LBBB' | 'RBBB')
      } else if (field === 'VHD') {
        updated.VHD =
          value === ''
            ? undefined
            : (value as 'N' | 'mild' | 'Moderate' | 'Severe')
      }

      return updated
    })
    setPredictionResult(null)
  }

  async function handleLoadSampleData() {
    setValidationError('')
    setApiError('')
    setPredictionResult(null)
    setSampleMessage('')
    setIsLoadingSample(true)

    try {
      const response = await fetch('/sample-patient.json')

      if (!response.ok) {
        throw new Error(`Could not load sample data (${response.status}).`)
      }

      const sampleData: unknown = await response.json()

      if (
        typeof sampleData !== 'object' ||
        sampleData === null ||
        Object.keys(sampleData).length !== 54
      ) {
        throw new Error('Sample data must contain exactly 54 input features.')
      }

      const data = sampleData as PatientInput

      const missing = requiredFields.filter(
        (field) => data[field] === undefined || data[field] === null,
      )

      if (missing.length > 0) {
        throw new Error(`Sample data is missing: ${missing.join(', ')}`)
      }

      setPatientData(data)
      setSampleMessage('Sample patient data loaded successfully.')
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Unable to load sample data. Please try again.',
      )
    } finally {
      setIsLoadingSample(false)
    }
  }

  async function handleAnalyze() {
    setValidationError('')
    setApiError('')
    setSampleMessage('')
    setPredictionResult(null)

    const missingFields = requiredFields.filter(
      (field) => patientData[field] === undefined,
    )

    if (missingFields.length > 0) {
      setValidationError(
        `Please complete all required fields. Missing: ${missingFields.join(', ')}`,
      )
      return
    }

    setIsLoading(true)

    try {
      const result = await predictCAD(patientData as PatientInput)
      setPredictionResult(result)
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Unable to get a prediction. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  function renderYesNoField(field: ClinicalYesNoField, label: string) {
    return (
      <div key={field}>
        <label className="mb-2 block text-sm text-slate-300">{label}</label>
        <select
          value={patientData[field] ?? ''}
          onChange={(e) => updateClinicalField(field, e.target.value)}
          className={inputClass}
        >
          <option value="">Select an option</option>
          <option value="Y">Yes</option>
          <option value="N">No</option>
        </select>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#070b0a] text-white">
      <header className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5 lg:px-12">
        <Link to="/" className="text-lg font-bold">
          CardioVision <span className="text-emerald-400">3D</span>
        </Link>
        <Link
          to="/dashboard"
          className="text-sm text-slate-400 hover:text-emerald-400"
        >
          ← Dashboard
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="text-[10px] font-bold tracking-[3px] text-emerald-400">
            MACHINE LEARNING MODULE
          </p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Patient Analysis
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Enter clinical and demographic features to explore an
            experimental cardiovascular classification prediction.
          </p>
        </div>

        {/* 01. Basic Demographics */}
        <section className="rounded-2xl border border-white/[0.08] bg-[#101a16] p-6 sm:p-8">
          <h2 className="font-bold">01. Basic Demographics</h2>
          <p className="mt-1 text-xs text-slate-500">
            Patient demographic information
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Age (years)</label>
              <input
                type="number"
                min="0"
                max="120"
                value={patientData.Age ?? ''}
                onChange={(e) => updateNumericField('Age', e.target.value)}
                placeholder="Enter age"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Sex</label>
              <select
                value={patientData.Sex ?? ''}
                onChange={(e) =>
                  setPatientData((previous) => ({
                    ...previous,
                    Sex: e.target.value
                      ? (e.target.value as PatientInput['Sex'])
                      : undefined,
                  }))
                }
                className={inputClass}
              >
                <option value="">Select sex</option>
                <option value="Male">Male</option>
                <option value="Fmale">Fmale (dataset label)</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Weight (kg)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={patientData.Weight ?? ''}
                onChange={(e) => updateNumericField('Weight', e.target.value)}
                placeholder="Enter weight"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Height (cm)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={patientData.Length ?? ''}
                onChange={(e) => updateNumericField('Length', e.target.value)}
                placeholder="Enter height"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">BMI (kg/m²)</label>
              <input
                type="number"
                value={patientData.BMI ?? ''}
                readOnly
                placeholder="Auto-calculated"
                className="w-full cursor-not-allowed rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-3 text-sm text-emerald-400 outline-none"
              />
              <p className="mt-2 text-xs text-slate-500">
                Automatically calculated.
              </p>
            </div>
          </div>
        </section>

        {/* 02. Medical History */}
        <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#101a16] p-6 sm:p-8">
          <h2 className="font-bold">02. Medical History</h2>
          <p className="mt-1 text-xs text-slate-500">Existing medical conditions</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {medicalFields.map(({ field, label }) => (
              <div key={field}>
                <label className="mb-2 block text-sm text-slate-300">{label}</label>
                <select
                  value={patientData[field] ?? ''}
                  onChange={(e) => updateYesNoField(field, e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select an option</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>
            ))}
          </div>
        </section>

        {/* 03. Lifestyle & Clinical Indicators */}
        <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#101a16] p-6 sm:p-8">
          <h2 className="font-bold">03. Lifestyle & Clinical Indicators</h2>
          <p className="mt-1 text-xs text-slate-500">
            Numeric binary features (0 or 1)
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {binaryFields.map(({ field, label }) => (
              <div key={field}>
                <label className="mb-2 block text-sm text-slate-300">{label}</label>
                <select
                  value={patientData[field] ?? ''}
                  onChange={(e) => updateBinaryField(field, e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select dataset value</option>
                  <option value="1">1</option>
                  <option value="0">0</option>
                </select>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-slate-500">
            Use the dataset's original 0/1 encoding. Do not assume the
            clinical meaning of these codes without checking the data dictionary.
          </p>
        </section>

        {/* 04. Clinical Examination */}
        <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#101a16] p-6 sm:p-8">
          <h2 className="font-bold">04. Clinical Examination</h2>
          <p className="mt-1 text-xs text-slate-500">
            Vital measurements and clinical examination findings
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                ['BP', 'Blood Pressure (BP)'],
                ['PR', 'Pulse Rate (PR)'],
                ['Function Class', 'Function Class'],
              ] as const
            ).map(([field, label]) => (
              <div key={field}>
                <label className="mb-2 block text-sm text-slate-300">{label}</label>
                <input
                  type="number"
                  step="any"
                  value={patientData[field] ?? ''}
                  onChange={(e) => updateNumericField(field, e.target.value)}
                  placeholder={`Enter ${label}`}
                  className={inputClass}
                />
              </div>
            ))}
            {examinationFields.map(({ field, label }) =>
              renderYesNoField(field, label),
            )}
          </div>
        </section>

        {/* 05. Laboratory & Cardiac Measurements */}
        <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#101a16] p-6 sm:p-8">
          <h2 className="font-bold">05. Laboratory & Cardiac Measurements</h2>
          <p className="mt-1 text-xs text-slate-500">
            Blood test parameters and cardiac function measurements
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {laboratoryFields.map(({ field, label }) => (
              <div key={field}>
                <label className="mb-2 block text-sm text-slate-300">{label}</label>
                <input
                  type="number"
                  step="any"
                  value={patientData[field] ?? ''}
                  onChange={(e) => updateLabField(field, e.target.value)}
                  placeholder={`Enter ${label}`}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 06. Cardiac Imaging & ECG */}
        <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#101a16] p-6 sm:p-8">
          <h2 className="font-bold">06. Cardiac Imaging & ECG</h2>
          <p className="mt-1 text-xs text-slate-500">
            ECG and cardiac imaging findings
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {finalCardiacFields.map(({ field, label, type }) => (
              <div key={field}>
                <label className="mb-2 block text-sm text-slate-300">{label}</label>
                <select
                  value={patientData[field] ?? ''}
                  onChange={(e) => updateFinalCardiacField(field, e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select an option</option>

                  {type === 'yesno' && (
                    <>
                      <option value="Y">Yes</option>
                      <option value="N">No</option>
                    </>
                  )}

                  {type === 'bbb' && (
                    <>
                      <option value="N">N</option>
                      <option value="LBBB">LBBB</option>
                      <option value="RBBB">RBBB</option>
                    </>
                  )}

                  {type === 'number' &&
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}

                  {type === 'vhd' && (
                    <>
                      <option value="N">N</option>
                      <option value="mild">Mild</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Severe">Severe</option>
                    </>
                  )}
                </select>
              </div>
            ))}
          </div>
        </section>

        {/* Prediction Section */}
        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#101a16] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">Run Cardiovascular Analysis</h2>
              <p className="mt-1 text-xs leading-6 text-slate-400">
                Load the included sample record or complete all fields
                using the dataset's original encodings.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleLoadSampleData}
                disabled={isLoadingSample || isLoading}
                className="rounded-lg border border-emerald-400/40 px-6 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingSample ? 'Loading Sample...' : 'Load Sample Data'}
              </button>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoading || isLoadingSample}
                className="rounded-lg bg-emerald-400 px-6 py-3 text-sm font-bold text-[#07110e] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Patient'}
              </button>
            </div>
          </div>

          {sampleMessage && (
            <p role="status" className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              {sampleMessage}
            </p>
          )}

          {validationError && (
            <p role="alert" className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-300">
              {validationError}
            </p>
          )}

          {apiError && (
            <p role="alert" className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-300">
              {apiError}
            </p>
          )}

          {predictionResult && (
            <div className="mt-6 rounded-xl border border-emerald-500/20 bg-[#07110e] p-5">
              <p className="text-xs font-bold tracking-[2px] text-emerald-400">
                MODEL OUTPUT
              </p>
              <h3 className="mt-3 text-2xl font-bold">
                {predictionResult.prediction}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-400">
                Experimental model classification. This is not a clinical diagnosis.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300">CAD probability</span>
                    <span className="font-semibold text-white">
                      {(predictionResult.probabilities.CAD * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${predictionResult.probabilities.CAD * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300">Normal probability</span>
                    <span className="font-semibold text-white">
                      {(predictionResult.probabilities.Normal * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-sky-400"
                      style={{ width: `${predictionResult.probabilities.Normal * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <p className="mt-6 text-xs leading-6 text-slate-500">
          Research and educational prototype only. Predictions are not
          clinical diagnoses and must not guide medical treatment.
        </p>
      </div>
    </main>
  )
}

export default PatientAnalysis
