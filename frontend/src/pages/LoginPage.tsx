import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import type { FormEvent } from 'react'

const LoginPage = () => {
  const { login, error } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('investor@vega.app')
  const [password, setPassword] = useState('portfolio')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setLocalError(null)
    try {
      await login(email.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch (submitError) {
      setLocalError((submitError as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_rgba(7,9,15,1)_70%)] px-4 py-8 text-white">
      <div className="glass-panel w-full max-w-lg p-8">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-muted">Vega</p>
          <h1 className="mt-2 text-3xl font-semibold">Investor login</h1>
          <p className="mt-2 text-sm text-muted">
            Use demo credentials <span className="font-mono text-accent">investor@vega.app / portfolio</span>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold uppercase tracking-[0.3em] text-muted">
            Email
            <input
              type="email"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-accent focus:outline-none"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-semibold uppercase tracking-[0.3em] text-muted">
            Password
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white focus:border-accent focus:outline-none"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {(error || localError) && <p className="text-sm text-danger">{error ?? localError}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-accent px-4 py-3 text-base font-semibold text-white transition hover:bg-accent/80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Access portfolio'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

