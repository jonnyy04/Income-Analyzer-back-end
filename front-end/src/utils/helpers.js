export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export const fmt = (n) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)

export const fmtDec = (n) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

/**
 * Calculates daily profit vs previous entry.
 * Only counts positive differences (salary logic).
 */
export function calcDailyProfit(entries, newBalance) {
  if (!entries.length) return 0
  const sorted = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  const prev = sorted[0]
  const diff = newBalance - prev.balance
  return diff > 0 ? diff : 0
}

/**
 * Groups entries by month-year and sums salary (positive profits only).
 */
export function getMonthlyStats(entries) {
  const map = {}
  const sorted = [...entries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  for (const e of sorted) {
    const key = `${e.year}-${String(e.month).padStart(2, '0')}`
    if (!map[key]) {
      map[key] = {
        month: e.month,
        year: e.year,
        salary: 0,
        days: 0,
        label: `${MONTHS[e.month - 1]} ${e.year}`,
      }
    }
    map[key].salary += e.dailyProfit
    if (e.dailyProfit > 0) map[key].days++
  }

  return Object.values(map).sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month
  )
}

export function createEntry(entries, balance) {
  const now = new Date()
  const profit = calcDailyProfit(entries, balance)
  return {
    id: Date.now().toString(),
    date: now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
    timestamp: now.toISOString(),
    balance,
    dailyProfit: profit,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  }
}
