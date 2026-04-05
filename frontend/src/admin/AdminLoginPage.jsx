import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Spinner from '../components/ui/Spinner'

const HARDCODED_EMAIL = 'admin@glomonhomes.com'
const HARDCODED_PASSWORD = 'GlomonAdmin2025!'

export default function AdminLoginPage() {
  const { login, loginLocal, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(HARDCODED_EMAIL)
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Always try the real backend first
      const res = await api.post('/api/auth/login', { email, password })
      login(res.data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      const isNetworkError = !err.response // no response = backend unreachable
      if (isNetworkError) {
        // Backend is down — allow hardcoded credentials as offline fallback
        if (email.trim() === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
          loginLocal()
          navigate('/admin/dashboard')
        } else {
          setError('Cannot reach server. Use the default credentials to access offline mode.')
        }
      } else {
        // Backend responded with an error (401, 400, etc.) — show that message
        setError(err.response?.data?.error ?? 'Invalid email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/logo-icon.svg"
            alt="Glomon Homes Logo"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="font-display font-bold text-white text-2xl">Glomon Homes</h1>
          <p className="text-white/50 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-card shadow-2xl p-8">
          <h2 className="font-display font-semibold text-text-main text-lg mb-6">Sign in</h2>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-btn mb-5">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-main mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-main mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border border-border rounded-btn px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-light text-white py-3 rounded-btn text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Spinner size="sm" className="border-white/30 border-t-white" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-border text-center">
            <p className="text-[11px] text-text-muted">
              Password hint:{' '}
              <button
                type="button"
                onClick={() => setPassword(HARDCODED_PASSWORD)}
                className="font-mono text-primary hover:underline"
              >
                fill default
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
