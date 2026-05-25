export function sameStudentId(a, b) {
  if (a == null || b == null) return false
  return String(a) === String(b)
}
