import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landingPage'
import DashboardAdmin from './pages/admin/DashboardAdmin'

function PrivateRoute({ children, requiredRole }) {
  const token = sessionStorage.getItem('token')
  const user = JSON.parse(sessionStorage.getItem('user') || 'null')
  if (!token || !user) return <Navigate to="/" replace />
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/dashboard" element={
          <PrivateRoute requiredRole="admin"><DashboardAdmin /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
