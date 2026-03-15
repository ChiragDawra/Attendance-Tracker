import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user,      setUser]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    // Grab existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => setLoading(false))

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  /** Email/password sign-in */
  const signIn = async (email, password) => {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setAuthError(error.message); throw error }
  }

  /** Email/password sign-up */
  const signUp = async (email, password) => {
    setAuthError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setAuthError(error.message); throw error }
  }

  /**
   * Google OAuth — FIX: pass `redirectTo: window.location.origin` so Supabase
   * always redirects back to whatever environment the app is running in
   * (http://localhost:5173 in dev, production URL in prod).
   *
   * You ALSO need to add those URLs in Supabase dashboard:
   *   Authentication → URL Configuration → Redirect URLs
   */
  const signInWithGoogle = async () => {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) { setAuthError(error.message); throw error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, authError, setAuthError, signIn, signUp, signInWithGoogle, signOut }
}
