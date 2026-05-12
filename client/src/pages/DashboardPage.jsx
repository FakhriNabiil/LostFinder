import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getUser, logout } from '../services/authService'
import { apiService } from '../api/api'

/* Status config */
const STATUS = {
  missing: { label: 'Hilang', cls: 'bg-red-500/15 text-red-400', dot: 'bg-red-400' },
  found: { label: 'Ditemukan', cls: 'bg-emerald-500/15 text-emerald-400', dot: 'bg-emerald-400' },
}

function Badge({ status }) {
  const s = STATUS[status] || STATUS.missing
  return (
    <span className={`badge ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

/* Skeleton */
function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-44 w-full" style={{ borderRadius: 0 }} />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3.5 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-3 w-full" />
      </div>
    </div>
  )
}

/* Poster Card */
function PosterCard({ poster, currentUserId, onDelete, onStatus, index }) {
  const [confirm, setConfirm] = useState(false)
  const isOwner = poster.owner === currentUserId
  const imgSrc = poster.imgUrl?.trim() || null

  return (
    <article
      className="card card-hover overflow-hidden slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Thumbnail */}
      <Link to={`/poster/${poster.id}`} className="block relative h-44 bg-muted overflow-hidden group">
        {imgSrc ? (
          <img src={imgSrc} alt={poster.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5"><Badge status={poster.status} /></div>
      </Link>

      {/* Body */}
      <div className="p-4">
        <Link to={`/poster/${poster.id}`} className="block group">
          <h3 className="text-[13px] font-semibold text-card-foreground truncate mb-1 group-hover:text-primary transition-colors duration-200">
            {poster.title}
          </h3>
          <p className="text-[11px] text-muted-foreground truncate mb-2">📞 {poster.contact}</p>
          <p className="text-[12px] text-muted-foreground/80 line-clamp-2 leading-relaxed">{poster.description}</p>
        </Link>

        {isOwner && (
          <div className="mt-3 pt-3 border-t border-border flex gap-2">
            <button
              onClick={() => onStatus(poster.id, poster.status === 'missing' ? 'found' : 'missing')}
              className="flex-1 text-[11px] font-medium py-1.5 rounded-md border border-primary/40 text-primary
                         hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 cursor-pointer">
              {poster.status === 'missing' ? '✓ Ditemukan' : '↺ Hilang'}
            </button>
            {!confirm ? (
              <button onClick={() => setConfirm(true)}
                className="text-[11px] font-medium px-3 py-1.5 rounded-md border border-border text-muted-foreground
                           hover:border-destructive/50 hover:text-destructive transition-all duration-200 cursor-pointer">
                Hapus
              </button>
            ) : (
              <div className="flex gap-1.5">
                <button onClick={() => onDelete(poster.id)}
                  className="text-[11px] font-medium px-2.5 py-1.5 rounded-md bg-destructive text-white cursor-pointer">Ya</button>
                <button onClick={() => setConfirm(false)}
                  className="text-[11px] font-medium px-2.5 py-1.5 rounded-md bg-secondary text-secondary-foreground cursor-pointer">Batal</button>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

/* Dashboard */
export default function DashboardPage() {
  const [posters, setPosters] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const user = getUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    apiService.getPosters()
      .then(res => {
        const data = Array.isArray(res) ? res : (res?.payload?.datas || [])
        setPosters(data)
      })
      .catch(() => toast.error('Gagal memuat poster.'))
      .finally(() => setLoading(false))
  }, [])

  const displayed = useMemo(() => {
    let list = filter === 'all' ? posters : posters.filter(p => p.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
    }
    return list
  }, [posters, filter, search])

  const handleDelete = async id => {
    try { await apiService.deletePoster(id); setPosters(p => p.filter(x => x.id !== id)); toast.success('Poster dihapus.') }
    catch (e) { toast.error(e.message) }
  }
  const handleStatus = async (id, status) => {
    try { await apiService.updateStatus(id, status); setPosters(p => p.map(x => x.id === id ? { ...x, status } : x)); toast.success('Status diperbarui.') }
    catch (e) { toast.error(e.message) }
  }

  const stats = {
    total: posters.length,
    missing: posters.filter(p => p.status === 'missing').length,
    found: posters.filter(p => p.status === 'found').length,
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-2 h-15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground tracking-tight">LostFinder</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-muted-foreground sm:block">{user.email}</span>
            <button onClick={() => { logout(); navigate('/login') }}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-6 fade-in">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">Katalog Kehilangan</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Kelola dan pantau poster kehilangan</p>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-3 gap-3 mb-6 fade-in" style={{ animationDelay: '50ms' }}>
            {[
              { label: 'Total Poster', val: stats.total, color: 'text-foreground', sub: 'text-muted-foreground' },
              { label: 'Hilang', val: stats.missing, color: 'text-red-400', sub: 'text-red-400/60' },
              { label: 'Ditemukan', val: stats.found, color: 'text-emerald-400', sub: 'text-emerald-400/60' },
            ].map(({ label, val, color, sub }) => (
              <div key={label} className="card p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                <p className={`text-2xl font-bold tabular-nums ${color}`}>{val}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex rounded-lg border border-border bg-card p-1 gap-0.5">
            {[
              { key: 'all', label: 'Semua' },
              { key: 'missing', label: 'Hilang' },
              { key: 'found', label: 'Ditemukan' },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all duration-200 cursor-pointer
                  ${filter === key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
                {label}
              </button>
            ))}
          </div>

          <input
            type="text" placeholder="Cari poster…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-field sm:ml-auto sm:w-56"
          />

          <Link to="/poster/create" className="btn-primary text-[13px] whitespace-nowrap">+ Buat Poster</Link>

        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 fade-in">
            <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2" className="text-muted-foreground/50">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">Belum ada poster</h3>
            <p className="text-[13px] text-muted-foreground mb-5">Buat poster kehilangan pertamamu.</p>
            <Link to="/poster/create" className="btn-primary text-[13px]">+ Buat Poster</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayed.map((p, i) => (
              <PosterCard key={p.id} poster={p} index={i} currentUserId={user?.email}
                onDelete={handleDelete} onStatus={handleStatus} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}