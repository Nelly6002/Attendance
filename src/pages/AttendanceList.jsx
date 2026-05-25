import { useState } from 'react'
import { Search, Download, FileText, Calendar } from 'lucide-react'
import { useStudents } from '../context/StudentsContext'
import AttendanceTable from '../components/AttendanceTable'
import PageHeader from '../components/ui/PageHeader'
import Loader from '../components/Loader'
import { useToast } from '../context/ToastContext'
import {
  filterRecordsByDate,
  exportToCSV,
  exportToPDF,
  getTodayDate,
} from '../utils/attendance'

export default function AttendanceList() {
  const { attendance, loading } = useStudents()
  const { toast } = useToast()
  const [dateFilter, setDateFilter] = useState(getTodayDate())
  const [search, setSearch] = useState('')

  const filtered = filterRecordsByDate(attendance, dateFilter).filter(
    (r) =>
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.matric.toLowerCase().includes(search.toLowerCase())
  )

  const handleCSV = () => {
    exportToCSV(filtered)
    toast('CSV report downloaded')
  }

  const handlePDF = () => {
    exportToPDF(filtered, `Attendance Report — ${dateFilter}`)
    toast('PDF report opened for printing')
  }

  if (loading) return <Loader message="Loading records..." />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Records"
        description="Filter, search, and export attendance data."
      >
        <button type="button" onClick={handleCSV} className="btn-secondary">
          <Download className="h-4 w-4" />
          CSV
        </button>
        <button type="button" onClick={handlePDF} className="btn-primary">
          <FileText className="h-4 w-4" />
          PDF
        </button>
      </PageHeader>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative max-w-xs flex-1">
          <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input !pl-10"
          />
        </div>
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input !pl-10"
          />
        </div>
      </div>

      <div className="surface-elevated p-6">
        <p className="mb-4 text-sm text-slate-500">
          Showing <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> record(s) for{' '}
          <strong className="text-slate-900 dark:text-white">{dateFilter}</strong>
        </p>
        <AttendanceTable records={filtered} />
      </div>
    </div>
  )
}
