import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

export default function ProtectedRoute({ children, role }) {
  const { user, loading, isTeacher, isStudent } = useAuth()

  if (loading) return <Loader message="Checking authentication..." />
  if (!user) return <Navigate to="/login" replace />

  if (role === 'teacher' && !isTeacher) {
    return <Navigate to="/student" replace />
  }
  if (role === 'student' && !isStudent) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
