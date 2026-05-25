export function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

export function calculateStats(records, students) {
  const totalStudents = students.length
  const today = getTodayDate()
  const todayRecords = records.filter((r) => r.date === today)

  const present = todayRecords.filter((r) => r.status === 'Present').length
  const absent = todayRecords.filter((r) => r.status === 'Absent').length
  const late = todayRecords.filter((r) => r.status === 'Late').length
  const marked = todayRecords.length
  const percentage = totalStudents
    ? Math.round((present / totalStudents) * 100)
    : 0

  return { present, absent, late, marked, totalStudents, percentage }
}

export function getStudentAttendancePercentage(studentId, records) {
  const studentRecords = records.filter((r) => r.studentId === studentId)
  if (!studentRecords.length) return 0
  const present = studentRecords.filter((r) => r.status === 'Present').length
  return Math.round((present / studentRecords.length) * 100)
}

export function filterRecordsByDate(records, date) {
  if (!date) return records
  return records.filter((r) => r.date === date)
}

export function exportToCSV(records, filename = 'attendance-report.csv') {
  const headers = ['Student Name', 'Matric Number', 'Status', 'Date', 'Course']
  const rows = records.map((r) =>
    [r.studentName, r.matric, r.status, r.date, r.course || ''].join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportToPDF(records, title = 'Attendance Report') {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const rows = records
    .map(
      (r) =>
        `<tr>
          <td style="padding:8px;border:1px solid #ddd">${r.studentName}</td>
          <td style="padding:8px;border:1px solid #ddd">${r.matric}</td>
          <td style="padding:8px;border:1px solid #ddd">${r.status}</td>
          <td style="padding:8px;border:1px solid #ddd">${r.date}</td>
        </tr>`
    )
    .join('')

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          h1 { color: #1e3a8a; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background: #1e3a8a; color: white; padding: 10px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Matric Number</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.print()
}
