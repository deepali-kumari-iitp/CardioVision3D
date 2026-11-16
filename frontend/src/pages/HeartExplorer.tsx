
import { Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  useProgress,
} from '@react-three/drei'

import { HeartModel } from '../components/HeartModel'

type HeartPart = {
  id: string
  name: string
  category: string
  description: string
  function: string
  color: string
}

const heartParts: HeartPart[] = [
  {
    id: 'aorta',
    name: 'Aorta',
    category: 'Major Blood Vessels',
    description:
      'The aorta is the largest artery in the human body. It carries oxygen-rich blood away from the left ventricle.',
    function: 'Distributes oxygenated blood from the heart to the entire body.',
    color: '#ef4444',
  },
  {
    id: 'superior-vena-cava',
    name: 'Superior Vena Cava',
    category: 'Major Blood Vessels',
    description:
      'A large vein that returns oxygen-poor blood from the upper part of the body.',
    function: 'Carries blood from the head, neck, arms and upper chest to the right atrium.',
    color: '#3b82f6',
  },
  {
    id: 'inferior-vena-cava',
    name: 'Inferior Vena Cava',
    category: 'Major Blood Vessels',
    description:
      'A large vein that returns oxygen-poor blood from the lower part of the body.',
    function: 'Carries blood from the abdomen, pelvis and legs to the right atrium.',
    color: '#3b82f6',
  },
  {
    id: 'pulmonary-artery',
    name: 'Pulmonary Artery',
    category: 'Major Blood Vessels',
    description:
      'The pulmonary artery carries oxygen-poor blood from the right ventricle towards the lungs.',
    function: 'Transports blood to the lungs for oxygenation.',
    color: '#3b82f6',
  },
  {
    id: 'pulmonary-veins',
    name: 'Pulmonary Veins',
    category: 'Major Blood Vessels',
    description:
      'Usually four pulmonary veins return oxygen-rich blood from the lungs to the left atrium.',
    function: 'Bring oxygenated blood back to the heart.',
    color: '#ef4444',
  },
  {
    id: 'right-atrium',
    name: 'Right Atrium',
    category: 'Heart Chambers',
    description:
      'The right atrium receives oxygen-poor blood returning from the body.',
    function: 'Receives blood from the superior and inferior vena cava.',
    color: '#3b82f6',
  },
  {
    id: 'left-atrium',
    name: 'Left Atrium',
    category: 'Heart Chambers',
    description:
      'The left atrium receives oxygen-rich blood returning from the lungs.',
    function: 'Receives oxygenated blood through the pulmonary veins.',
    color: '#ef4444',
  },
  {
    id: 'right-ventricle',
    name: 'Right Ventricle',
    category: 'Heart Chambers',
    description:
      'The right ventricle is the lower-right chamber of the heart.',
    function: 'Pumps oxygen-poor blood into the pulmonary artery towards the lungs.',
    color: '#3b82f6',
  },
  {
    id: 'left-ventricle',
    name: 'Left Ventricle',
    category: 'Heart Chambers',
    description:
      'The left ventricle has a thicker muscular wall than the right ventricle.',
    function: 'Pumps oxygen-rich blood into the aorta and throughout the body.',
    color: '#ef4444',
  },
  {
    id: 'septum',
    name: 'Interventricular Septum',
    category: 'Heart Structures',
    description:
      'The septum is the muscular wall that separates the right and left ventricles.',
    function: 'Prevents direct mixing of blood between the two ventricles.',
    color: '#d1a6a6',
  },
  {
    id: 'tricuspid-valve',
    name: 'Tricuspid Valve',
    category: 'Heart Valves',
    description:
      'The tricuspid valve is located between the right atrium and right ventricle.',
    function: 'Prevents blood from flowing backwards into the right atrium.',
    color: '#d1a6a6',
  },
  {
    id: 'mitral-valve',
    name: 'Mitral Valve',
    category: 'Heart Valves',
    description:
      'The mitral valve is located between the left atrium and left ventricle.',
    function: 'Prevents blood from flowing backwards into the left atrium.',
    color: '#d1a6a6',
  },
  {
    id: 'pulmonary-valve',
    name: 'Pulmonary Valve',
    category: 'Heart Valves',
    description:
      'The pulmonary valve is located between the right ventricle and pulmonary artery.',
    function: 'Prevents blood from flowing back into the right ventricle.',
    color: '#d1a6a6',
  },
  {
    id: 'aortic-valve',
    name: 'Aortic Valve',
    category: 'Heart Valves',
    description:
      'The aortic valve is located between the left ventricle and the aorta.',
    function: 'Prevents blood from flowing backwards from the aorta into the left ventricle.',
    color: '#d1a6a6',
  },
]

const categories = [
  'All Parts',
  'Heart Chambers',
  'Major Blood Vessels',
  'Heart Valves',
  'Heart Structures',
]

const bloodFlow = [
  'Body',
  'Superior & Inferior Vena Cava',
  'Right Atrium',
  'Tricuspid Valve',
  'Right Ventricle',
  'Pulmonary Valve',
  'Pulmonary Artery',
  'Lungs',
  'Pulmonary Veins',
  'Left Atrium',
  'Mitral Valve',
  'Left Ventricle',
  'Aortic Valve',
  'Aorta',
  'Body',
]

function ModelLoader() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="whitespace-nowrap rounded-2xl border border-red-400/20 bg-black/70 px-6 py-5 text-center shadow-2xl backdrop-blur-xl">
        <div className="text-sm font-semibold text-red-400">
          Loading human heart
        </div>
        <div className="mt-2 text-xs text-slate-400">
          {Math.round(progress)}% loaded
        </div>
      </div>
    </Html>
  )
}

function HeartScene() {
  return (
    <>
      <ambientLight intensity={1.7} />

      <directionalLight
        position={[4, 6, 7]}
        intensity={3}
        color="#fff0ed"
      />

      <directionalLight
        position={[-5, 2, -3]}
        intensity={2}
        color="#8abfff"
      />

      <pointLight
        position={[0, -2, 4]}
        intensity={2}
        color="#ff263f"
      />

      <pointLight
        position={[3, 3, -2]}
        intensity={1.5}
        color="#ff7777"
      />

      <Suspense fallback={<ModelLoader />}>
        <HeartModel
          scale={19}
          position={[0, -0.65, 0]}
        />

        <Environment preset="studio" />

        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.4}
          scale={6}
          blur={2.5}
          far={5}
        />
      </Suspense>

      <OrbitControls
        makeDefault
        enableRotate
        enablePan={false}
        enableZoom
        minDistance={5}
        maxDistance={22}
        autoRotate
        autoRotateSpeed={1.1}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.7}
      />
    </>
  )
}

function HeartExplorer() {
  const [selectedCategory, setSelectedCategory] = useState('All Parts')
  const [selectedPart, setSelectedPart] = useState<HeartPart>(heartParts[0])
  const [showBloodFlow, setShowBloodFlow] = useState(false)
  const [showLabels, setShowLabels] = useState(true)

  const filteredParts =
    selectedCategory === 'All Parts'
      ? heartParts
      : heartParts.filter((part) => part.category === selectedCategory)

  const selectCategory = (category: string) => {
    setSelectedCategory(category)
    setShowBloodFlow(false)

    const firstPart =
      category === 'All Parts'
        ? heartParts[0]
        : heartParts.find((part) => part.category === category)

    if (firstPart) setSelectedPart(firstPart)
  }

  return (
    <main className="heart-explorer min-h-screen overflow-hidden bg-[#07090d] text-white">
      <style>{`
        .heart-explorer {
          position: relative;
          isolation: isolate;
        }

        .heart-explorer::before,
        .heart-explorer::after {
          content: "";
          position: fixed;
          z-index: -1;
          width: 480px;
          height: 480px;
          border-radius: 9999px;
          filter: blur(110px);
          pointer-events: none;
          opacity: .20;
          animation: heartGlow 12s ease-in-out infinite alternate;
        }

        .heart-explorer::before {
          top: 8%;
          left: -180px;
          background: #e11d48;
        }

        .heart-explorer::after {
          right: -180px;
          bottom: 5%;
          background: #7f1d35;
          animation-delay: -5s;
        }

        @keyframes heartGlow {
          from { transform: translate3d(0, 0, 0) scale(.9); }
          to { transform: translate3d(80px, 50px, 0) scale(1.2); }
        }

        @keyframes bloodFlow {
          0% { transform: translateX(-110%) scaleX(.7); opacity: 0; }
          25% { opacity: .8; }
          75% { opacity: .8; }
          100% { transform: translateX(110%) scaleX(1.2); opacity: 0; }
        }

        @keyframes redPulse {
          0%, 100% { opacity: .2; transform: scale(.9); }
          50% { opacity: .65; transform: scale(1.15); }
        }

        .blood-flow-line {
          position: absolute;
          height: 2px;
          width: 65%;
          left: 0;
          background: linear-gradient(90deg, transparent, #fb344f, #ff8a8a, transparent);
          filter: drop-shadow(0 0 8px #fb344f);
          animation: bloodFlow 5s linear infinite;
        }

        .blood-flow-line:nth-child(2) {
          top: 65%;
          animation-delay: -2.5s;
          animation-duration: 6s;
        }

        .blood-flow-line:nth-child(3) {
          top: 30%;
          animation-delay: -4s;
          animation-duration: 7s;
          opacity: .4;
        }

        .heart-aura {
          position: absolute;
          width: 260px;
          height: 260px;
          left: 50%;
          top: 46%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: #dc143c;
          filter: blur(100px);
          opacity: .15;
          animation: redPulse 5s ease-in-out infinite;
          pointer-events: none;
        }

        .glass-panel {
          background: rgba(18, 25, 27, .64);
          border: 1px solid rgba(255,255,255,.09);
          box-shadow: 0 12px 45px rgba(0,0,0,.24);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }

        .heart-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .heart-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(239,68,68,.45);
          border-radius: 20px;
        }

        @media (prefers-reduced-motion: reduce) {
          .heart-explorer::before,
          .heart-explorer::after,
          .blood-flow-line,
          .heart-aura {
            animation: none;
          }
        }
      `}</style>

      <header className="relative z-10 flex items-center justify-between border-b border-white/10 bg-black/30 px-6 py-5 backdrop-blur-xl lg:px-12">
        <Link to="/" className="text-lg font-bold tracking-tight">
          CardioVision <span className="text-emerald-400">3D</span>
        </Link>

        <Link
          to="/dashboard"
          className="text-sm text-slate-400 transition hover:text-red-400"
        >
          ← Dashboard
        </Link>
      </header>

      <div className="relative z-10 mx-auto max-w-[1550px] px-5 py-10 sm:px-8 lg:px-12">
        <div>
          <p className="text-[10px] font-bold tracking-[3px] text-red-400">
            INTERACTIVE HUMAN ANATOMY
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            3D Heart Explorer
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Explore the human heart, discover its chambers, valves and blood
            vessels, and understand the pathway of blood circulation.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          {/* 3D HEART VIEW */}

          <section className="glass-panel overflow-hidden rounded-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-sm font-semibold">
                  Human Heart — 3D Anatomy
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Anatomical cutaway model
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLabels((value) => !value)}
                className={`rounded-xl border px-4 py-2 text-xs font-medium transition ${
                  showLabels
                    ? 'border-red-400/40 bg-red-400/10 text-red-300'
                    : 'border-white/10 text-slate-400'
                }`}
              >
                {showLabels ? 'Info panel on' : 'Info panel off'}
              </button>
            </div>

            <div className="relative h-[580px] w-full overflow-hidden sm:h-[700px]">
              {/* Red atmospheric background */}

              <div className="heart-aura" />

              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="blood-flow-line top-[22%]" />
                <div className="blood-flow-line" />
                <div className="blood-flow-line top-[82%]" />
              </div>

              <Canvas
                shadows
                camera={{ position: [0, 0, 10], fov: 35 }}
                dpr={[1, 1.75]}
                gl={{ antialias: true, alpha: true }}
              >
                <HeartScene />
              </Canvas>

              <div className="pointer-events-none absolute bottom-5 left-0 right-0 text-center">
                <span className="rounded-full border border-white/10 bg-black/50 px-5 py-2.5 text-[11px] text-slate-300 shadow-xl backdrop-blur-xl">
                  Drag to rotate · Scroll to zoom · Horizontal auto rotation
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 border-t border-white/[0.08] px-5 py-5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
                Oxygen-rich blood
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                Oxygen-poor blood
              </div>
            </div>
          </section>

          {/* ANATOMY GUIDE */}

          {showLabels && (
            <aside className="flex min-w-0 flex-col gap-5">
              <section className="glass-panel rounded-3xl p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold tracking-[2px] text-red-400">
                      ANATOMY GUIDE
                    </p>

                    <h2 className="mt-2 text-lg font-bold">
                      Explore Heart Parts
                    </h2>
                  </div>

                  <span className="text-xs text-slate-500">
                    {heartParts.length} structures
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => selectCategory(category)}
                      className={`rounded-xl border px-3 py-2 text-xs transition ${
                        selectedCategory === category
                          ? 'border-red-400/40 bg-red-400/10 text-red-300'
                          : 'border-white/[0.08] text-slate-400 hover:border-red-400/30 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="heart-scrollbar mt-5 max-h-[350px] space-y-2 overflow-y-auto pr-1">
                  {filteredParts.map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => {
                        setSelectedPart(part)
                        setShowBloodFlow(false)
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                        selectedPart.id === part.id && !showBloodFlow
                          ? 'border-red-400/40 bg-red-400/[0.09]'
                          : 'border-white/[0.06] bg-black/20 hover:border-white/20'
                      }`}
                    >
                      <span
                        className="h-3 w-3 shrink-0 rounded-full shadow-lg"
                        style={{ backgroundColor: part.color }}
                      />

                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-slate-200">
                          {part.name}
                        </span>

                        <span className="mt-1 block text-[10px] text-slate-500">
                          {part.category}
                        </span>
                      </span>

                      <span className="ml-auto text-slate-500">›</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* ANATOMICAL DETAILS */}

              <section className="glass-panel rounded-3xl border-red-400/20 p-5 sm:p-6">
                <p className="text-[10px] font-bold tracking-[2px] text-red-400">
                  {showBloodFlow ? 'BLOOD CIRCULATION' : 'ANATOMICAL DETAILS'}
                </p>

                {showBloodFlow ? (
                  <>
                    <h2 className="mt-3 text-xl font-bold">
                      How Blood Flows
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Follow the pathway of blood through the heart and lungs.
                    </p>

                    <div className="mt-5 space-y-2">
                      {bloodFlow.map((step, index) => (
                        <div
                          key={`${step}-${index}`}
                          className="flex items-center gap-3"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10 text-[11px] font-bold text-red-300">
                            {index + 1}
                          </span>

                          <span className="text-sm text-slate-200">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-3 flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full shadow-lg"
                        style={{ backgroundColor: selectedPart.color }}
                      />

                      <h2 className="text-xl font-bold">
                        {selectedPart.name}
                      </h2>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      {selectedPart.category}
                    </p>

                    <div className="mt-5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Description
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        {selectedPart.description}
                      </p>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/25 p-4 backdrop-blur-xl">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-red-300">
                        Main Function
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {selectedPart.function}
                      </p>
                    </div>
                  </>
                )}
              </section>

              <button
                type="button"
                onClick={() => setShowBloodFlow((value) => !value)}
                className="rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-left text-sm font-semibold text-red-300 shadow-lg shadow-red-950/20 backdrop-blur-xl transition hover:border-red-400/50 hover:bg-red-500/15"
              >
                {showBloodFlow
                  ? '← Back to selected anatomy'
                  : 'Explore Blood Circulation →'}
              </button>
            </aside>
          )}
        </div>

        {/* DISCLAIMER */}

        <div className="glass-panel mt-7 rounded-2xl px-5 py-4">
          <p className="text-xs leading-6 text-slate-500">
            Educational anatomy visualization. The 3D model is a visual
            reference and anatomical labels are provided in a separate
            learning panel. Animated background effects are illustrative
            and do not represent actual blood-flow simulation.
          </p>
        </div>
      </div>
    </main>
  )
}

export default HeartExplorer
