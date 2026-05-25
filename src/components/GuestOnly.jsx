import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

export default function GuestOnly({ children, role }) {
  const { user, loading, isTeacher, isStudent } = useAuth()

  if (loading) return <Loader message="Loading..." />
  if (user) {
    if (role === 'teacher' && isTeacher) return <Navigate to="/dashboard" replace />
    if (role === 'student' && isStudent) return <Navigate to="/student" replace />
    if (!role) return <Navigate to={isStudent ? '/student' : '/dashboard'} replace />
  }

  return children
}
