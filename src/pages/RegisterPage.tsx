import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './AuthPage.module.css'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setSuccess('Account created! Check your email for confirmation, then sign in.')
      setTimeout(() => navigate('/login'), 3000)
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

        <h1 className={s.title}>Create Account</h1>
        <p className={s.subtitle}>Register as a content editor</p>

        {error && <div className={s.error}>{error}</div>}
        {success && <div className={s.success}>{success}</div>}

        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.field}>
            <label className={s.label}>Full Name</label>
            <input
              className={s.input}
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>Email Address</label>
            <input
              className={s.input}
              type="email"
              placeholder="you@example.com"
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
              placeholder="Min 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>Confirm Password</label>
            <input
              className={s.input}
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className={s.btn} type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register as Editor →'}
          </button>
        </form>

        <div className={s.switchLink}>
          Already have an account?{' '}
          <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  )
}
