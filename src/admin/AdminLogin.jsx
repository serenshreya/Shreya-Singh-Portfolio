import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaLock, FaArrowLeft } from 'react-icons/fa'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === import.meta.env.VITE_SUPABASE_ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      navigate('/admin')
    } else {
      setError('Invalid password. Access denied.')
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-logo">
          <span className="accent">SS</span> PORTFOLIO
        </div>
        <p className="admin-label">Admin Portal</p>

        {error && <p className="admin-login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            autoFocus
          />
          <button type="submit" className="btn-primary">
            <FaLock /> Access Dashboard
          </button>
        </form>

        <Link to="/" className="admin-login-back">
          <FaArrowLeft /> Back to Portfolio
        </Link>
      </div>
    </div>
  )
}
