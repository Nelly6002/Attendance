import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getAuthUser, setAuthUser, initTheme, setTheme } from '../utils/storage'
import { fetchStudents, addStudentRecord } from '../services/dataService'
import {
  isMatricTaken,
  fetchStudentByUserId,
  fetchProfile,
} from '../services/studentAccountService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setThemeState] = useState('light')

  useEffect(() => {
    const savedTheme = initTheme()
    setThemeState(savedTheme)

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          loadSupabaseUser(session.user)
        } else {
          setLoading(false)
        }
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          loadSupabaseUser(session.user)
        } else {
          setUser(null)
          setLoading(false)
        }
      })

      return () => subscription.unsubscribe()
    }

    setUser(getAuthUser())
    setLoading(false)
  }, [])

  async function loadSupabaseUser(sbUser) {
    let role = sbUser.user_metadata?.role || 'teacher'
    let studentId = sbUser.user_metadata?.student_id
    let name = sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0]
    let matric = sbUser.user_metadata?.matric
    let course = sbUser.user_metadata?.course

    try {
      const profile = await fetchProfile(sbUser.id)
      if (profile) {
        role = profile.role || role
        studentId = profile.student_id ?? studentId
        name = profile.full_name || name
        matric = profile.matric || matric
        course = profile.course || course
      }

      if (role === 'student') {
        const studentRow = await fetchStudentByUserId(sbUser.id)
        if (studentRow) {
          studentId = studentRow.id
          name = studentRow.name
          matric = studentRow.matric
          course = studentRow.course
        }
      }
    } catch {
      // use metadata fallback
    }

    setUser({
      id: sbUser.id,
      name,
      email: sbUser.email,
      role: role === 'student' ? 'student' : 'teacher',
      matric,
      studentId,
      course,
    })
    setLoading(false)
  }

  const loginTeacher = async (email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Email and password are required.' }
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) {
        // Better error messages for common auth issues
        if (error.message?.includes('Invalid login credentials')) {
          return { success: false, message: 'Invalid email or password. Make sure you registered first.' }
        }
        if (error.message?.includes('Email not confirmed')) {
          return { success: false, message: 'Please verify your email first. Check your inbox for a confirmation link.' }
        }
        if (error.message?.includes('too many requests') || error.status === 429) {
          return { success: false, message: 'Too many login attempts. Please wait a few minutes and try again.' }
        }
        return { success: false, message: error.message }
      }
      const role = data.user.user_metadata?.role
      const profile = await fetchProfile(data.user.id)
      const effectiveRole = profile?.role || role
      if (effectiveRole === 'student') {
        await supabase.auth.signOut()
        return { success: false, message: 'This is a student account. Use student sign in.' }
      }
      await loadSupabaseUser(data.user)
      return { success: true }
    }

    const demoUser = { id: 'teacher-demo', name: 'Teacher', email, role: 'teacher' }
    setAuthUser(demoUser)
    setUser(demoUser)
    return { success: true }
  }

  const loginStudent = async (email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Email and password are required.' }
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) {
        // Better error messages for common auth issues
        if (error.message?.includes('Invalid login credentials')) {
          return { success: false, message: 'Invalid email or password. Make sure you registered first.' }
        }
        if (error.message?.includes('Email not confirmed')) {
          return { success: false, message: 'Please verify your email first. Check your inbox for a confirmation link.' }
        }
        return { success: false, message: error.message }
      }

      const profile = await fetchProfile(data.user.id)
      const role = profile?.role || data.user.user_metadata?.role
      if (role !== 'student') {
        await supabase.auth.signOut()
        return { success: false, message: 'This is a staff account. Use staff sign in.' }
      }

      const studentRow = await fetchStudentByUserId(data.user.id)
      if (!studentRow) {
        await supabase.auth.signOut()
        return {
          success: false,
          message: 'Student profile not found. Please register first or contact your lecturer.',
        }
      }

      await loadSupabaseUser(data.user)
      return { success: true }
    }

    try {
      const students = await fetchStudents()
      const student = students.find(
        (s) => s.email?.toLowerCase() === email.trim().toLowerCase()
      )
      if (!student) {
        return { success: false, message: 'No account with this email. Register first.' }
      }
      const studentUser = {
        id: `student-${student.id}`,
        name: student.name,
        email: student.email,
        matric: student.matric,
        role: 'student',
        studentId: student.id,
        course: student.course,
      }
      setAuthUser(studentUser)
      setUser(studentUser)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const registerStudent = async (formData) => {
    const { name, email, password, matric, course } = formData
    if (!name || !email || !password || !matric || !course) {
      return { success: false, message: 'All fields are required.' }
    }
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        if (await isMatricTaken(matric)) {
          return { success: false, message: 'This matric number is already registered.' }
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              role: 'student',
              full_name: name.trim(),
              matric: matric.trim(),
              course,
            },
          },
        })
        if (error) return { success: false, message: error.message }

        if (data.session?.user) {
          await loadSupabaseUser(data.session.user)
          return { success: true, message: 'Registration complete. You can sign in to class now.' }
        }

        return {
          success: true,
          message:
            'Account created. Check your email to confirm, then sign in with your email and password.',
        }
      } catch (err) {
        if (err.message?.includes('duplicate') || err.code === '23505') {
          return { success: false, message: 'This matric number is already registered.' }
        }
        return { success: false, message: err.message }
      }
    }

    try {
      const students = await fetchStudents()
      if (students.some((s) => s.matric.toLowerCase() === matric.trim().toLowerCase())) {
        return { success: false, message: 'This matric number is already registered.' }
      }
      const result = await addStudentRecord(students, {
        name: name.trim(),
        matric: matric.trim(),
        course,
        email: email.trim(),
      })
      const studentUser = {
        id: `student-${result.student.id}`,
        name: result.student.name,
        email: result.student.email,
        matric: result.student.matric,
        role: 'student',
        studentId: result.student.id,
        course: result.student.course,
      }
      setAuthUser(studentUser)
      setUser(studentUser)
      return { success: true, message: 'Registration complete.' }
    } catch (err) {
      return { success: false, message: err.message }
    }
  }

  const register = async (formData) => {
    if (!formData.name || !formData.email || !formData.password) {
      return { success: false, message: 'All fields are required.' }
    }
    if (formData.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: { data: { full_name: formData.name.trim(), role: 'teacher' } },
        })
        if (error) {
          // Better error messages for common signup issues
          if (error.message?.includes('too many requests') || error.status === 429) {
            return { success: false, message: 'Too many signup attempts. Please wait a few minutes and try again.' }
          }
          if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
            return { success: false, message: 'This email is already registered. Try signing in instead.' }
          }
          return { success: false, message: error.message }
        }
        if (data.session?.user) await loadSupabaseUser(data.session.user)
        return { success: true, message: 'Check your email to confirm your account.' }
      } catch (err) {
        if (err.message?.includes('too many requests')) {
          return { success: false, message: 'Too many signup attempts. Please wait a few minutes and try again.' }
        }
        return { success: false, message: err.message }
      }
    }

    const newUser = { id: 'teacher-demo', name: formData.name, email: formData.email, role: 'teacher' }
    setAuthUser(newUser)
    setUser(newUser)
    return { success: true }
  }

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }
    setAuthUser(null)
    setUser(null)
  }

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    setThemeState(next)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginTeacher,
        loginStudent,
        registerStudent,
        register,
        logout,
        theme,
        toggleTheme,
        isCloud: isSupabaseConfigured,
        isTeacher: user?.role === 'teacher' || user?.role === 'admin',
        isStudent: user?.role === 'student',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
