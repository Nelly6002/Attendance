import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { StudentsProvider } from './context/StudentsContext'
import { SessionsProvider } from './context/SessionsContext'
import AppRoutes from './routes'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <StudentsProvider>
            <SessionsProvider>
              <AppRoutes />
            </SessionsProvider>
          </StudentsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
