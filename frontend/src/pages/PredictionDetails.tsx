
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

type PatientData = Record<string, string | number>

type PredictionRecord = {
  id: number
  prediction: 'CAD' | 'Normal'
  probabilities: {
    CAD: number
    Normal: number
  }
  patient_data: PatientData
  created_at: string
}

const featureSections = [
  {
    title: 'Basic Demographics',
    description: 'Patient demographic information',
    icon: '◉',
    fields: ['Age', 'Sex', 'Weight', 'Length', 'BMI'],
  },
  {
    title: 'Medical History',
    description: 'Existing medical conditions',
    icon: '✚',
    fields: [
      'Obesity', 'CRF', 'CVA', 'Airway disease',
      'Thyroid Disease', 'CHF', 'DLP',
    ],
  },
  {
    title: 'Lifestyle & Clinical Indicators',
    description: 'Lifestyle and cardiovascular indicators',
    icon: '♡',
    fields: [
      'DM', 'HTN', 'Current Smoker', 'EX-Smoker',
      'FH', 'Edema', 'Typical Chest Pain', 'Q Wave',
      'St Elevation', 'St Depression', 'Tinversion',
    ],
  },
  {
    title: 'Clinical Examination',
    description: 'Clinical examination findings',
    icon: '⌁',
    fields: [
      'BP', 'PR', 'Function Class', 'Weak Peripheral Pulse',
      'Lung rales', 'Systolic Murmur', 'Diastolic Murmur',
      'Dyspnea', 'Atypical', 'Nonanginal', 'LowTH Ang',
    ],
  },
  {
    title: 'Laboratory & Cardiac Measurements',
    description: 'Laboratory test results and measurements',
    icon: '⌗',
    fields: [
      'FBS', 'CR', 'TG', 'LDL', 'HDL', 'BUN', 'ESR',
      'HB', 'K', 'Na', 'WBC', 'Lymph', 'Neut', 'PLT', 'EF-TTE',
    ],
  },
  {
    title: 'Cardiac Imaging & ECG',
    description: 'Cardiac imaging and ECG indicators',
    icon: '⌁',
    fields: ['LVH', 'Poor R Progression', 'BBB', 'Region RWMA', 'VHD'],
  },
]

function formatFieldName(name: string) {
  const labels: Record<string, string> = {
    DM: 'Diabetes Mellitus',
    HTN: 'Hypertension',
    FH: 'Family History',
    CRF: 'Chronic Renal Failure',
    CVA: 'Cerebrovascular Accident',
    CHF: 'Congestive Heart Failure',
    DLP: 'Dyslipidemia',
    BP: 'Blood Pressure',
    PR: 'Pulse Rate',
    FBS: 'Fasting Blood Sugar',
    CR: 'Creatinine',
    TG: 'Triglycerides',
    LDL: 'LDL Cholesterol',
    HDL: 'HDL Cholesterol',
    BUN: 'Blood Urea Nitrogen',
    ESR: 'Erythrocyte Sedimentation Rate',
    HB: 'Hemoglobin',
    K: 'Potassium',
    Na: 'Sodium',
    WBC: 'White Blood Cells',
    PLT: 'Platelets',
    BMI: 'Body Mass Index',
    'EF-TTE': 'Ejection Fraction',
    'Region RWMA': 'Regional Wall Motion Abnormality',
    VHD: 'Valvular Heart Disease',
    BBB: 'Bundle Branch Block',
  }

  return labels[name] || name
}

function formatValue(value: string | number) {
  if (value === 'Y') return 'Yes'
  if (value === 'N') return 'No'
  if (value === 'Fmale') return 'Female'
  return String(value)
}

function getPercentage(value: number) {
  return Math.max(0, Math.min(100, value * 100))
}

export default function PredictionDetails() {
  const { id } = useParams<{ id: string }>()

  const [record, setRecord] = useState<PredictionRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    async function fetchPredictionDetails() {
      if (!id || !/^[1-9]\d*$/.test(id)) {
        setError('Invalid prediction ID.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_BASE_URL}/api/v1/history/${id}`
        )

        if (response.status === 404) {
          throw new Error('Prediction record not found.')
        }

        if (!response.ok) {
          throw new Error(
            `Unable to load prediction details (${response.status}).`
          )
        }

        const data: PredictionRecord = await response.json()

        if (isActive) {
          setRecord(data)
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : 'Something went wrong while loading the record.'
          )
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    fetchPredictionDetails()

    return () => {
      isActive = false
    }
  }, [id])

  return (
    <div className="min-h-screen bg-[#070b09] text-slate-100">

      {/* SAME HEADER AS PATIENT ANALYSIS */}
      <header className="sticky top-0 z-50 flex h-[58px] w-full items-center justify-between border-b border-white/[0.08] bg-[#080d0a]/95 px-6 backdrop-blur-xl sm:px-10">

        <Link
          to="/dashboard"
          className="text-base font-extrabold tracking-tight text-white transition-opacity hover:opacity-80"
        >
          CardioVision <span className="text-emerald-400">3D</span>
        </Link>

        <Link
          to="/dashboard"
          className="group flex items-center gap-2 text-xs font-semibold text-slate-300 transition-colors hover:text-emerald-400"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">
            ←
          </span>
          Dashboard
        </Link>

      </header>

      {/* BACKGROUND EFFECTS */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-emerald-500/[0.06] blur-[140px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/[0.04] blur-[140px]" />
      </div>

      {/* LOADING */}
      {loading && (
        <main className="relative flex min-h-[80vh] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-5 h-11 w-11 animate-spin rounded-full border-[3px] border-emerald-400/20 border-t-emerald-400" />
            <h2 className="text-lg font-semibold text-white">
              Loading Prediction
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Preparing your clinical analysis...
            </p>
          </div>
        </main>
      )}

      {/* ERROR */}
      {!loading && (error || !record) && (
        <main className="relative flex min-h-[80vh] items-center justify-center px-6">
          <div className="w-full max-w-lg rounded-3xl border border-red-400/20 bg-[#101a15] p-10 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 text-3xl text-red-400">
              !
            </div>

            <h1 className="text-2xl font-bold text-white">
              Unable to Load Record
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              {error || 'Prediction record is unavailable.'}
            </p>

            <Link
              to="/dashboard"
              className="mt-8 inline-flex rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-[#07110d] transition-all hover:-translate-y-1 hover:bg-emerald-300"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </main>
      )}

      {/* MAIN CONTENT */}
      {!loading && record && (
        <main className="relative mx-auto max-w-6xl px-4 py-9 sm:px-8 lg:px-12">

          {/* PREDICTION HERO */}
          <section className="relative mb-12 overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-[#11231a] via-[#0d1712] to-[#0b1210] p-7 shadow-2xl shadow-black/20 sm:p-10">

            <div className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full bg-emerald-400/[0.08] blur-3xl" />

            <div className="relative flex flex-wrap items-center justify-between gap-6">

              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300">
                    Prediction Record
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Prediction <span className="text-emerald-400">#{record.id}</span>
                </h1>

                <p className="mt-3 text-sm text-slate-400 sm:text-base">
                  Complete patient analysis and model output
                </p>
              </div>

              <span
                className={`rounded-2xl border px-5 py-3 text-sm font-bold ${
                  record.prediction === 'CAD'
                    ? 'border-red-400/25 bg-red-400/10 text-red-400'
                    : 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
                }`}
              >
                {record.prediction} Prediction
              </span>
            </div>

            <div className="relative mt-8 flex flex-wrap gap-8 border-t border-white/[0.08] pt-6 text-xs">
              <div>
                <span className="block text-slate-500">Record ID</span>
                <span className="mt-1 block font-semibold text-slate-200">
                  #{record.id}
                </span>
              </div>

              <div>
                <span className="block text-slate-500">Prediction Date</span>
                <span className="mt-1 block font-semibold text-slate-200">
                  {new Date(record.created_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>
          </section>

          {/* PREDICTION SUMMARY */}
          <section className="mb-12">

            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">
                Model Output
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Prediction Summary
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Overview of the model classification and probability scores.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">

              {/* CLASS */}
              <div className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#142019] to-[#0e1712] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-400">
                    Predicted Class
                  </p>
                  <span className="text-xl text-emerald-400">◈</span>
                </div>

                <p className={`text-4xl font-extrabold ${
                  record.prediction === 'CAD'
                    ? 'text-red-400'
                    : 'text-emerald-400'
                }`}>
                  {record.prediction}
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  Model classification output
                </p>
              </div>

              {/* CAD */}
              <div className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#142019] to-[#0e1712] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-400/30">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-400">
                    CAD Probability
                  </p>
                  <span className="text-xl text-red-400">↗</span>
                </div>

                <p className="text-4xl font-extrabold text-red-400">
                  {getPercentage(record.probabilities.CAD).toFixed(1)}%
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-1000"
                    style={{
                      width: `${getPercentage(record.probabilities.CAD)}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Model probability score
                </p>
              </div>

              {/* NORMAL */}
              <div className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#142019] to-[#0e1712] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-400">
                    Normal Probability
                  </p>
                  <span className="text-xl text-cyan-400">↗</span>
                </div>

                <p className="text-4xl font-extrabold text-cyan-400">
                  {getPercentage(record.probabilities.Normal).toFixed(1)}%
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-1000"
                    style={{
                      width: `${getPercentage(record.probabilities.Normal)}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Model probability score
                </p>
              </div>

            </div>
          </section>

          {/* PATIENT INFORMATION */}
          <section>

            <div className="mb-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">
                Patient Information
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Clinical Input Features
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                The 54 input features submitted to the prediction model.
              </p>
            </div>

            <div className="space-y-6">

              {featureSections.map((section, index) => (
                <div
                  key={section.title}
                  className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101a15]/90 shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/20"
                >

                  {/* SECTION HEADER */}
                  <div className="flex items-center gap-4 border-b border-white/[0.07] bg-gradient-to-r from-emerald-400/[0.06] to-transparent px-5 py-5 sm:px-7">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-xl text-emerald-400">
                      {section.icon}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white sm:text-lg">
                        {section.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {section.description}
                      </p>
                    </div>

                    <span className="ml-auto text-xs font-semibold text-emerald-400/70">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* FEATURE GRID */}
                  <div className="grid gap-px bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
                    {section.fields.map((field) => (
                      <div
                        key={field}
                        className="group/item bg-[#101a15] px-5 py-5 transition-colors duration-200 hover:bg-[#17261d] sm:px-7"
                      >
                        <p className="text-xs font-medium text-slate-500 transition-colors group-hover/item:text-emerald-400">
                          {formatFieldName(field)}
                        </p>

                        <p className="mt-2 break-words text-sm font-bold text-slate-200">
                          {record.patient_data[field] !== undefined
                            ? formatValue(record.patient_data[field])
                            : 'Not available'}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              ))}

            </div>
          </section>

          {/* DISCLAIMER */}
          <section className="mt-12 rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-400/[0.07] to-transparent p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-lg text-amber-300">
                !
              </div>

              <div>
                <h3 className="text-sm font-bold text-amber-300">
                  Research & Educational Disclaimer
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  CardioVision 3D is an educational and research prototype.
                  Its predictions and probabilities are model outputs, not
                  clinically validated risk estimates or a medical diagnosis.
                  Do not use this application to make medical decisions.
                </p>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-12 border-t border-white/[0.07] py-7 text-center">
            <p className="text-xs font-semibold tracking-wide text-slate-400">
              CardioVision 3D
              <span className="mx-2 text-emerald-400">·</span>
              Research & Educational Prototype
            </p>

            <p className="mt-2 text-[10px] text-slate-600">
              Prediction Record #{record.id}
            </p>
          </footer>

        </main>
      )}
    </div>
  )
}
