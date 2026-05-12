import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { isLoggedIn } from './services/authService'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CreatePosterPage from './pages/CreatePosterPage'
import PosterDetailPage from './pages/PosterDetailPage'

function Guard({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Navigate to="/dashboard" replace />} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/register"       element={<RegisterPage />} />
        <Route path="/dashboard"     element={<Guard><DashboardPage /></Guard>} />
        <Route path="/poster/create" element={<Guard><CreatePosterPage /></Guard>} />
        <Route path="/poster/:id"    element={<Guard><PosterDetailPage /></Guard>} />
        <Route path="*"              element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
