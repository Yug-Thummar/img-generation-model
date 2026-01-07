import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Save the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}

export default ProtectedRoute



