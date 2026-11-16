
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import PatientAnalysis from './pages/PatientAnalysis'
import ModelPerformance from './pages/ModelPerformance'
import Explainability from './pages/Explainability'
import PredictionDetails from './pages/PredictionDetails'

// Lazy-load the 3D module to reduce initial bundle size
const HeartExplorer = lazy(() => import('./pages/HeartExplorer'))

function ComingSoon({ title }: { title: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070b0a] px-6 text-white">
      <div className="text-center">
        <p className="text-xs font-bold tracking-[3px] text-emerald-400">
          CARDIOVISION 3D
        </p>

        <h1 className="mt-4 text-3xl font-bold">{title}</h1>

        <p className="mt-3 text-sm text-slate-400">
          This module is under development.
        </p>

        <a
          href="/"
          className="mt-7 inline-block rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
        >
          ← Back to Home
        </a>
      </div>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/patient-analysis"
          element={<PatientAnalysis />}
        />

        <Route
          path="/model-performance"
          element={<ModelPerformance />}
        />

        <Route
          path="/explainability"
          element={<Explainability />}
        />

        {/* Individual Prediction Details */}
        <Route
          path="/history/:id"
          element={<PredictionDetails />}
        />

        <Route
          path="/heart-explorer"
          element={
            <Suspense
              fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#070b0a] text-emerald-400">
                  Loading 3D Heart Explorer...
                </div>
              }
            >
              <HeartExplorer />
            </Suspense>
          }
        />

        <Route
          path="*"
          element={<ComingSoon title="Page Not Found" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
