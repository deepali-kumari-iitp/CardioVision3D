
import { Link } from 'react-router-dom'

const metrics = [
  {
    label: 'Holdout Accuracy',
    value: '83.61%',
    score: 83.61,
    note: 'Overall test set predictions',
    symbol: '◎',
  },
  {
    label: 'CAD Precision',
    value: '86.67%',
    score: 86.67,
    note: 'Correct positive predictions',
    symbol: '⌖',
  },
  {
    label: 'CAD Recall',
    value: '90.70%',
    score: 90.70,
    note: 'Actual CAD cases identified',
    symbol: '↗',
  },
  {
    label: 'CAD F1 Score',
    value: '88.64%',
    score: 88.64,
    note: 'Precision and recall balance',
    symbol: '◇',
  },
]

const folds = [
  { label: 'Fold 01', score: 85.71 },
  { label: 'Fold 02', score: 83.67 },
  { label: 'Fold 03', score: 93.75 },
  { label: 'Fold 04', score: 91.67 },
  { label: 'Fold 05', score: 89.58 },
]

// Rows = Actual class; columns = Predicted class
const confusionMatrix = [
  { actual: 'CAD', predictedCAD: 39, predictedNormal: 4 },
  { actual: 'Normal', predictedCAD: 6, predictedNormal: 12 },
]

function ModelPerformance() {
  return (
    <main className="performance-page min-h-screen overflow-hidden bg-[#070b0a] text-white">
      <style>{`
        @keyframes performance-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes performance-glow {
          0%, 100% { opacity: .35; }
          50% { opacity: .75; }
        }

        @keyframes performance-fill {
          from { width: 0; }
        }

        .performance-enter {
          animation: performance-fade-up .65s ease-out both;
        }

        .performance-delay-1 { animation-delay: .10s; }
        .performance-delay-2 { animation-delay: .20s; }
        .performance-delay-3 { animation-delay: .30s; }

        .performance-glow {
          animation: performance-glow 5s ease-in-out infinite;
        }

        .performance-bar {
          animation: performance-fill 1.2s ease-out both;
        }

        .performance-card {
          background: linear-gradient(
            145deg,
            rgba(18, 34, 27, .88),
            rgba(10, 19, 15, .76)
          );
          border: 1px solid rgba(148, 163, 184, .12);
          backdrop-filter: blur(18px);
          transition: transform .25s ease, border-color .25s ease,
            box-shadow .25s ease;
        }

        .performance-card:hover {
          transform: translateY(-4px);
          border-color: rgba(52, 211, 153, .38);
          box-shadow: 0 12px 35px rgba(16, 185, 129, .07);
        }

        .performance-grid {
          background-image:
            linear-gradient(rgba(52, 211, 153, .025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52, 211, 153, .025) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
        }

        @media (prefers-reduced-motion: reduce) {
          .performance-page *,
          .performance-page *::before,
          .performance-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="performance-grid absolute inset-0" />
        <div className="performance-glow absolute -top-48 right-[-100px] h-[420px] w-[420px] rounded-full bg-emerald-500/[0.07] blur-[120px]" />
        <div className="performance-glow absolute bottom-[-180px] left-[-100px] h-[360px] w-[360px] rounded-full bg-teal-500/[0.05] blur-[110px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex min-h-[70px] items-center justify-between border-b border-white/[0.08] bg-[#080d0b]/75 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-12">
        <Link to="/" className="text-lg font-bold tracking-tight">
          CardioVision <span className="text-emerald-400">3D</span>
        </Link>

        <Link
          to="/dashboard"
          className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-300 sm:text-sm"
        >
          ← Dashboard
        </Link>
      </header>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-9 sm:px-7 sm:py-12 lg:px-12">

        {/* Page heading */}
        <section className="performance-enter mb-9">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-px w-7 bg-emerald-400" />
            <p className="text-[10px] font-bold tracking-[3px] text-emerald-400">
              MACHINE LEARNING / EVALUATION
            </p>
          </div>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Model <span className="text-emerald-400">Performance</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Evaluation of the Random Forest cardiovascular classification
                model using holdout testing and leakage-safe cross-validation.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              <span className="text-xs text-emerald-300">
                Evaluation Results
              </span>
            </div>
          </div>
        </section>

        {/* Metric cards */}
        <section className="performance-enter performance-delay-1 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <article
              key={metric.label}
              className="performance-card group relative overflow-hidden rounded-2xl p-5 sm:p-6"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-400/[0.05] blur-2xl transition group-hover:bg-emerald-400/[0.12]" />

              <div className="relative flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400">
                  {metric.label}
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] text-lg text-emerald-400">
                  {metric.symbol}
                </span>
              </div>

              <h2 className="relative mt-6 text-3xl font-bold tracking-tight text-emerald-400 sm:text-4xl">
                {metric.value}
              </h2>

              <p className="relative mt-2 text-[11px] text-slate-500">
                {metric.note}
              </p>

              <div className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="performance-bar h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-300"
                  style={{
                    width: `${metric.score}%`,
                    animationDelay: `${index * 120}ms`,
                  }}
                />
              </div>

              <p className="mt-2 text-right text-[10px] text-slate-500">
                {metric.score.toFixed(2)} / 100
              </p>
            </article>
          ))}
        </section>

        {/* Validation and fold results */}
        <section className="performance-enter performance-delay-2 mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_1.4fr]">

          <article className="performance-card rounded-2xl p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold tracking-[2px] text-emerald-400">
                  MODEL VALIDATION
                </p>
                <h2 className="mt-2 text-lg font-bold">
                  Cross-validation Summary
                </h2>
              </div>

              <span className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-2 text-xs text-emerald-300">
                5 Folds
              </span>
            </div>

            <div className="mt-8">
              <p className="text-xs text-slate-400">
                Mean CV Accuracy
              </p>
              <p className="mt-2 text-4xl font-bold text-emerald-400">
                88.88%
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Average accuracy across five validation folds
              </p>
            </div>

            <div className="my-7 h-px bg-white/[0.08]" />

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Standard Deviation
              </span>
              <span className="text-lg font-semibold text-white">
                3.72%
              </span>
            </div>

            <div className="mt-5 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
              <p className="text-xs leading-6 text-slate-400">
                The pipeline performs preprocessing separately within each
                training fold to avoid preprocessing leakage during
                cross-validation.
              </p>
            </div>
          </article>

          <article className="performance-card rounded-2xl p-5 sm:p-7">
            <div>
              <p className="text-[10px] font-bold tracking-[2px] text-emerald-400">
                FOLD-WISE RESULTS
              </p>
              <h2 className="mt-2 text-lg font-bold">
                Cross-validation Accuracy
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                Individual accuracy scores from the five validation folds.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              {folds.map((fold, index) => (
                <div key={fold.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {fold.label}
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-emerald-300">
                      {fold.score.toFixed(2)}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="performance-bar h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-300"
                      style={{
                        width: `${fold.score}%`,
                        animationDelay: `${index * 130}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* Confusion matrix */}
        <section className="performance-enter performance-delay-3 mt-7">
          <article className="performance-card rounded-2xl p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-bold tracking-[2px] text-emerald-400">
                  CLASSIFICATION ANALYSIS
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  Confusion Matrix
                </h2>
                <p className="mt-2 text-xs text-slate-500">
                  Holdout test set · 61 samples
                </p>
              </div>

              <span className="text-xs text-slate-500">
                Actual vs Predicted
              </span>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[420px] border-separate border-spacing-2 text-center">
                <thead>
                  <tr>
                    <th className="p-3 text-left text-[11px] font-medium text-slate-500">
                      Actual class
                    </th>
                    <th className="p-3 text-xs font-medium text-slate-400">
                      Predicted CAD
                    </th>
                    <th className="p-3 text-xs font-medium text-slate-400">
                      Predicted Normal
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {confusionMatrix.map((row) => (
                    <tr key={row.actual}>
                      <th className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-left text-xs font-semibold text-slate-300">
                        {row.actual}
                      </th>

                      <td className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.09] p-5 text-2xl font-bold text-emerald-300">
                        {row.predictedCAD}
                      </td>

                      <td className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-5 text-2xl font-bold text-slate-200">
                        {row.predictedNormal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[11px] text-slate-400">
              <span>Actual CAD correctly predicted: <strong className="text-emerald-300">39</strong></span>
              <span>Actual Normal correctly predicted: <strong className="text-emerald-300">12</strong></span>
              <span>Total test samples: <strong className="text-white">61</strong></span>
            </div>
          </article>
        </section>

        {/* Dataset and evaluation context */}
        <section className="performance-enter mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="performance-card rounded-xl p-5">
            <p className="text-xs text-slate-500">Test samples</p>
            <p className="mt-2 text-2xl font-bold text-white">61</p>
            <p className="mt-1 text-[11px] text-slate-500">
              20% holdout split
            </p>
          </div>

          <div className="performance-card rounded-xl p-5">
            <p className="text-xs text-slate-500">Actual CAD cases</p>
            <p className="mt-2 text-2xl font-bold text-emerald-400">43</p>
            <p className="mt-1 text-[11px] text-slate-500">
              In holdout test set
            </p>
          </div>

          <div className="performance-card rounded-xl p-5">
            <p className="text-xs text-slate-500">Actual Normal cases</p>
            <p className="mt-2 text-2xl font-bold text-white">18</p>
            <p className="mt-1 text-[11px] text-slate-500">
              In holdout test set
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <footer className="mt-8 border-t border-white/[0.08] py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <span className="text-emerald-400">ⓘ</span>
            <p className="max-w-4xl text-[11px] leading-6 text-slate-500">
              These results represent model performance on this specific
              dataset and evaluation setup. They do not establish clinical
              validity, calibrated medical risk, or diagnostic performance
              in real-world populations. CardioVision 3D is an educational
              and research prototype, not a medical diagnostic tool.
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default ModelPerformance
