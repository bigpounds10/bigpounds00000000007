import { useEffect, useState } from 'react'
import { fetchTickerData, type TickerCoin } from '../lib/coingecko'
import { formatPercent } from '../lib/format'

export default function TickerTape() {
  const [coins, setCoins] = useState<TickerCoin[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const data = await fetchTickerData()
        if (active) setCoins(data)
      } catch {
        if (active) setError(true)
      }
    }
    load()
    const interval = setInterval(load, 60000)
    return () => { active = false; clearInterval(interval) }
  }, [])

  if (error) {
    return <div className="bg-brand-950 py-2 text-center text-xs text-brand-300">Live market data temporarily unavailable</div>
  }

  if (coins.length === 0) {
    return <div className="bg-brand-950 py-2"><div className="mx-auto max-w-7xl px-4"><div className="h-6 animate-pulse rounded bg-brand-800/50" /></div></div>
  }

  const doubled = [...coins, ...coins]

  return (
    <div className="overflow-hidden bg-brand-950 py-2 border-b border-brand-800/50">
      <div className="flex animate-scroll-x ticker-track">
        {doubled.map((coin, i) => {
          const isPositive = coin.price_change_percentage_24h >= 0
          return (
            <div key={`${coin.id}-${i}`} className="flex items-center gap-2 px-4 text-sm whitespace-nowrap">
              <span className="font-semibold text-white">{coin.symbol.toUpperCase()}USD</span>
              <span className="text-brand-200">${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={isPositive ? 'text-emerald-400' : 'text-red-400'}>{formatPercent(coin.price_change_percentage_24h)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
