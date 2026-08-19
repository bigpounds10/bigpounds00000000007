import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (!agree) { setError('Please agree to the Terms and Risk Disclosure'); return }
    setLoading(true)
    const { error } = await signUp(email, password)
    setLoading(false)
    if (error) setError(error)
    else navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-brand-950 flex flex-col">
      <div className="px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-white hover:text-brand-300 transition-colors">
          <ArrowLeft className="h-4 w-4" /><span className="text-sm">Back to home</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500"><TrendingUp className="h-6 w-6 text-white" /></div>
              <span className="text-2xl font-bold text-white">CryptoTracker</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-brand-300 text-sm">Start tracking your crypto portfolio for free</p>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" /><p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input type="text" required placeholder="John Doe" className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="At least 6 characters" className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Re-enter password" className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" />
                </div>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                <span className="text-xs text-slate-600 leading-relaxed">I agree to the Terms of Service and acknowledge the Risk Disclosure: cryptocurrency trading involves significant risk and I will not invest more than I can afford to lose. I understand CryptoTracker is a tracking tool only and does not provide investment advice.</span>
              </label>
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Creating account...' : 'Create Free Account'}</button>
            </form>
            <div className="mt-6 text-center text-sm"><span className="text-slate-500">Already have an account?</span> <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign In</Link></div>
          </div>
        </div>
      </div>
    </div>
  )
}
