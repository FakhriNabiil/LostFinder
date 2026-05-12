import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000',
})

// Request interceptor — otomatis sisipkan token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — handle 401 & error global
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(new Error(err.response?.data?.message || 'Terjadi kesalahan.'))
  }
)

export const apiService = {
  login: (email, password)      => api.post('/api/login', { email, password }),
  register: (email, password)   => api.post('/api/register', { email, password }),
  getPosters:   ()              => api.get('/api/posters'),
  getPoster:    (id)            => api.get(`/api/posters/${id}`),
  createPoster: (formData)      => api.post('/api/posters', formData),
  deletePoster: (id)            => api.delete(`/api/posters/${id}`),
  updateStatus: (id, status)    => api.patch(`/api/posters/${id}/status`, { status }),
}