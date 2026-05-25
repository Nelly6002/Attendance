import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  fetchStudents,
  fetchAttendance,
  markAttendanceRecord,
  addStudentRecord,
  usingCloud,
} from '../services/dataService'
import { getTodayDate } from '../utils/attendance'
import { useToast } from './ToastContext'

const StudentsContext = createContext(null)

export function StudentsProvider({ children }) {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const [studentsData, attendanceData] = await Promise.all([
        fetchStudents(),
        fetchAttendance(),
      ])
      setStudents(studentsData)
      setAttendance(attendanceData)
    } catch (err) {
      setError(err.message)
      if (!silent) toast(err.message, 'error')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    const onUpdate = () => loadData(true)
    window.addEventListener('attendance-updated', onUpdate)
    return () => window.removeEventListener('attendance-updated', onUpdate)
  }, [loadData])

  const markAttendance = useCallback(
    async (studentId, status) => {
      const date = getTodayDate()
      try {
        const result = await markAttendanceRecord(
          students,
          attendance,
          studentId,
          status,
          date
        )
        if (result) {
          setStudents(result.students)
          setAttendance(result.attendance)
        }
        toast(`${status} marked successfully`)
      } catch (err) {
        toast(err.message, 'error')
      }
    },
    [students, attendance, toast]
  )

  const addStudent = useCallback(
    async (formData) => {
      try {
        const result = await addStudentRecord(students, formData)
        setStudents(result.students)
        toast(`${formData.name} added successfully`)
        return result.student
      } catch (err) {
        toast(err.message, 'error')
        return null
      }
    },
    [students, toast]
  )

  const refresh = () => loadData()

  return (
    <StudentsContext.Provider
      value={{
        students,
        attendance,
        loading,
        error,
        markAttendance,
        addStudent,
        refresh,
        isCloud: usingCloud(),
      }}
    >
      {children}
    </StudentsContext.Provider>
  )
}

export function useStudents() {
  const ctx = useContext(StudentsContext)
  if (!ctx) throw new Error('useStudents must be used within StudentsProvider')
  return ctx
}
