const features = [
  {
    number: '01',
    icon: '◈',
    title: 'AI Cardiovascular Prediction',
    description: 'Explore machine learning based cardiovascular predictions.',
    href: '/patient-analysis',
  },
  {
    number: '02',
    icon: '⌁',
    title: 'Data Analytics',
    description: 'Analyze clinical features and cardiovascular patterns.',
    href: '/dashboard',
  },
  {
    number: '03',
    icon: '✳',
    title: 'Explainable AI',
    description: 'Understand model predictions with SHAP explanations.',
    href: '/explainability',
  },
  {
    number: '04',
    icon: '♡',
    title: '3D Heart Explorer',
    description: 'Explore the anatomy of the human heart in 3D.',
    href: '/heart-explorer',
  },
]

const technologies = [
  'Python & Pandas',
  'Scikit-learn',
  'FastAPI',
  'React & Three.js',
]

function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070b0a] text-white">
      {/* Navigation */}
      <header className="border-b border-white/[0.08]">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xl text-emerald-400">
              ♡
            </div>
            <div>
              <h1 className="text-lg font-bold">
                CardioVision <span className="text-emerald-400">3D</span>
              </h1>
              <p className="text-[8px] tracking-[3px] text-slate-500">
                CARDIOVASCULAR INTELLIGENCE
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#platform" className="transition hover:text-emerald-400">Platform</a>
            <a href="#solutions" className="transition hover:text-emerald-400">Solutions</a>
            <a href="#technology" className="transition hover:text-emerald-400">Technology</a>
            <a href="#about" className="transition hover:text-emerald-400">About</a>
          </div>

          <div className="flex items-center gap-5">
            <a href="/dashboard" className="hidden text-sm font-medium transition hover:text-emerald-400 sm:block">
              Explore Platform
            </a>
           <a
  href="/dashboard"
  className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#04110c] transition hover:bg-emerald-400"
>
  Get Started <span className="ml-2">→</span>
</a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative border-b border-white/[0.08]">
        <div className="mx-auto grid min-h-[570px] max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-2 text-[10px] font-bold tracking-[2px] text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              CARDIOVASCULAR INTELLIGENCE PLATFORM
            </div>

            <h2 className="max-w-2xl text-5xl font-extrabold leading-[1.15] tracking-tight sm:text-6xl">
              Understand Your Heart.
              <span className="mt-2 block text-emerald-400">
                Decode the Data.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400">
              An intelligent platform combining cardiovascular data analytics,
              machine learning and explainable AI to explore patterns in heart
              health data.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="/dashboard"
                className="rounded-xl bg-emerald-500 px-6 py-4 text-sm font-bold text-[#04110c] transition hover:-translate-y-1 hover:bg-emerald-400"
              >
                Explore Platform <span className="ml-2">→</span>
              </a>
              <a
                href="#technology"
                className="rounded-xl border border-white/20 px-6 py-4 text-sm font-semibold text-white transition hover:border-emerald-400 hover:text-emerald-400"
              >
                Discover Technology
              </a>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-2 gap-5 sm:grid-cols-4">
              {['AI Prediction', 'Data Analytics', 'SHAP Insights', '3D Anatomy'].map((item) => (
                <div key={item} className="border-l border-emerald-500/40 pl-3">
                  <span className="text-lg text-emerald-400">✳</span>
                  <p className="mt-2 text-xs font-semibold text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Anatomical Heart */}
          <div className="relative flex min-h-[420px] items-center justify-center">
            <div className="absolute h-[360px] w-[360px] rounded-full border border-emerald-500/15 sm:h-[410px] sm:w-[410px]" />
            <div className="absolute h-[310px] w-[310px] rounded-full border border-dashed border-emerald-500/20 sm:h-[360px] sm:w-[360px]" />
            <div className="absolute h-72 w-72 rounded-full bg-red-700/10 blur-[90px]" />

            <img
              src="/images/heart-hero.png"
              alt="Realistic red anatomical human heart with coronary vessels"
              className="relative z-10 max-h-[400px] w-[80%] object-contain drop-shadow-[0_0_35px_rgba(220,38,38,0.22)]"
            />

            <div className="absolute right-0 top-8 rounded-xl border border-white/10 bg-[#111a17]/90 px-4 py-3 backdrop-blur">
              <p className="text-[9px] tracking-[2px] text-slate-500">PLATFORM</p>
              <p className="mt-1 text-xs font-semibold">AI + Data + 3D</p>
            </div>

            <div className="absolute bottom-5 left-0 rounded-xl border border-emerald-500/20 bg-[#101a16]/90 px-4 py-3 backdrop-blur">
              <p className="text-[9px] tracking-[2px] text-slate-500">VISUALIZATION</p>
              <p className="mt-1 text-xs font-semibold text-emerald-400">
                Human Cardiac Anatomy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="platform" className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-[10px] font-bold tracking-[3px] text-emerald-400">
          EXPLORE THE PLATFORM
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          One platform. Multiple perspectives.
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          Explore cardiovascular data through prediction, analytics,
          explainability and anatomical visualization.
        </p>

        <div id="solutions" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <a
              key={feature.number}
              href={feature.href}
              className="group rounded-2xl border border-white/[0.09] bg-[#101a16] p-6 transition duration-300 hover:-translate-y-2 hover:border-emerald-500/40 hover:bg-[#12221b]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-xl text-emerald-400">
                  {feature.icon}
                </span>
                <span className="text-xs text-slate-600">{feature.number}</span>
              </div>

              <h3 className="mt-7 text-base font-bold">{feature.title}</h3>
              <p className="mt-3 min-h-12 text-xs leading-6 text-slate-400">
                {feature.description}
              </p>
              <span className="mt-5 inline-block text-xs font-semibold text-emerald-400 transition group-hover:translate-x-1">
                Explore →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Technology */}
      <section id="technology" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#102019] to-[#0b1110] p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[10px] font-bold tracking-[3px] text-emerald-400">
              BUILT WITH DATA AND INTELLIGENCE
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-tight">
              From clinical data
              <span className="block text-emerald-400">to model insights.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">
              CardioVision 3D brings together structured clinical data,
              machine learning pipelines and explainability techniques in
              one research and educational platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {technologies.map((technology) => (
              <div
                key={technology}
                className="rounded-xl border border-white/10 bg-black/20 p-5 text-sm font-semibold text-slate-200 transition hover:border-emerald-500/40"
              >
                {technology}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-6 py-8 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 CardioVision 3D. Research & Educational Prototype.</p>
          <p>Not intended for clinical diagnosis.</p>
        </div>
      </footer>
    </main>
  )
}

export default LandingPage