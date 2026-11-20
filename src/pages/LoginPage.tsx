import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './AuthPage.module.css'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className={s.page}>
      <div className={s.card}>
        <Link to="/" className={s.logo}>
          <div className={s.logoIcon}>
            <GoogleIcon name="shield" size={26} style={{ color: '#bd1834' }} />
          </div>
          <div>
            <span className={s.logoText}>Shakti Sabha</span>
            <span className={s.logoSub}>Admin Portal</span>
          </div>
        </Link>

        <h1 className={s.title}>Welcome Back</h1>
        <p className={s.subtitle}>Sign in to manage website content</p>

        {error && <div className={s.error}>{error}</div>}

        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.field}>
            <label className={s.label}>Email Address</label>
            <input
              className={s.input}
              type="email"
              placeholder="admin@shaktisabha.org"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>Password</label>
            <input
              className={s.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className={s.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className={s.switchLink}>
          Don't have an account?{' '}
          <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  )
}
