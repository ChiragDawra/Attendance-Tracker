import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user,       setUser]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [authError,  setAuthError]  = useState(null)
  const [signUpDone, setSignUpDone] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    setAuthError(null)
    setSignUpDone(false)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setAuthError(error.message); throw error }
  }

  const signUp = async (email, password) => {
    setAuthError(null)
    setSignUpDone(false)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setAuthError(error.message); throw error }
    // Supabase sends a confirmation email — flag it so UI can show feedback
    setSignUpDone(true)
  }

  /**
   * Google OAuth — always pass redirectTo: window.location.origin
   * so Supabase redirects back to localhost in dev, prod URL in prod.
   *
   * ── REQUIRED in Supabase dashboard ──────────────────────────────────
   * Authentication → URL Configuration → Redirect URLs → Add:
   *   http://localhost:5173
   *   http://localhost:5174
   *   https://your-production-url.vercel.app
   * Without adding these, Supabase ignores redirectTo and uses its
   * hardcoded Site URL (your old Vercel deployment).
   * ────────────────────────────────────────────────────────────────────
   */
  const signInWithGoogle = async () => {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) { setAuthError(error.message); throw error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    user, loading, authError, setAuthError,
    signUpDone, setSignUpDone,
    signIn, signUp, signInWithGoogle, signOut,
  }
}