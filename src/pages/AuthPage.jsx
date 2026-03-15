import { useRef } from 'react'
import { AlertCircle } from 'lucide-react'
import { useAurora, useNeural } from '../hooks/useBackground'
import FloatingShapes from '../components/effects/FloatingShapes'

export default function AuthPage({ authError, signIn, signUp, signInWithGoogle }) {
  const auroraRef = useRef(null)
  const neuralRef = useRef(null)
  useAurora(auroraRef)
  useNeural(neuralRef)

  const handleSubmit = async (e, type) => {
    e.preventDefault()
    const email    = e.target.email.value
    const password = e.target.password.value
    if (type === 'signin') await signIn(email, password)
    else await signUp(email, password)
  }

  return (
    <div className="auth-screen">
      {/* Animated backgrounds */}
      <div className="auth-canvas-layer">
        <canvas ref={auroraRef} />
        <canvas ref={neuralRef} style={{ zIndex:1 }} />
      </div>
      <FloatingShapes />
      <div className="auth-glows">
        <div className="glow-tl"/><div className="glow-br"/>
      </div>

      {/* Card */}
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">MARKD</div>
          <div className="auth-tagline">Mark · Track · Analyse</div>
        </div>

        {authError && (
          <div className="error-box">
            <AlertCircle size={14} style={{ flexShrink:0, marginTop:1 }}/>
            {authError}
          </div>
        )}

        <form onSubmit={e => handleSubmit(e, 'signin')}>
          <div className="input-wrap">
            <label className="input-label">Email</label>
            <input name="email" type="email" className="input" placeholder="you@example.com" required autoComplete="email"/>
          </div>
          <div className="input-wrap" style={{ marginBottom:12 }}>
            <label className="input-label">Password</label>
            <input name="password" type="password" className="input" placeholder="••••••••••" required autoComplete="current-password"/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <button type="submit" className="btn btn-primary btn-lg">SIGN IN</button>
            <button type="button" className="btn btn-lg" onClick={e => {
              const form = e.target.closest('form')
              if (form.reportValidity()) {
                const email = form.email.value, password = form.password.value
                signUp(email, password)
              }
            }}>SIGN UP</button>
          </div>
        </form>

        <div className="auth-divider">OR</div>

        <button className="btn btn-lg btn-full" style={{ gap:10 }} onClick={signInWithGoogle}>
          <img src="https://www.google.com/favicon.ico" width="16" height="16" alt="Google"/>
          Continue with Google
        </button>

        <p style={{ marginTop:16, fontSize:10, color:'var(--text-3)', textAlign:'center', letterSpacing:1 }}>
          Google sign-in redirects to this origin automatically.
        </p>
      </div>
    </div>
  )
}
