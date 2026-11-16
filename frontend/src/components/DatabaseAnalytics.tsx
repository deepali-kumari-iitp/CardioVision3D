
import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

type DailyTrendItem = {
  date: string
  total: number
  cad: number
  normal: number
}

type AnalyticsResponse = {
  summary: {
    total_predictions: number
    cad_predictions: number
    normal_predictions: number
    cad_percentage: number
    normal_percentage: number
    average_cad_probability: number | null
  }
  daily_trend: DailyTrendItem[]
  period_days: number
}

type ChartPoint = DailyTrendItem & {
  x: number
  y: number
}

function getDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    ...options,
  })
}

function DatabaseAnalytics() {
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [days, setDays] = useState(30)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchAnalytics() {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/analytics?days=${days}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error(`Analytics request failed: ${response.status}`)
        }

        const result: AnalyticsResponse = await response.json()
        setData(result)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load database analytics.'
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchAnalytics()

    return () => controller.abort()
  }, [days])

  const summary = data?.summary

  const cadPercentage = summary?.cad_percentage ?? 0
  const normalPercentage = summary?.normal_percentage ?? 0

  const trend = data?.daily_trend ?? []

  // Fill dates without predictions with zero values.
  // This creates a continuous timeline for the selected period.
  const completeTrend = useMemo(() => {
    const trendMap = new Map(
      trend.map((item) => [item.date.slice(0, 10), item])
    )

    const today = new Date()
    today.setHours(12, 0, 0, 0)

    return Array.from({ length: days }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (days - 1 - index))

      const dateKey = getDateKey(date)
      const existing = trendMap.get(dateKey)

      return (
        existing ?? {
          date: dateKey,
          total: 0,
          cad: 0,
          normal: 0,
        }
      )
    })
  }, [trend, days])

  const activeDays = trend.filter((item) => item.total > 0).length

  // Chart dimensions
  const chartWidth = 700
  const chartHeight = 260
  const chartPadding = 42
  const chartBottom = chartHeight - chartPadding

  const maxCount = Math.max(
    1,
    ...completeTrend.map((item) => item.total)
  )

  const chartPoints: ChartPoint[] = completeTrend.map((item, index) => {
    const x =
      completeTrend.length <= 1
        ? chartWidth / 2
        : chartPadding +
          (index / (completeTrend.length - 1)) *
            (chartWidth - chartPadding * 2)

    const y =
      chartBottom -
      (item.total / maxCount) * (chartBottom - chartPadding)

    return {
      ...item,
      x,
      y,
    }
  })

  const linePoints = chartPoints
    .map((point) => `${point.x},${point.y}`)
    .join(' ')

  // Show a maximum of five readable date labels.
  const labelIndexes = Array.from(
    new Set(
      [0, 1, 2, 3, 4].map((step) =>
        Math.round((step / 4) * (days - 1))
      )
    )
  )

  return (
    <section className="mt-14">
      {/* Section Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold tracking-[3px] text-emerald-400">
            DATABASE INTELLIGENCE
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Global Analytics
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Aggregate statistics across all PostgreSQL prediction records.
          </p>
        </div>

        <label className="flex items-center gap-3 text-xs text-slate-400">
          Trend Period

          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="rounded-lg border border-white/10 bg-[#101a16] px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </label>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-7 rounded-2xl border border-white/[0.08] bg-[#101a16] p-8 text-sm text-slate-400">
          Loading global analytics...
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div
          role="alert"
          className="mt-7 rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300"
        >
          <p className="font-semibold">Analytics unavailable</p>
          <p className="mt-2">{error}</p>
        </div>
      )}

      {/* Analytics Content */}
      {!isLoading && !error && summary && (
        <>
          {/* Global Summary Cards */}
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-white/[0.08] bg-[#101a16] p-6">
              <p className="text-xs text-slate-400">All Predictions</p>
              <h3 className="mt-4 text-3xl font-bold text-emerald-400">
                {summary.total_predictions}
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                Entire database
              </p>
            </article>

            <article className="rounded-2xl border border-white/[0.08] bg-[#101a16] p-6">
              <p className="text-xs text-slate-400">CAD Distribution</p>
              <h3 className="mt-4 text-3xl font-bold text-rose-400">
                {summary.cad_percentage.toFixed(2)}%
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                {summary.cad_predictions} CAD records
              </p>
            </article>

            <article className="rounded-2xl border border-white/[0.08] bg-[#101a16] p-6">
              <p className="text-xs text-slate-400">Normal Distribution</p>
              <h3 className="mt-4 text-3xl font-bold text-sky-400">
                {summary.normal_percentage.toFixed(2)}%
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                {summary.normal_predictions} Normal records
              </p>
            </article>

            <article className="rounded-2xl border border-white/[0.08] bg-[#101a16] p-6">
              <p className="text-xs text-slate-400">
                Average CAD Probability
              </p>
              <h3 className="mt-4 text-3xl font-bold text-emerald-400">
                {summary.average_cad_probability === null
                  ? 'N/A'
                  : `${(summary.average_cad_probability * 100).toFixed(2)}%`}
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                Mean model output across records
              </p>
            </article>
          </div>

          {/* Distribution and Trend */}
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {/* CAD vs Normal Distribution */}
            <article className="rounded-2xl border border-white/[0.08] bg-[#101a16] p-6">
              <p className="text-[10px] font-bold tracking-[2px] text-emerald-400">
                CLASS DISTRIBUTION
              </p>

              <h3 className="mt-3 text-lg font-bold">
                CAD vs Normal
              </h3>

              {summary.total_predictions === 0 ? (
                <p className="mt-10 py-10 text-center text-sm text-slate-500">
                  No prediction records available yet.
                </p>
              ) : (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-10">
                  <div
                    className="relative flex h-44 w-44 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#fb7185 0% ${cadPercentage}%, #38bdf8 ${cadPercentage}% 100%)`,
                    }}
                    role="img"
                    aria-label={`CAD ${cadPercentage} percent, Normal ${normalPercentage} percent`}
                  >
                    <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#101a16]">
                      <span className="text-3xl font-bold text-white">
                        {summary.total_predictions}
                      </span>

                      <span className="mt-1 text-xs text-slate-400">
                        Total Records
                      </span>
                    </div>
                  </div>

                  <div className="min-w-[150px] space-y-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                        <span className="text-sm text-slate-300">CAD</span>
                      </div>

                      <p className="mt-1 text-xl font-bold text-rose-400">
                        {cadPercentage.toFixed(2)}%
                      </p>

                      <p className="text-xs text-slate-500">
                        {summary.cad_predictions} records
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                        <span className="text-sm text-slate-300">
                          Normal
                        </span>
                      </div>

                      <p className="mt-1 text-xl font-bold text-sky-400">
                        {normalPercentage.toFixed(2)}%
                      </p>

                      <p className="text-xs text-slate-500">
                        {summary.normal_predictions} records
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </article>

            {/* Daily Trend */}
            <article className="rounded-2xl border border-white/[0.08] bg-[#101a16] p-6">
              <p className="text-[10px] font-bold tracking-[2px] text-emerald-400">
                PREDICTION ACTIVITY
              </p>

              <h3 className="mt-3 text-lg font-bold">
                Daily Prediction Trend
              </h3>

              <p className="mt-2 text-xs text-slate-500">
                Total predictions over the last {days} days.
              </p>

              {summary.total_predictions === 0 || activeDays === 0 ? (
                <p className="mt-10 py-10 text-center text-sm text-slate-500">
                  No prediction activity in this period.
                </p>
              ) : (
                <div className="mt-7">
                  <div className="overflow-x-auto">
                    <svg
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      className="w-full min-w-[420px]"
                      role="img"
                      aria-label={`Daily prediction trend for the last ${days} days`}
                    >
                      {/* Horizontal grid lines and Y-axis labels */}
                      {[0, 1, 2, 3].map((step) => {
                        const y =
                          chartPadding +
                          (step / 3) * (chartBottom - chartPadding)

                        const value = Math.round(
                          maxCount * (1 - step / 3)
                        )

                        return (
                          <g key={step}>
                            <line
                              x1={chartPadding}
                              y1={y}
                              x2={chartWidth - 15}
                              y2={y}
                              stroke="#26352e"
                              strokeDasharray="4 5"
                            />

                            <text
                              x={chartPadding - 10}
                              y={y + 4}
                              textAnchor="end"
                              fill="#64748b"
                              fontSize="11"
                            >
                              {value}
                            </text>
                          </g>
                        )
                      })}

                      {/* Trend line */}
                      {chartPoints.length > 1 && (
                        <polyline
                          points={linePoints}
                          fill="none"
                          stroke="#42d6a4"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}

                      {/* Daily data points */}
                      {chartPoints.map((point) => (
                        <g key={point.date}>
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r={point.total > 0 ? 5 : 2.5}
                            fill={point.total > 0 ? '#42d6a4' : '#52665b'}
                          >
                            <title>
                              {formatDate(point.date, {
                                year: 'numeric',
                              })}
                              : {point.total} predictions
                              {' | '}CAD: {point.cad}
                              {' | '}Normal: {point.normal}
                            </title>
                          </circle>
                        </g>
                      ))}

                      {/* X-axis date labels */}
                      {labelIndexes.map((index) => {
                        const point = chartPoints[index]
                        if (!point) return null

                        return (
                          <text
                            key={point.date}
                            x={point.x}
                            y={chartHeight - 7}
                            textAnchor="middle"
                            fill="#94a3b8"
                            fontSize="11"
                          >
                            {formatDate(point.date)}
                          </text>
                        )
                      })}
                    </svg>
                  </div>

                  {/* Chart Legend */}
                  <div className="mt-5 flex flex-wrap gap-5 text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Total predictions
                    </span>

                    <span>
                      Active days: {activeDays} / {days}
                    </span>

                    <span>
                      Total in period: {trend.reduce(
                        (total, item) => total + item.total,
                        0
                      )}
                    </span>
                  </div>
                </div>
              )}
            </article>
          </div>

          <p className="mt-5 text-xs leading-6 text-slate-500">
            Analytics reflect stored prediction records and model outputs.
            They are not clinically validated risk estimates or medical diagnoses.
          </p>
        </>
      )}
    </section>
  )
}

export default DatabaseAnalytics
