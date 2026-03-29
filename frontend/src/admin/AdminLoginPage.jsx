import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Spinner from '../components/ui/Spinner'

// Hardcoded admin credentials — replace with env-driven check when backend is ready
const ADMIN_EMAIL = 'admin@glomonhomes.com'
const ADMIN_PASSWORD = 'GlomonAdmin2025!'

export default function AdminLoginPage() {
  const { login, loginLocal, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(ADMIN_EMAIL)
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
      // Try the real backend first — gives a proper JWT for API calls
      const res = await api.post('/api/auth/login', { email, password })
      login(res.data.token)
      navigate('/admin/dashboard')
    } catch {
      // Backend unavailable or wrong creds — fall back to hardcoded check
      if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        loginLocal()
        navigate('/admin/dashboard')
      } else {
        setError('Invalid email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Home size={22} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-white text-2xl">Glomon Homes</h1>
          <p className="text-white/50 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-card shadow-2xl p-8">
          <h2 className="font-display font-semibold text-text-main text-lg mb-6">Sign in</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-btn mb-5">
              <AlertCircle size={15} className="shrink-0" />
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
              Default password:{' '}
              <button
                type="button"
                onClick={() => setPassword(ADMIN_PASSWORD)}
                className="font-mono text-primary hover:underline"
              >
                GlomonAdmin2025!
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
