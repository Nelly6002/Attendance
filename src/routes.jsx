import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import StudentLayout from './layouts/StudentLayout'
import ProtectedRoute from './components/ProtectedRoute'
import GuestOnly from './components/GuestOnly'

import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import LoginPortal from './pages/LoginPortal'
import TeacherLogin from './pages/TeacherLogin'
import StudentLogin from './pages/StudentLogin'
import StudentRegister from './pages/StudentRegister'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MarkAttendance from './pages/MarkAttendance'
import AttendanceList from './pages/AttendanceList'
import Students from './pages/Students'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import StartSession from './pages/StartSession'
import SessionLive from './pages/SessionLive'
import StudentCheckIn from './pages/StudentCheckIn'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<GuestOnly><LoginPortal /></GuestOnly>} />
        <Route path="/login/teacher" element={<GuestOnly role="teacher"><TeacherLogin /></GuestOnly>} />
        <Route path="/login/student" element={<GuestOnly role="student"><StudentLogin /></GuestOnly>} />
        <Route path="/register/student" element={<GuestOnly role="student"><StudentRegister /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly role="teacher"><Register /></GuestOnly>} />
      </Route>

      <Route
        element={
          <ProtectedRoute role="teacher">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/session/start" element={<StartSession />} />
        <Route path="/session/:id" element={<SessionLive />} />
        <Route path="/attendance" element={<MarkAttendance />} />
        <Route path="/attendance-records" element={<AttendanceList />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route
        element={
          <ProtectedRoute role="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student" element={<StudentCheckIn />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
