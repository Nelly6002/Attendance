import { supabase, isSupabaseConfigured } from '../lib/supabase'

export async function isMatricTaken(matric) {
  if (!isSupabaseConfigured || !supabase) return false
  const { data, error } = await supabase
    .from('students')
    .select('id')
    .eq('matric', matric.trim())
    .maybeSingle()
  if (error) throw error
  return Boolean(data)
}

export async function fetchStudentByUserId(userId) {
  if (!isSupabaseConfigured || !supabase) return null
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function fetchProfile(userId) {
  if (!isSupabaseConfigured || !supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}
