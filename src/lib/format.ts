export function formatCurrency(value: number, maxDigits = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '$0.00'
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
  if (value < 1) return `$${value.toFixed(6)}`
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: maxDigits })}`
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
  return value.toLocaleString('en-US')
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatAmount(value: number): string {
  if (value < 0.001) return value.toFixed(8)
  if (value < 1) return value.toFixed(4)
  return value.toLocaleString('en-US', { maximumFractionDigits: 4 })
}
