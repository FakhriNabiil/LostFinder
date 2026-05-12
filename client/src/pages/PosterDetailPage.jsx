import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getUser } from '../services/authService'
import { apiService } from '../api/api'

const STATUS = {
  missing: { label: 'Belum Ditemukan', cls: 'bg-red-500/15 text-red-400',     dot: 'bg-red-400' },
  found:   { label: 'Sudah Ditemukan', cls: 'bg-emerald-500/15 text-emerald-400', dot: 'bg-emerald-400' },
}

function formatDate(str) {
  if (!str) return '-'
  return new Date(str).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PosterDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [poster, setPoster] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState(false)
  const user = getUser()

  useEffect(() => {
    apiService.getPoster(id)
      .then(res => setPoster(res?.payload?.datas ?? res))
      .catch(() => { toast.error('Poster tidak ditemukan.'); navigate('/dashboard') })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleDelete = async () => {
    try { await apiService.deletePoster(id); toast.success('Poster dihapus.'); navigate('/dashboard') }
    catch (e) { toast.error(e.message) }
  }

  const handleStatus = async () => {
    const next = poster.status === 'missing' ? 'found' : 'missing'
    try { await apiService.updateStatus(id, next); setPoster({ ...poster, status: next }); toast.success('Status diperbarui.') }
    catch (e) { toast.error(e.message) }
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" />
    </div>
  )

  if (!poster) return null

  const isOwner = poster.owner === user?.email
  const s = STATUS[poster.status] || STATUS.missing
  const imgSrc = poster.imgUrl?.trim() || null

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/dashboard" className="btn-ghost text-[12px] px-2 py-1.5 flex items-center gap-1.5">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Dashboard
          </Link>
          <span className="w-px h-5 bg-border" />
          <span className="text-[13px] font-medium text-foreground truncate max-w-[200px]">{poster.title}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 slide-up">
        <div className="card overflow-hidden">
          {/* Hero image */}
          {imgSrc && (
            <div className="relative overflow-hidden" style={{ maxHeight: 380 }}>
              <img src={imgSrc} alt={poster.title} className="w-full object-cover" style={{ maxHeight: 380 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Badge + date */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <span className={`badge ${s.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </span>
              <span className="text-[12px] text-muted-foreground">
                Dilaporkan {formatDate(poster.createdAt)}
              </span>
            </div>

            <h1 className="text-2xl font-semibold text-card-foreground tracking-tight mb-5">{poster.title}</h1>

            <div className="border-l-2 border-primary pl-4 mb-6">
              <p className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {poster.description}
              </p>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted border border-border mb-6">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <span className="text-sm">📞</span>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Hubungi Pelapor</p>
                <p className="text-[14px] font-medium text-foreground">{poster.contact}</p>
              </div>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-border">
                <button onClick={handleStatus}
                  className="flex-1 py-2.5 rounded-lg text-[13px] font-medium border border-primary/40 text-primary
                             hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 cursor-pointer">
                  {poster.status === 'missing' ? '✓ Tandai Sudah Ditemukan' : '↺ Tandai Kembali Hilang'}
                </button>
                {!confirm ? (
                  <button onClick={() => setConfirm(true)}
                    className="px-5 py-2.5 rounded-lg text-[13px] font-medium border border-border text-muted-foreground
                               hover:border-destructive/50 hover:text-destructive transition-all duration-200 cursor-pointer">
                    Hapus
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleDelete}
                      className="btn-danger text-[13px] px-4 py-2.5">Ya, Hapus</button>
                    <button onClick={() => setConfirm(false)}
                      className="btn-outline text-[13px] px-4 py-2.5">Batal</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
