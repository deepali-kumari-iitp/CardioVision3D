
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DatabaseAnalytics from "../components/DatabaseAnalytics";

type Prediction = "CAD" | "Normal";

interface HistoryRecord {
  id: number;
  prediction: Prediction;
  probabilities: {
    CAD: number;
    Normal: number;
  };
  created_at: string;
  patient_data?: Record<string, unknown>;
}

interface HistoryResponse {
  total: number;
  page: number;
  limit: number;
  records: HistoryRecord[];
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const PAGE_SIZE = 5;

const modules = [
  {
    title: "Patient Analysis",
    description: "Run an experimental cardiovascular classification.",
    path: "/patient-analysis",
    icon: "⌕",
    number: "01",
  },
  {
    title: "Model Performance",
    description: "Explore evaluation metrics and validation results.",
    path: "/model-performance",
    icon: "◫",
    number: "02",
  },
  {
    title: "Explainable AI",
    description: "Understand which features influence model output.",
    path: "/explainability",
    icon: "✳",
    number: "03",
  },
  {
    title: "3D Heart Explorer",
    description: "Explore the anatomical heart model interactively.",
    path: "/heart-explorer",
    icon: "♡",
    number: "04",
  },
];

const navigation = [
  { label: "Overview", path: "/dashboard", icon: "▦" },
  ...modules.map((item) => ({
    label: item.title,
    path: item.path,
    icon: item.icon,
  })),
];

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatProbability(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);

  const [predictionFilter, setPredictionFilter] = useState("");
  const [searchId, setSearchId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    prediction: "",
    predictionId: "",
    dateFrom: "",
    dateTo: "",
  });

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const totalPages = Math.max(
    1,
    Math.ceil(totalRecords / PAGE_SIZE)
  );

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
      });

      if (appliedFilters.prediction) {
        params.set("prediction", appliedFilters.prediction);
      }

      if (appliedFilters.predictionId) {
        params.set("prediction_id", appliedFilters.predictionId);
      }

      if (appliedFilters.dateFrom) {
        params.set("date_from", appliedFilters.dateFrom);
      }

      if (appliedFilters.dateTo) {
        params.set("date_to", appliedFilters.dateTo);
      }

      const response = await fetch(
        `${API_BASE}/api/v1/history?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`History API returned ${response.status}`);
      }

      const data: HistoryResponse = await response.json();

      setRecords(data.records ?? []);
      setTotalRecords(data.total ?? 0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load prediction history."
      );
      setRecords([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [page, appliedFilters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const applyFilters = () => {
    if (
      dateFrom &&
      dateTo &&
      new Date(dateFrom) > new Date(dateTo)
    ) {
      setError("From Date cannot be later than To Date.");
      return;
    }

    setPage(1);
    setAppliedFilters({
      prediction: predictionFilter,
      predictionId: searchId.trim(),
      dateFrom,
      dateTo,
    });
  };

  const clearFilters = () => {
    setSearchId("");
    setPredictionFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);

    setAppliedFilters({
      prediction: "",
      predictionId: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const exportCSV = async () => {
    setExporting(true);

    try {
      setError("");

      const allRecords: HistoryRecord[] = [];
      const exportLimit = 100;

      const firstParams = new URLSearchParams({
        page: "1",
        limit: String(exportLimit),
      });

      if (appliedFilters.prediction) {
        firstParams.set("prediction", appliedFilters.prediction);
      }

      if (appliedFilters.predictionId) {
        firstParams.set("prediction_id", appliedFilters.predictionId);
      }

      if (appliedFilters.dateFrom) {
        firstParams.set("date_from", appliedFilters.dateFrom);
      }

      if (appliedFilters.dateTo) {
        firstParams.set("date_to", appliedFilters.dateTo);
      }

      const firstResponse = await fetch(
        `${API_BASE}/api/v1/history?${firstParams.toString()}`
      );

      if (!firstResponse.ok) {
        throw new Error("Unable to export prediction history.");
      }

      const firstData: HistoryResponse = await firstResponse.json();

      allRecords.push(...(firstData.records ?? []));

      const pages = Math.ceil(
        (firstData.total ?? 0) / exportLimit
      );

      for (let currentPage = 2; currentPage <= pages; currentPage++) {
        const params = new URLSearchParams(firstParams);
        params.set("page", String(currentPage));

        const response = await fetch(
          `${API_BASE}/api/v1/history?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Unable to retrieve all export records.");
        }

        const data: HistoryResponse = await response.json();
        allRecords.push(...(data.records ?? []));
      }

      const completeRecords = await Promise.all(
        allRecords.map(async (record) => {
          if (record.patient_data) return record;

          const response = await fetch(
            `${API_BASE}/api/v1/history/${record.id}`
          );

          if (!response.ok) {
            throw new Error(
              `Could not retrieve details for prediction #${record.id}.`
            );
          }

          const detail = await response.json();

          return {
            ...record,
            patient_data: detail.patient_data,
          };
        })
      );

      const featureNames = Array.from(
        new Set(
          completeRecords.flatMap((record) =>
            Object.keys(record.patient_data ?? {})
          )
        )
      );

      const headers = [
        "ID",
        "Prediction",
        "CAD Probability",
        "Normal Probability",
        "Created At",
        ...featureNames,
      ];

      const escapeCSV = (value: unknown) => {
        const text = String(value ?? "");
        return `"${text.replace(/"/g, '""')}"`;
      };

      const rows = completeRecords.map((record) => [
        record.id,
        record.prediction,
        record.probabilities.CAD,
        record.probabilities.Normal,
        record.created_at,
        ...featureNames.map(
          (feature) => record.patient_data?.[feature] ?? ""
        ),
      ]);

      const csv = [
        headers.map(escapeCSV).join(","),
        ...rows.map((row) => row.map(escapeCSV).join(",")),
      ].join("\r\n");

      const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = `cardiovision-predictions-${Date.now()}.csv`;
      anchor.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "CSV export failed."
      );
    } finally {
      setExporting(false);
    }
  };

  const currentRange = useMemo(() => {
    if (totalRecords === 0) return "0 records";

    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, totalRecords);

    return `${start}–${end} of ${totalRecords}`;
  }, [page, totalRecords]);

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-white/[0.07] px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/[0.08] text-xl text-emerald-400">
          ♡
        </div>

        {sidebarOpen && (
          <div className="min-w-0">
            <h2 className="whitespace-nowrap text-sm font-bold">
              CardioVision <span className="text-emerald-400">3D</span>
            </h2>
            <p className="mt-1 text-[8px] tracking-[2px] text-slate-500">
              CARDIAC INTELLIGENCE
            </p>
          </div>
        )}

        <button
          onClick={closeMobileSidebar}
          className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] lg:hidden"
          aria-label="Close navigation"
        >
          ✕
        </button>
      </div>

      <div className="px-3 pt-7">
        {sidebarOpen && (
          <p className="mb-4 px-3 text-[9px] font-bold tracking-[2px] text-slate-600">
            WORKSPACE
          </p>
        )}

        <nav className="space-y-2">
          {navigation.map((item) => {
            const active = item.path === "/dashboard";

            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                onClick={closeMobileSidebar}
                className={`cv-nav-item flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${
                  active
                    ? "border border-emerald-400/20 bg-emerald-400/[0.09] text-emerald-300"
                    : "border border-transparent text-slate-400 hover:border-emerald-400/10"
                } ${!sidebarOpen ? "justify-center" : ""}`}
              >
                <span className="w-5 shrink-0 text-center text-lg">
                  {item.icon}
                </span>

                {sidebarOpen && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-3">
        {sidebarOpen && (
          <div className="cv-glass mb-3 rounded-xl p-4">
            <p className="text-[9px] font-bold tracking-[1.5px] text-emerald-400">
              RESEARCH MODE
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Cardiovascular intelligence workspace
            </p>

            <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Research interface
            </div>
          </div>
        )}

        <button
          onClick={() => setSidebarOpen((value) => !value)}
          className="hidden w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] px-3 py-3 text-sm text-slate-400 transition hover:border-emerald-400/30 hover:text-white lg:flex"
          title={sidebarOpen ? "Collapse menu" : "Expand menu"}
        >
          <span>{sidebarOpen ? "⇤" : "⇥"}</span>
          {sidebarOpen && "Collapse menu"}
        </button>
      </div>
    </>
  );

  return (
    <div className="cv-dashboard min-h-screen text-white">
      <style>{`
        @keyframes cv-glow {
          0%, 100% {
            opacity: .25;
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            opacity: .55;
            transform: translate3d(0, -12px, 0) scale(1.08);
          }
        }

        @keyframes cv-ecg {
          from { stroke-dashoffset: 700; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes cv-enter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cv-dashboard {
          background:
            radial-gradient(ellipse at 75% 5%, rgba(16, 185, 129, .075), transparent 34%),
            radial-gradient(ellipse at 0% 55%, rgba(5, 150, 105, .045), transparent 30%),
            #070b0a;
        }

        .cv-glass {
          background: linear-gradient(
            145deg,
            rgba(20, 34, 29, .78),
            rgba(11, 19, 16, .78)
          );
          border: 1px solid rgba(167, 243, 208, .09);
          box-shadow: 0 15px 45px rgba(0, 0, 0, .2);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .cv-card {
          transition:
            transform .25s ease,
            border-color .25s ease,
            box-shadow .25s ease;
          animation: cv-enter .45s ease both;
        }

        .cv-card:hover {
          transform: translateY(-4px);
          border-color: rgba(52, 211, 153, .28);
          box-shadow: 0 14px 40px rgba(16, 185, 129, .07);
        }

        .cv-ecg-line {
          stroke-dasharray: 700;
          animation: cv-ecg 5s linear infinite;
        }

        .cv-nav-item {
          transition:
            background .2s ease,
            color .2s ease,
            border-color .2s ease;
        }

        .cv-nav-item:hover {
          background: rgba(16, 185, 129, .07);
          color: #6ee7b7;
        }

        .cv-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        .cv-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(110, 231, 183, .22);
          border-radius: 10px;
        }

        .cv-input {
          width: 100%;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 12px;
          background: rgba(0,0,0,.25);
          padding: 12px 14px;
          color: #e2e8f0;
          font-size: 12px;
          outline: none;
          transition: border-color .2s ease, box-shadow .2s ease;
          color-scheme: dark;
        }

        .cv-input:focus {
          border-color: rgba(52, 211, 153, .5);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, .07);
        }

        .cv-input::placeholder {
          color: #64748b;
        }

        @media (prefers-reduced-motion: reduce) {
          .cv-card,
          .cv-ecg-line,
          .cv-nav-item {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside
          className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/[0.07] bg-[#0b1210]/90 backdrop-blur-2xl transition-all duration-300 lg:flex ${
            sidebarOpen ? "w-[230px]" : "w-[76px]"
          }`}
        >
          {sidebarContent}
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <button
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={closeMobileSidebar}
            aria-label="Close navigation overlay"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-emerald-400/10 bg-[#0a100e]/95 backdrop-blur-2xl transition-transform duration-300 lg:hidden ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>

        {/* Main workspace */}
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-white/[0.07] bg-[#080d0b]/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-lg text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300 lg:hidden"
                aria-label="Open navigation"
              >
                ☰
              </button>

              <button
                onClick={() => setSidebarOpen((value) => !value)}
                className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-lg text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300 lg:flex"
                aria-label="Toggle sidebar"
              >
                ☰
              </button>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  Research workspace
                </p>
                <p className="mt-1 hidden text-[10px] text-slate-500 sm:block">
                  Cardiovascular data intelligence
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-2 text-[10px] text-emerald-300 sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Research environment
              </span>

              <Link
                to="/"
                className="text-xs text-slate-400 transition hover:text-emerald-300"
              >
                Back to Home ↗
              </Link>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-12">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl border border-emerald-400/[0.13] bg-gradient-to-br from-[#10221a] via-[#0c1511] to-[#090d0b] px-6 py-9 sm:px-9 md:py-12 lg:px-12 lg:py-14">
              <div
                className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-emerald-400/[0.09] blur-[100px]"
                style={{ animation: "cv-glow 7s ease-in-out infinite" }}
              />

              <div className="pointer-events-none absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-green-500/[0.07] blur-[100px]" />

              <div className="relative z-10 max-w-2xl">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-7 bg-emerald-400" />
                  <p className="text-[9px] font-bold tracking-[2.5px] text-emerald-400 sm:text-[10px] sm:tracking-[3px]">
                    CARDIOVASCULAR RESEARCH PLATFORM
                  </p>
                </div>

                <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Understand the heart.
                  <br />
                  <span className="bg-gradient-to-r from-emerald-300 via-green-400 to-teal-300 bg-clip-text text-transparent">
                    Decode the data.
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-xs leading-7 text-slate-400 sm:text-sm">
                  An intelligent cardiovascular research workspace combining
                  machine learning, clinical dataset analysis and interactive
                  cardiac visualization.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/patient-analysis"
                    className="rounded-xl bg-emerald-400 px-5 py-3.5 text-xs font-bold text-[#06130d] shadow-lg shadow-emerald-500/10 transition hover:-translate-y-1 hover:bg-emerald-300 sm:px-6 sm:text-sm"
                  >
                    Start Patient Analysis ↗
                  </Link>

                  <Link
                    to="/heart-explorer"
                    className="rounded-xl border border-white/15 bg-white/[0.035] px-5 py-3.5 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.07] sm:px-6 sm:text-sm"
                  >
                    Explore 3D Heart ♡
                  </Link>
                </div>

                <div className="mt-7 flex flex-wrap gap-5 text-[10px] text-slate-500">
                  <span>● Machine Learning</span>
                  <span className="text-emerald-400">● Explainable AI</span>
                  <span className="text-teal-400">● 3D Visualization</span>
                </div>
              </div>

              {/* Decorative ECG illustration, not patient data */}
              <div className="pointer-events-none absolute bottom-10 right-7 hidden w-[35%] opacity-60 lg:block">
                <svg viewBox="0 0 500 130" className="w-full">
                  <defs>
                    <linearGradient id="cvEcgGradient">
                      <stop stopColor="#34d399" />
                      <stop offset="1" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M0 67 H100 L120 67 L137 43 L155 92 L178 12 L202 110 L222 67 H295 L315 67 L330 50 L348 82 L365 25 L386 100 L405 67 H500"
                    fill="none"
                    stroke="url(#cvEcgGradient)"
                    strokeWidth="2"
                    className="cv-ecg-line"
                  />
                </svg>

                <p className="mt-2 text-right text-[9px] text-slate-600">
                  Decorative ECG illustration · Not patient monitoring
                </p>
              </div>
            </section>

            {/* Research snapshot */}
            <section>
              <div className="mb-6">
                <p className="text-[9px] font-bold tracking-[3px] text-emerald-400">
                  RESEARCH SNAPSHOT
                </p>

                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  Your project at a glance
                </h2>

                <p className="mt-2 text-xs text-slate-500">
                  Verified dataset and model evaluation figures.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "Dataset records",
                    value: "303",
                    detail: "UCI research dataset",
                    icon: "▦",
                  },
                  {
                    label: "Model features",
                    value: "54",
                    detail: "Validated input features",
                    icon: "⌘",
                  },
                  {
                    label: "Holdout accuracy",
                    value: "83.61%",
                    detail: "Random Forest · test set",
                    icon: "◇",
                  },
                  {
                    label: "Evaluated models",
                    value: "02",
                    detail: "Logistic Regression + Random Forest",
                    icon: "⌁",
                  },
                ].map((metric, index) => (
                  <article
                    key={metric.label}
                    className="cv-glass cv-card relative overflow-hidden rounded-2xl p-5"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs text-slate-400">
                        {metric.label}
                      </p>

                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-lg text-emerald-300">
                        {metric.icon}
                      </span>
                    </div>

                    <p className="mt-4 text-3xl font-extrabold tracking-tight">
                      {metric.value}
                    </p>

                    <p className="mt-2 text-[10px] text-slate-500">
                      {metric.detail}
                    </p>

                    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-emerald-400/80 via-green-500/30 to-transparent" />

                    <span className="absolute bottom-3 right-4 text-[9px] text-slate-700">
                      0{index + 1}
                    </span>
                  </article>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-400/[0.10] bg-emerald-400/[0.025] px-4 py-3 text-xs text-slate-400">
                <span className="text-emerald-400">●</span>
                Leakage-safe 5-fold cross-validation mean:
                <strong className="text-emerald-300">88.88%</strong>
                <span className="text-slate-500">
                  Standard deviation: 3.72 percentage points
                </span>
              </div>
            </section>

            {/* Real database analytics */}
            <section>
              <div className="mb-6">
                <p className="text-[9px] font-bold tracking-[3px] text-emerald-400">
                  DATABASE INTELLIGENCE
                </p>

                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  Global Analytics
                </h2>

                <p className="mt-2 text-xs text-slate-500">
                  Aggregate statistics from actual PostgreSQL prediction records.
                </p>
              </div>

              <DatabaseAnalytics />
            </section>

            {/* Workspace modules */}
            <section>
              <div className="mb-6">
                <p className="text-[9px] font-bold tracking-[3px] text-emerald-400">
                  WORKSPACE MODULES
                </p>

                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  Continue your research
                </h2>

                <p className="mt-2 text-xs text-slate-500">
                  Open an existing CardioVision 3D module.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {modules.map((module, index) => (
                  <Link
                    key={module.path}
                    to={module.path}
                    className="cv-glass cv-card group rounded-2xl p-5"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-xl text-emerald-300 transition group-hover:bg-emerald-400/[0.15]">
                        {module.icon}
                      </span>

                      <span className="text-xs text-slate-600">
                        {module.number}
                      </span>
                    </div>

                    <h3 className="mt-6 text-base font-bold transition group-hover:text-emerald-300">
                      {module.title}
                    </h3>

                    <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">
                      {module.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4 text-xs">
                      <span className="text-slate-400">Open module</span>

                      <span className="text-emerald-400 transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Prediction history */}
            <section>
              <div className="mb-6">
                <p className="text-[9px] font-bold tracking-[3px] text-emerald-400">
                  DATABASE RECORDS
                </p>

                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  Prediction History
                </h2>

                <p className="mt-2 text-xs text-slate-500">
                  Search, filter and inspect prediction records stored in PostgreSQL.
                </p>
              </div>

              <div className="cv-glass rounded-2xl p-4 sm:p-5 md:p-6">
                {/* Filters */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <label className="block">
                    <span className="mb-2 block text-[11px] text-slate-400">
                      Search by Prediction ID
                    </span>

                    <input
                      type="number"
                      min="1"
                      value={searchId}
                      onChange={(event) => setSearchId(event.target.value)}
                      placeholder="Enter record ID"
                      className="cv-input"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] text-slate-400">
                      Prediction Type
                    </span>

                    <select
                      value={predictionFilter}
                      onChange={(event) =>
                        setPredictionFilter(event.target.value)
                      }
                      className="cv-input"
                    >
                      <option value="">All Predictions</option>
                      <option value="CAD">CAD</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] text-slate-400">
                      From Date
                    </span>

                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(event) => setDateFrom(event.target.value)}
                      className="cv-input"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] text-slate-400">
                      To Date
                    </span>

                    <input
                      type="date"
                      value={dateTo}
                      onChange={(event) => setDateTo(event.target.value)}
                      className="cv-input"
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={applyFilters}
                    className="rounded-xl bg-emerald-400 px-5 py-3 text-xs font-bold text-[#06130d] transition hover:bg-emerald-300"
                  >
                    Apply Filters
                  </button>

                  <button
                    onClick={clearFilters}
                    className="rounded-xl border border-white/10 px-5 py-3 text-xs text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300"
                  >
                    Clear Filters
                  </button>

                  <button
                    onClick={fetchHistory}
                    className="rounded-xl border border-white/10 px-5 py-3 text-xs text-slate-300 transition hover:border-emerald-400/30 hover:text-emerald-300"
                  >
                    ↻ Refresh
                  </button>
                </div>

                {error && (
                  <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-xs text-red-300">
                    {error}
                  </div>
                )}

                {/* Responsive table */}
                <div className="cv-scrollbar mt-6 overflow-x-auto rounded-xl border border-white/[0.07]">
                  <table className="w-full min-w-[680px] text-left text-xs">
                    <thead className="bg-white/[0.035] text-slate-400">
                      <tr>
                        <th className="px-5 py-4 font-medium">ID</th>
                        <th className="px-5 py-4 font-medium">Prediction</th>
                        <th className="px-5 py-4 font-medium">CAD Probability</th>
                        <th className="px-5 py-4 font-medium">Normal Probability</th>
                        <th className="px-5 py-4 font-medium">Date</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/[0.06]">
                      {loading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-5 py-12 text-center text-slate-500"
                          >
                            Loading prediction records...
                          </td>
                        </tr>
                      ) : records.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-5 py-12 text-center text-slate-500"
                          >
                            No matching prediction records found.
                          </td>
                        </tr>
                      ) : (
                        records.map((record) => (
                          <tr
                            key={record.id}
                            className="transition hover:bg-emerald-400/[0.025]"
                          >
                            <td className="px-5 py-4">
                              <Link
                                to={`/history/${record.id}`}
                                className="font-semibold text-emerald-300 hover:text-emerald-200"
                              >
                                #{record.id} →
                              </Link>
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                                  record.prediction === "CAD"
                                    ? "bg-emerald-400/10 text-emerald-300"
                                    : "bg-slate-400/10 text-slate-300"
                                }`}
                              >
                                {record.prediction}
                              </span>
                            </td>

                            <td className="px-5 py-4 font-semibold text-emerald-300">
                              {formatProbability(record.probabilities.CAD)}
                            </td>

                            <td className="px-5 py-4 font-semibold text-teal-300">
                              {formatProbability(record.probabilities.Normal)}
                            </td>

                            <td className="px-5 py-4 text-slate-400">
                              {formatDate(record.created_at)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination and export */}
                <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <button
                      onClick={exportCSV}
                      disabled={totalRecords === 0 || exporting}
                      className="rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] px-4 py-3 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {exporting ? "Preparing CSV..." : "↓ Export CSV"}
                    </button>

                    <p className="mt-2 text-[10px] text-slate-600">
                      Exports matching records with patient input features.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-slate-500">
                      {currentRange} · Page {page} of {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setPage((value) => Math.max(1, value - 1))
                      }
                      disabled={page <= 1 || loading}
                      className="rounded-lg border border-white/10 px-4 py-2 text-xs text-slate-300 transition hover:border-emerald-400/30 disabled:opacity-30"
                    >
                      ← Previous
                    </button>

                    <button
                      onClick={() =>
                        setPage((value) =>
                          Math.min(totalPages, value + 1)
                        )
                      }
                      disabled={page >= totalPages || loading}
                      className="rounded-lg border border-white/10 px-4 py-2 text-xs text-slate-300 transition hover:border-emerald-400/30 disabled:opacity-30"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/[0.08] py-7">
              <div className="flex flex-col justify-between gap-3 text-[10px] text-slate-600 sm:flex-row">
                <p>
                  © {new Date().getFullYear()} CardioVision 3D ·
                  Cardiovascular Research Platform
                </p>

                <p>
                  Educational and research prototype · Not a clinical
                  diagnostic system
                </p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
