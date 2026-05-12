import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiService } from '../api/api'

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Konfirmasi password tidak cocok.')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password minimal 6 karakter.')
      return
    }
    setLoading(true)
    try {
      await apiService.register(form.email, form.password)
      toast.success('Akun berhasil dibuat!')
      await new Promise(r => setTimeout(r, 800))
      navigate('/login')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[380px] scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 mb-5">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-primary">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">Buat Akun Baru</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Daftarkan email untuk mulai menggunakan LostFinder</p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-2">Email</label>
              <input type="email" required placeholder="nama@mail.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-2">Password</label>
              <input type="password" required placeholder="Min. 6 karakter"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-2">Konfirmasi Password</label>
              <input type="password" required placeholder="Ulangi password"
                value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
                className="input-field" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Mendaftarkan…
                </span>
              ) : 'Buat Akun'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-[13px] text-muted-foreground">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Masuk</Link>
        </p>
      </div>
    </div>
  )
}
