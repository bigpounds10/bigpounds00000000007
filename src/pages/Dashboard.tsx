import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp, Wallet, Plus, Trash2, LogOut, Bell, PieChart as PieIcon, BarChart3, CircleAlert as AlertCircle, X, Search, Loader as Loader2 } from 'lucide-react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { supabase, type Holding } from '../lib/supabase'
import { fetchTopCoins, type Coin } from '../lib/coingecko'
import { formatCurrency, formatPercent, formatAmount } from '../lib/format'

const COLORS = ['#0a6eff', '#00d4ff', '#7fff00', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1']

type HoldingWithPrice = Holding & {
  current_price: number
  value: number
  cost: number
  pnl: number
  pnl_pct: number
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null)
  const [amount, setAmount] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadHoldings = useCallback(async () => {
    const { data, error } = await supabase.from('holdings').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setHoldings(data || [])
  }, [])

  const loadCoins = useCallback(async () => {
    try { const data = await fetchTopCoins(100); setCoins(data) } catch { /* rate-limited */ }
  }, [])

  useEffect(() => {
    Promise.all([loadHoldings(), loadCoins()]).then(() => setLoading(false))
  }, [loadHoldings, loadCoins])

  const prices: Record<string, number> = {}
  coins.forEach((c) => { prices[c.id] = c.current_price })

  const holdingsWithPrices: HoldingWithPrice[] = holdings.map((h) => {
    const p = prices[h.coin_id] ?? h.avg_buy_price_usd
    const value = h.amount * p
    const cost = h.amount * h.avg_buy_price_usd
    const pnl = value - cost
    const pnl_pct = cost > 0 ? (pnl / cost) * 100 : 0
    return { ...h, current_price: p, value, cost, pnl, pnl_pct }
  })

  const totalValue = holdingsWithPrices.reduce((s, h) => s + h.value, 0)
  const totalCost = holdingsWithPrices.reduce((s, h) => s + h.cost, 0)
  const totalPnl = totalValue - totalCost
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0

  const pieData = holdingsWithPrices.filter((h) => h.value > 0).map((h) => ({ name: h.symbol.toUpperCase(), value: h.value })).sort((a, b) => b.value - a.value)

  const handleAdd = async () => {
    if (!selectedCoin || !amount || !buyPrice) return
    setAdding(true)
    setError(null)
    const { error } = await supabase.from('holdings').insert({
      coin_id: selectedCoin.id, symbol: selectedCoin.symbol, name: selectedCoin.name,
      amount: parseFloat(amount), avg_buy_price_usd: parseFloat(buyPrice),
    })
    setAdding(false)
    if (error) setError(error.message)
    else { setShowAddModal(false); setSelectedCoin(null); setAmount(''); setBuyPrice(''); loadHoldings() }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('holdings').delete().eq('id', id)
    if (!error) loadHoldings()
  }

  const handleSignOut = async () => { await signOut(); navigate('/') }

  const filteredCoins = coins.filter((c) => {
    const q = searchQuery.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
  })

  const sparklineData = holdingsWithPrices.length > 0
    ? Array.from({ length: 30 }, (_, i) => ({ day: i + 1, value: totalCost * (1 + (totalPnlPct / 100) * (i / 30)) }))
    : []

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-brand-950"><Loader2 className="h-8 w-8 animate-spin text-brand-400" /></div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700"><TrendingUp className="h-5 w-5 text-white" /></div>
              <span className="text-lg font-bold text-brand-900">CryptoTracker</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-slate-600">Welcome, <span className="font-semibold text-brand-900">{user?.email}</span></span>
              <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"><Bell className="h-5 w-5 text-slate-600" /><span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" /></button>
              <button onClick={handleSignOut} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign Out</span></button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-slate-500">Total Portfolio Value</span><Wallet className="h-5 w-5 text-brand-500" /></div>
            <p className="text-2xl font-bold text-brand-900">{formatCurrency(totalValue)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-slate-500">Total P/L</span><TrendingUp className="h-5 w-5 text-brand-500" /></div>
            <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(totalPnl)}</p>
            <p className={`text-sm ${totalPnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatPercent(totalPnlPct)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-slate-500">Active Holdings</span><PieIcon className="h-5 w-5 text-brand-500" /></div>
            <p className="text-2xl font-bold text-brand-900">{holdings.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-slate-500">Cost Basis</span><BarChart3 className="h-5 w-5 text-brand-500" /></div>
            <p className="text-2xl font-bold text-brand-900">{formatCurrency(totalCost)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-brand-900 mb-4">Portfolio Performance</h3>
            {sparklineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={sparklineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                  <Tooltip formatter={(v) => [formatCurrency(Number(v)), 'Value']} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="value" stroke="#0a6eff" strokeWidth={2} dot={false} name="Portfolio Value" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-slate-400 text-sm">Add holdings to see your portfolio performance</div>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-brand-900 mb-4">Allocation</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-slate-400 text-sm">No holdings to display</div>
            )}
          </div>
        </div>

        {/* Holdings Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <h3 className="text-lg font-bold text-brand-900">Your Holdings</h3>
            <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-all"><Plus className="h-4 w-4" />Add Holding</button>
          </div>
          {error && (
            <div className="m-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3"><AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" /><p className="text-sm text-red-700">{error}</p></div>
          )}
          {holdingsWithPrices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Wallet className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium mb-1">No holdings yet</p>
              <p className="text-sm text-slate-400 mb-4">Add your first cryptocurrency holding to start tracking</p>
              <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-all"><Plus className="h-4 w-4" />Add Your First Holding</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Asset</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Avg Buy Price</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Current Price</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Value</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">P/L</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holdingsWithPrices.map((h) => (
                    <tr key={h.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{h.symbol.slice(0, 2).toUpperCase()}</div>
                          <div><p className="text-sm font-semibold text-brand-900">{h.name}</p><p className="text-xs text-slate-500">{h.symbol.toUpperCase()}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-slate-700">{formatAmount(h.amount)}</td>
                      <td className="px-6 py-4 text-right text-sm text-slate-700">{formatCurrency(h.avg_buy_price_usd)}</td>
                      <td className="px-6 py-4 text-right text-sm text-slate-700">{formatCurrency(h.current_price)}</td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-brand-900">{formatCurrency(h.value)}</td>
                      <td className={`px-6 py-4 text-right text-sm font-semibold ${h.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(h.pnl)}<span className="block text-xs">{formatPercent(h.pnl_pct)}</span></td>
                      <td className="px-6 py-4 text-center"><button onClick={() => handleDelete(h.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Risk Reminder */}
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800"><strong>Reminder:</strong> CryptoTracker is a portfolio tracking tool. We do not execute trades, custody your assets, or provide investment advice. Prices are sourced from CoinGecko and may differ slightly from exchange rates. Always do your own research.</p>
          </div>
        </div>
      </div>

      {/* Add Holding Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h3 className="text-lg font-bold text-brand-900">Add Holding</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-slate-100 transition-colors"><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3"><AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" /><p className="text-sm text-red-700">{error}</p></div>}
              {!selectedCoin ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Search for a cryptocurrency</label>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Bitcoin, Ethereum, Solana..." className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" autoFocus />
                  </div>
                  <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200">
                    {filteredCoins.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-400">{coins.length === 0 ? 'Loading coins...' : 'No coins found'}</div>
                    ) : (
                      filteredCoins.slice(0, 50).map((coin) => (
                        <button key={coin.id} onClick={() => { setSelectedCoin(coin); setBuyPrice(coin.current_price.toString()) }} className="flex w-full items-center gap-3 border-b border-slate-100 p-3 last:border-0 hover:bg-slate-50 transition-colors text-left">
                          <img src={coin.image} alt="" className="h-7 w-7 rounded-full" />
                          <div className="flex-1"><p className="text-sm font-semibold text-brand-900">{coin.name}</p><p className="text-xs text-slate-500">{coin.symbol.toUpperCase()}</p></div>
                          <span className="text-sm text-slate-600">{formatCurrency(coin.current_price)}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                    <img src={selectedCoin.image} alt="" className="h-10 w-10 rounded-full" />
                    <div className="flex-1"><p className="font-semibold text-brand-900">{selectedCoin.name}</p><p className="text-sm text-slate-500">{selectedCoin.symbol.toUpperCase()} · {formatCurrency(selectedCoin.current_price)}</p></div>
                    <button onClick={() => setSelectedCoin(null)} className="text-sm text-brand-600 hover:text-brand-700 font-medium">Change</button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount Owned</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" step="any" min="0" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Average Buy Price (USD)</label>
                    <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder="0.00" step="any" min="0" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" />
                  </div>
                  {amount && buyPrice && (
                    <div className="rounded-lg bg-brand-50 p-3 text-sm">
                      <div className="flex justify-between text-slate-600"><span>Current Value:</span><span className="font-semibold text-brand-900">{formatCurrency(parseFloat(amount) * selectedCoin.current_price)}</span></div>
                      <div className="flex justify-between text-slate-600 mt-1"><span>Cost Basis:</span><span className="font-semibold text-brand-900">{formatCurrency(parseFloat(amount) * parseFloat(buyPrice))}</span></div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {selectedCoin && (
              <div className="flex gap-3 border-t border-slate-200 p-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">Cancel</button>
                <button onClick={handleAdd} disabled={adding || !amount || !buyPrice} className="flex-1 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">{adding ? 'Adding...' : 'Add Holding'}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
