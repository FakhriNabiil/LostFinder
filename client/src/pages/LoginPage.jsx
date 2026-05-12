import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '../services/authService'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(form.email, form.password)
      const userData = res.payload.datas
      const token = userData.token
      localStorage.setItem('user', JSON.stringify(userData))
      if (token) localStorage.setItem('token', token)
      toast.success(`Selamat datang, ${userData.email}!`)
      await new Promise(r => setTimeout(r, 800))
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[380px] scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 mb-5">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-primary">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">Masuk ke LostFinder</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Masuk/Buat akun untuk melanjutkan</p>
        </div>

        {/* Form card */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-2">Email</label>
              <input
                type="email" required
                placeholder="nama@mail.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-2">Password</label>
              <input
                type="password" required
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Memproses…
                </span>
              ) : 'Masuk'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-[13px] text-muted-foreground">
          Belum punya akun?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">Daftar</Link>
        </p>

        {/* Demo hint */}
        <div className="mt-5 card p-3 text-center">
          <p className="text-[12px] text-muted-foreground">
            <span className="text-accent-foreground font-medium">Demo:</span>{' '}
            demo@mail.com · 123456
          </p>
        </div>
      </div>
    </div>
  )
}
