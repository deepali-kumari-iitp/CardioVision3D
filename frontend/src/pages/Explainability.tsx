
import { Link } from 'react-router-dom'

type Feature = {
  name: string
  value: number
}

const features: Feature[] = [
  { name: 'Typical Chest Pain', value: 0.101079 },
  { name: 'Age', value: 0.049445 },
  { name: 'Atypical Chest Pain (N)', value: 0.042699 },
  { name: 'Atypical Chest Pain (Y)', value: 0.042430 },
  { name: 'Region RWMA', value: 0.033865 },
  { name: 'EF-TTE', value: 0.033251 },
  { name: 'Hypertension', value: 0.023508 },
  { name: 'Blood Pressure', value: 0.022111 },
  { name: 'FBS', value: 0.021368 },
  { name: 'T Inversion', value: 0.016966 },
]

function Explainability() {
  const maxValue = Math.max(...features.map((feature) => feature.value))

  return (
    <main className="min-h-screen bg-[#070b0a] text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5 lg:px-12">
        <Link to="/" className="text-lg font-bold">
          CardioVision <span className="text-emerald-400">3D</span>
        </Link>

        <Link
          to="/dashboard"
          className="text-sm text-slate-400 transition hover:text-emerald-400"
        >
          ← Dashboard
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Page Heading */}
        <section>
          <p className="text-[10px] font-bold tracking-[3px] text-emerald-400">
            MODEL INTERPRETABILITY
          </p>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Explainable AI
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Explore which input features are associated with the Random Forest
            model's predictions using SHAP feature importance.
          </p>
        </section>

        {/* Data Source Notice */}
        <section
          className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-5"
          aria-label="Data source information"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300">
              !
            </span>

            <div>
              <h2 className="text-sm font-semibold text-amber-300">
                Reference SHAP Results
              </h2>

              <p className="mt-2 text-xs leading-6 text-slate-400">
                The values currently displayed on this page are predefined
                reference values in the frontend. They are not fetched
                dynamically from the backend. They should not be interpreted
                as a live explanation of an individual patient's prediction.
              </p>
            </div>
          </div>
        </section>

        {/* Global Feature Importance */}
        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#101a16] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <h2 className="font-bold">Top 10 Features</h2>

              <p className="mt-2 text-xs text-slate-500">
                Mean absolute SHAP values · CAD class · Test dataset
              </p>
            </div>

            <span className="w-fit rounded-full border border-amber-500/20 bg-amber-500/[0.08] px-3 py-1.5 text-[10px] font-semibold text-amber-300">
              Static reference data
            </span>
          </div>

          <div className="mt-8 space-y-6">
            {features.map((feature, index) => {
              const percentage = (feature.value / maxValue) * 100

              return (
                <div key={feature.name}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-300">
                      <span className="mr-3 text-xs text-slate-600">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      {feature.name}
                    </span>

                    <span className="shrink-0 text-xs tabular-nums text-emerald-400">
                      {feature.value.toFixed(4)}
                    </span>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded-full bg-white/[0.06]"
                    role="meter"
                    aria-label={`${feature.name} reference importance`}
                    aria-valuemin={0}
                    aria-valuemax={maxValue}
                    aria-valuenow={feature.value}
                  >
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Interpretation Guide */}
        <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#101a16] p-6 sm:p-8">
          <h2 className="text-lg font-bold">
            Understanding SHAP Values
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-emerald-400">
                Global Feature Importance
              </p>

              <p className="mt-2 text-xs leading-6 text-slate-400">
                Mean absolute SHAP values summarize the average magnitude
                of feature contributions across a dataset. Larger values
                indicate greater average influence on model output.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-sky-400">
                Individual Prediction Explanation
              </p>

              <p className="mt-2 text-xs leading-6 text-slate-400">
                Individual SHAP explanations show how each feature
                contributes to a particular model prediction. These
                require SHAP values calculated for the individual input.
              </p>
            </div>
          </div>
        </section>

        {/* Research Disclaimer */}
        <section className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-5">
          <h2 className="text-sm font-semibold text-amber-300">
            Important Interpretation Note
          </h2>

          <p className="mt-2 text-xs leading-6 text-slate-400">
            SHAP values describe model behaviour, not causal relationships.
            Feature importance does not establish that a feature causes
            cardiovascular disease. Model explanations should not be used
            independently for clinical decisions.
          </p>
        </section>
      </div>
    </main>
  )
}

export default Explainability
