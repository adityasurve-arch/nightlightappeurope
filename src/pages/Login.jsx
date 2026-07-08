import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn, signInWithGoogle } from '../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message)
      setGoogleLoading(false)
    }
  }

  async function handleDemo() {
    setLoading(true)
    setError(null)
    try {
      await signIn({ email: 'demo@nightlight.app', password: 'demo1234' })
      navigate('/dashboard')
    } catch (err) {
      setError('Demo account not set up yet — ask the admin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}
      className="flex items-center justify-center px-4"
    >
      <div className="w-full max-w-sm flex flex-col gap-5">

        {/* Logo */}
        <div className="text-center">
          <div style={{ color: 'var(--accent)' }} className="text-3xl font-bold tracking-tight mb-1">
            NIGHTLIGHT
          </div>
          <p style={{ color: 'var(--muted)' }} className="text-sm">
            Sign in to your account
          </p>
        </div>

        {/* Demo button */}
        <button
          onClick={handleDemo}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #C8922A, #A06818)',
            color: 'white',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Signing in…' : '✦ Try demo — no account needed'}
        </button>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all active:scale-95"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            opacity: googleLoading ? 0.7 : 1,
          }}
        >
          {googleLoading ? (
            <span style={{ color: 'var(--muted)' }}>Redirecting…</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
          <span style={{ color: 'var(--muted)', fontSize: '11px' }}>or sign in with email</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label style={{ color: 'var(--muted)', fontSize: '11px' }} className="uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: '16px',
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={{ color: 'var(--muted)', fontSize: '11px' }} className="uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: '16px',
              }}
            />
          </div>

          {error && (
            <div
              className="rounded-xl px-4 py-3 text-xs"
              style={{ backgroundColor: 'rgba(217,83,79,0.1)', border: '1px solid rgba(217,83,79,0.3)', color: '#f87171' }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-95 mt-1"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        {/* Sign up link */}
        <div className="text-center flex flex-col gap-2">
          <p style={{ color: 'var(--muted)' }} className="text-sm">
            New member?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)' }} className="font-medium">
              Create a free account
            </Link>
          </p>
          <Link to="/" style={{ color: 'var(--muted)', fontSize: '12px' }}>
            ← Back to home
          </Link>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: '11px' }} className="text-center">
          Quarter · Drink responsibly
        </p>
      </div>
    </div>
  )
}
