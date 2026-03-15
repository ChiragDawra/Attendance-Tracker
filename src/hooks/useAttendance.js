import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_DATA } from '../constants'

const LS_KEY = 'markd_v1'

export function useAttendance(user) {
  const [data,       setData]       = useState(DEFAULT_DATA)
  const [syncStatus, setSyncStatus] = useState('synced') // 'synced' | 'syncing' | 'error'
  const [dataLoading, setDataLoading] = useState(true)

  const isFirstLoad = useRef(true)
  const saveTimer   = useRef(null)

  // ── Load from Supabase when user logs in ──
  useEffect(() => {
    if (!user) { setDataLoading(false); return }

    const load = async () => {
      setDataLoading(true)
      try {
        const { data: remote, error } = await supabase
          .from('attendance_data')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') throw error

        if (remote) {
          setData({
            subjects:        remote.subjects         || [],
            timetable:       remote.timetable        || DEFAULT_DATA.timetable,
            attendance:      remote.attendance       || {},
            dailyLog:        remote.daily_log        || {},
            phase:           remote.phase            || 'setup',
            lectureSettings: remote.lecture_settings || DEFAULT_DATA.lectureSettings,
          })
        } else {
          // First time user — create empty row
          await supabase.from('attendance_data').insert([{
            user_id:    user.id,
            ...DEFAULT_DATA,
            updated_at: new Date().toISOString(),
          }])
          setData(DEFAULT_DATA)
        }
        setSyncStatus('synced')
      } catch {
        setSyncStatus('error')
        const local = localStorage.getItem(LS_KEY)
        if (local) setData(JSON.parse(local))
      } finally {
        setDataLoading(false)
        isFirstLoad.current = false
      }
    }
    load()
  }, [user])

  // ── Debounced cloud save whenever data changes ──
  useEffect(() => {
    if (isFirstLoad.current || !user) return
    localStorage.setItem(LS_KEY, JSON.stringify(data))
    setSyncStatus('syncing')
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        const { error } = await supabase.from('attendance_data').upsert({
          user_id:          user.id,
          subjects:         data.subjects,
          timetable:        data.timetable,
          attendance:       data.attendance,
          daily_log:        data.dailyLog || {},
          phase:            data.phase,
          lecture_settings: data.lectureSettings || DEFAULT_DATA.lectureSettings,
          updated_at:       new Date().toISOString(),
        })
        if (error) throw error
        setSyncStatus('synced')
      } catch {
        setSyncStatus('error')
      }
    }, 1000)
    return () => clearTimeout(saveTimer.current)
  }, [data.subjects, data.timetable, data.attendance, data.phase, user]) // eslint-disable-line

  // ── Hard reset ──
  const resetData = async () => {
    try {
      if (user) await supabase.from('attendance_data').delete().eq('user_id', user.id)
      localStorage.removeItem(LS_KEY)
      setData(DEFAULT_DATA)
      isFirstLoad.current = false
    } catch {
      setSyncStatus('error')
    }
  }

  return { data, setData, syncStatus, dataLoading, resetData }
}
