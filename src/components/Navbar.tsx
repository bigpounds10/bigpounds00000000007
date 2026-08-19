import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-brand-900">CryptoTracker</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">How It Works</a>
            <a href="#market" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Market</a>
            <a href="#plans" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Plans</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors">Sign In</Link>
            <Link to="/register" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-all hover:shadow-md">Get Started</Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
