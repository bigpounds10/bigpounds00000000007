export type Coin = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
  sparkline_in_7d?: { price: number[] }
}

export type TickerCoin = {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
}

const BASE_URL = 'https://api.coingecko.com/api/v3'

export async function fetchTopCoins(limit = 50): Promise<Coin[]> {
  const res = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`
  )
  if (!res.ok) throw new Error(`Failed to fetch coins: ${res.status}`)
  return res.json()
}

export async function fetchTickerData(): Promise<TickerCoin[]> {
  const res = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&price_change_percentage=24h`
  )
  if (!res.ok) throw new Error(`Failed to fetch ticker: ${res.status}`)
  return res.json()
}

export async function fetchGlobalStats(): Promise<{
  data: {
    total_market_cap: { usd: number }
    total_volume: { usd: number }
    market_cap_percentage: { btc: number; eth: number }
    active_cryptocurrencies: number
    markets: number
  }
}> {
  const res = await fetch(`${BASE_URL}/global`)
  if (!res.ok) throw new Error(`Failed to fetch global stats: ${res.status}`)
  return res.json()
}
