import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  TrendingUp, Shield, BarChart3, Wallet, ArrowRight, Check, AlertTriangle,
  Clock, Globe, BookOpen, Users,
} from 'lucide-react'
import { fetchTopCoins, fetchGlobalStats, type Coin } from '../lib/coingecko'
import { formatCurrency, formatNumber, formatPercent } from '../lib/format'
import TickerTape from '../components/TickerTape'
import Navbar from '../components/Navbar'

const heroSlides = [
  {
    badge: 'Real-time market data',
    title: 'Track your crypto portfolio with confidence',
    subtitle: 'Live prices from CoinGecko. Real holdings, real value. No fake promises, no guaranteed returns — just honest tracking.',
    cta: 'Start Tracking Free',
    image: 'https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    badge: 'Data-driven insights',
    title: 'See your gains and losses at a glance',
    subtitle: 'Visualize your portfolio allocation, track performance over time, and make informed decisions with real market data.',
    cta: 'View Dashboard',
    image: 'https://images.pexels.com/photos/8437000/pexels-photo-8437000.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    badge: 'Secure & private',
    title: 'Your data stays yours',
    subtitle: 'Bank-grade encryption, secure authentication, and your holdings are visible only to you. No deposits, no custody — just tracking.',
    cta: 'Create Account',
    image: 'https://images.pexels.com/photos/6801649/pexels-photo-6801649.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
]

const features = [
  { icon: Clock, title: '24/7 Live Prices', desc: 'Real-time crypto prices updated every minute from CoinGecko.' },
  { icon: Shield, title: 'Strong Security', desc: 'Encrypted authentication. Your holdings are private to your account.' },
  { icon: BarChart3, title: 'Portfolio Analytics', desc: 'Allocation charts, profit/loss tracking, and performance over time.' },
  { icon: TrendingUp, title: 'Market Overview', desc: 'Top 50 coins by market cap with 24h change and volume data.' },
  { icon: Globe, title: 'Global Market Stats', desc: 'Total market cap, BTC dominance, and active cryptocurrency count.' },
  { icon: Wallet, title: 'Multi-Asset Tracking', desc: 'Add any coin from CoinGecko\'s database of 10,000+ cryptocurrencies.' },
  { icon: BookOpen, title: 'Educational Resources', desc: 'Learn about risk management and why "guaranteed returns" are a red flag.' },
  { icon: Users, title: 'No Fake Promises', desc: 'We show real data. No guaranteed returns, no impersonation, no scams.' },
]

const plans = [
  {
    name: 'Free', price: '$0', period: 'forever',
    features: ['Track up to 10 holdings', 'Real-time market data', 'Portfolio allocation chart', '24h price changes', 'Basic analytics'],
    cta: 'Start Free', highlighted: false,
  },
  {
    name: 'Pro', price: '$9', period: '/month',
    features: ['Unlimited holdings', 'Advanced portfolio analytics', '7-day & 30-day performance', 'Price alerts', 'Export to CSV', 'Priority support'],
    cta: 'Start Pro Trial', highlighted: true,
  },
  {
    name: 'Team', price: '$29', period: '/month',
    features: ['Everything in Pro', 'Shared portfolios', 'Up to 5 team members', 'Custom dashboards', 'API access', 'Dedicated support'],
    cta: 'Contact Us', highlighted: false,
  },
]

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [coins, setCoins] = useState<Coin[]>([])
  const [global, setGlobal] = useState<{ total_market_cap: { usd: number }; total_volume: { usd: number }; active_cryptocurrencies: number; market_cap_percentage: { btc: number; eth: number } } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((s) => (s + 1) % heroSlides.length), 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const [coinData, globalData] = await Promise.all([fetchTopCoins(50), fetchGlobalStats()])
        if (active) { setCoins(coinData); setGlobal(globalData.data); setLoading(false) }
      } catch { if (active) setLoading(false) }
    }
    load()
  }, [])

  const slide = heroSlides[currentSlide]

  return (
    <div className="min-h-screen bg-white">
      <TickerTape />
      <Navbar />

      {/* Hero Slider */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800">
        <div className="absolute inset-0">
          <img src={slide.image} alt="" className="h-full w-full object-cover opacity-20 transition-opacity duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div key={currentSlide} className="animate-fade-in">
              <span className="inline-block rounded-full bg-brand-500/20 px-4 py-1.5 text-sm font-semibold text-brand-300 mb-4">{slide.badge}</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">{slide.title}</h1>
              <p className="text-lg text-brand-200 mb-8 leading-relaxed">{slide.subtitle}</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-400 transition-all hover:shadow-brand-500/30">
                  {slide.cta} <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="#market" className="inline-flex items-center gap-2 rounded-lg border border-brand-700 px-6 py-3 text-base font-semibold text-white hover:bg-brand-800 transition-all">View Live Market</a>
              </div>
            </div>
          </div>
          <div className="mt-12 flex gap-2">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-brand-400' : 'w-2 bg-brand-700'}`} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Global Stats Bar */}
      {global && (
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div><p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Market Cap</p><p className="text-xl font-bold text-brand-900">{formatCurrency(global.total_market_cap.usd)}</p></div>
              <div><p className="text-xs font-medium text-slate-500 uppercase tracking-wide">24h Volume</p><p className="text-xl font-bold text-brand-900">{formatCurrency(global.total_volume.usd)}</p></div>
              <div><p className="text-xs font-medium text-slate-500 uppercase tracking-wide">BTC Dominance</p><p className="text-xl font-bold text-brand-900">{global.market_cap_percentage.btc.toFixed(1)}%</p></div>
              <div><p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active Coins</p><p className="text-xl font-bold text-brand-900">{formatNumber(global.active_cryptocurrencies)}</p></div>
            </div>
          </div>
        </section>
      )}

      {/* Intro Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-900 uppercase mb-6">Track your investments the smart way</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            When you leave your money untracked, you lose sight of performance. CryptoTracker helps you monitor
            your real holdings with live market data from CoinGecko. No more spreadsheets, no more guessing —
            just clear, honest portfolio tracking. We don't promise returns. We don't take your deposits.
            We show you the real numbers so you can make informed decisions.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative overflow-hidden bg-brand-950 py-20">
        <svg className="absolute top-0 left-0 w-full" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none"><path d="M0 80L1440 80L1440 20Q720 0 0 20Z" fill="white" /></svg>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none"><path d="M0 0L1440 0L1440 60Q720 80 0 60Z" fill="white" /></svg>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">It's easy to get started</h2>
            <p className="text-brand-300">Three simple steps to start tracking your portfolio</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {[
              { emoji: '👤', step: '1', title: 'Register', desc: 'Create your free account in seconds' },
              { emoji: '💰', step: '2', title: 'Add Holdings', desc: 'Enter the coins and amounts you own' },
              { emoji: '📈', step: '3', title: 'Start Tracking', desc: 'See live value and performance' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-lime-400/10 border-2 border-lime-400/30 mb-4 text-3xl">{item.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-brand-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-xl text-white font-semibold mb-4">Start tracking now!</p>
            <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-8 py-3 text-base font-bold text-white shadow-lg hover:bg-red-700 transition-all hover:scale-105">REGISTER {">>"}</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-900 mb-4">Why CryptoTracker</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">We have extensive experience in the field of cryptocurrency tracking, market data, and portfolio analytics.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="group rounded-xl border border-slate-200 p-6 hover:border-brand-300 hover:shadow-lg transition-all">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-900 text-white group-hover:bg-brand-600 transition-colors"><feature.icon className="h-6 w-6" /></div>
                <h3 className="text-lg font-bold text-brand-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-900 mb-4">Pricing Plans</h2>
            <p className="text-slate-600">Simple, honest pricing. No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl border-2 p-8 bg-white ${plan.highlighted ? 'border-brand-500 shadow-xl md:scale-105' : 'border-slate-200'}`}>
                {plan.highlighted && <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-xs font-bold text-brand-950">Most Popular</span>}
                <h3 className="text-xl font-bold text-brand-900 mb-2">{plan.name}</h3>
                <div className="mb-6"><span className="text-4xl font-bold text-brand-900">{plan.price}</span><span className="text-slate-500"> {plan.period}</span></div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2"><Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" /><span className="text-sm text-slate-700">{f}</span></li>
                  ))}
                </ul>
                <Link to="/register" className={`block rounded-lg py-3 text-center text-sm font-bold transition-all ${plan.highlighted ? 'bg-brand-600 text-white hover:bg-brand-700' : 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50'}`}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative overflow-hidden bg-brand-950 py-20">
        <div className="absolute inset-0 opacity-10"><img src="https://images.pexels.com/photos/8437000/pexels-photo-8437000.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="" className="h-full w-full object-cover" /></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[{ v: '10,000+', l: 'Coins Tracked' }, { v: '60s', l: 'Update Frequency' }, { v: '100%', l: 'Free Tier' }, { v: '24/7', l: 'Market Data' }].map((s) => (
              <div key={s.l}><p className="text-3xl sm:text-4xl font-bold text-white mb-2">{s.v}</p><p className="text-sm text-brand-300 uppercase tracking-wide">{s.l}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold text-brand-900 mb-4">Our Mission</h2></div>
          <div className="prose prose-lg max-w-none text-slate-600">
            <p className="mb-6">CryptoTracker was built to bring transparency to crypto investing. After seeing countless "guaranteed returns" scams and fake investment platforms, we wanted to build something honest: a tool that shows real market data, tracks real holdings, and never makes false promises.</p>
            <p className="mb-6">Our core values are simple: <strong className="text-brand-900">Transparency</strong> — we show real data from CoinGecko, nothing fabricated. <strong className="text-brand-900">Security</strong> — your data is encrypted and private. <strong className="text-brand-900">Education</strong> — we help you understand the risks, not hide them.</p>
            <p>We do not custody your assets. We do not promise returns. We do not impersonate celebrities or claim false regulation. We are a tracking tool, and we do that one thing well.</p>
          </div>
        </div>
      </section>

      {/* Risk Disclaimer */}
      <section className="py-12 bg-amber-50 border-y border-amber-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-2">Risk Disclosure</h3>
              <p className="text-sm text-amber-800 leading-relaxed">Cryptocurrency trading involves significant risk and can result in the loss of your invested capital. Past performance does not guarantee future results. CryptoTracker is a portfolio tracking tool only — we do not execute trades, custody assets, or provide investment advice. Always do your own research and never invest more than you can afford to lose. Be wary of any platform that promises guaranteed or fixed returns — that is a common sign of fraud.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Table */}
      <section id="market" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-900 mb-4">Live Market Data</h2>
            <p className="text-slate-600">Top 50 cryptocurrencies by market cap — updated every minute</p>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(10)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-200" />)}</div>
          ) : coins.length === 0 ? (
            <div className="text-center py-12 text-slate-500">Unable to load market data. Please try again later.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">24h %</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Market Cap</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.map((coin) => {
                    const isPositive = coin.price_change_percentage_24h >= 0
                    return (
                      <tr key={coin.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-500">{coin.market_cap_rank}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={coin.image} alt="" className="h-6 w-6 rounded-full" />
                            <div><p className="text-sm font-semibold text-brand-900">{coin.name}</p><p className="text-xs text-slate-500">{coin.symbol.toUpperCase()}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-brand-900">{formatCurrency(coin.current_price)}</td>
                        <td className={`px-4 py-3 text-right text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>{formatPercent(coin.price_change_percentage_24h)}</td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600 hidden sm:table-cell">{formatCurrency(coin.market_cap)}</td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600 hidden sm:table-cell">{formatCurrency(coin.total_volume)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500"><TrendingUp className="h-5 w-5 text-white" /></div>
                <span className="text-lg font-bold text-white">CryptoTracker</span>
              </div>
              <p className="text-sm text-brand-300">Real-time crypto portfolio tracking. Honest data, no false promises.</p>
            </div>
            <div><h4 className="text-sm font-semibold text-white mb-3">Product</h4><ul className="space-y-2 text-sm text-brand-300"><li><a href="#features" className="hover:text-white">Features</a></li><li><a href="#plans" className="hover:text-white">Pricing</a></li><li><a href="#market" className="hover:text-white">Market Data</a></li></ul></div>
            <div><h4 className="text-sm font-semibold text-white mb-3">Company</h4><ul className="space-y-2 text-sm text-brand-300"><li><a href="#" className="hover:text-white">About</a></li><li><a href="#" className="hover:text-white">Risk Disclosure</a></li><li><a href="#" className="hover:text-white">Privacy</a></li></ul></div>
            <div><h4 className="text-sm font-semibold text-white mb-3">Get Started</h4><ul className="space-y-2 text-sm text-brand-300"><li><Link to="/register" className="hover:text-white">Create Account</Link></li><li><Link to="/login" className="hover:text-white">Sign In</Link></li><li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li></ul></div>
          </div>
          <div className="mt-8 border-t border-brand-800 pt-8 text-center"><p className="text-xs text-brand-400">Data provided by CoinGecko. CryptoTracker is a tracking tool only and does not provide investment advice. © 2026 CryptoTracker. Not affiliated with any celebrity or brand.</p></div>
        </div>
      </footer>
    </div>
  )
}
