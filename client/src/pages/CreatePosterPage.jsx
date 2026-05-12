import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiService } from '../api/api'
import { getUser } from '../services/authService'

export default function CreatePosterPage() {
  const [form, setForm] = useState({ title: '', description: '', contact: '' })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileRef = useRef()
  const navigate = useNavigate()
  const user = getUser()

  function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Hanya file gambar.'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Ukuran maks 5MB.'); return }
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    handleFile(e.dataTransfer.files[0])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title || !form.description || !form.contact) {
      toast.error('Semua field wajib diisi.')
      return
    }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('contact', form.contact)
      fd.append('owner', user?.email || 'anonymous')
      fd.append('status', 'missing')
      if (image) fd.append('image', image)
      await apiService.createPoster(fd)
      toast.success('Poster berhasil dibuat!')
      navigate('/dashboard')
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/dashboard" className="btn-ghost text-[12px] px-2 py-1.5 flex items-center gap-1.5">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Kembali
          </Link>
          <span className="w-px h-5 bg-border" />
          <span className="text-[13px] font-medium text-foreground">Poster Baru</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10 slide-up">
        <h1 className="text-xl font-semibold text-foreground tracking-tight mb-1">Buat Poster</h1>
        <p className="text-[13px] text-muted-foreground mb-8">Isi informasi barang atau peliharaan yang hilang.</p>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image upload */}
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-2">Foto</label>
              <div
                onClick={() => fileRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`relative rounded-lg border-2 border-dashed cursor-pointer overflow-hidden
                  transition-all duration-200 min-h-[140px]
                  ${dragActive ? 'border-primary bg-primary/5' :
                    preview ? 'border-border' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}>
                {preview ? (
                  <div className="relative">
                    <img src={preview} className="w-full max-h-56 object-cover" alt="Preview" />
                    <button type="button"
                      onClick={e => { e.stopPropagation(); setImage(null); setPreview(null) }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/70 text-white text-xs
                                 flex items-center justify-center hover:bg-black transition-colors">✕</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2" className="text-muted-foreground/50">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <p className="text-[13px]">Klik atau seret gambar ke sini</p>
                    <p className="text-[11px] text-muted-foreground/60">JPG, PNG, WebP · Maks 5MB</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            </div>

            {/* Fields */}
            <div>
              <label className="block text-[13px] font-medium text-foreground mb-2">Judul</label>
              <input required placeholder="Contoh: Kucing Oren Hilang di Dago"
                value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="input-field" />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-2">Deskripsi</label>
              <textarea required rows={4}
                placeholder="Ciri-ciri, lokasi terakhir, kapan hilang..."
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="input-field resize-y" />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-foreground mb-2">Nomor Kontak</label>
              <input required placeholder="08xxxxxxxxxx"
                value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })}
                className="input-field" />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Link to="/dashboard" className="btn-outline px-5">Batal</Link>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Menyimpan…
                  </span>
                ) : 'Publikasikan'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
