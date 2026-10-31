import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button, Input, Alert, Card, Spinner } from '../components/ui'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin') // 'signin' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    async function checkExistingSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (session?.user) {
          setCurrentUser(session.user)
        }
      } catch (err) {
        console.error('Session check error:', err)
      } finally {
        setCheckingAuth(false)
      }
    }
    checkExistingSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user)
      } else {
        setCurrentUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.')
      return
    }

    setLoading(true)

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        if (data?.user) {
          navigate('/admin/dashboard')
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        if (data?.user) {
          setSuccessMsg('Account created successfully! You may now access the staff dashboard if your email is registered on the staff authorization list.')
          setMode('signin')
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      setCurrentUser(null)
      setSuccessMsg('Signed out successfully.')
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign out.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--section-py) var(--gutter)' }}>
      <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
        
        {currentUser ? (
          <Card padding="lg">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span className="eyebrow">Staff Portal</span>
              <h2 style={{ fontSize: '1.5rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>Already Signed In</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Signed in as <strong style={{ color: 'var(--text)' }}>{currentUser.email}</strong>
              </p>
            </div>

            {errorMsg && <Alert variant="error" title="Error" style={{ marginBottom: '1rem' }}>{errorMsg}</Alert>}
            {successMsg && <Alert variant="success" title="Notice" style={{ marginBottom: '1rem' }}>{successMsg}</Alert>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Link to="/admin/dashboard" className="btn btn-primary" style={{ textAlign: 'center', width: '100%' }}>
                Go to Staff Dashboard
              </Link>
              <Button variant="ghost" onClick={handleSignOut} disabled={loading} style={{ width: '100%' }}>
                {loading ? <Spinner size="sm" /> : 'Sign Out'}
              </Button>
            </div>
          </Card>
        ) : (
          <Card padding="lg">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span className="eyebrow">BrightSmile Dental Studio</span>
              <h1 style={{ fontSize: '1.65rem', marginTop: '0.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                {mode === 'signin' ? 'Staff Portal Sign In' : 'Register Staff Account'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.4' }}>
                Authorized access only. Staff member emails are verified against clinic credentials.
              </p>
            </div>

            {errorMsg && (
              <Alert variant="error" title="Authentication Error" style={{ marginBottom: '1.25rem' }}>
                {errorMsg}
              </Alert>
            )}

            {successMsg && (
              <Alert variant="success" title="Success" style={{ marginBottom: '1.25rem' }}>
                {successMsg}
              </Alert>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Input
                label="Email address"
                type="email"
                name="email"
                placeholder="dentist@brightsmile.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                {mode === 'signin' ? 'Sign In to Portal' : 'Create Staff Account'}
              </Button>
            </form>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              {mode === 'signin' ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                  First time signing in?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup')
                      setErrorMsg('')
                      setSuccessMsg('')
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Create your staff account
                  </button>
                </p>
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
                  Already have a staff account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin')
                      setErrorMsg('')
                      setSuccessMsg('')
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Back to Sign In
                  </button>
                </p>
              )}
            </div>

            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                ← Return to Clinic Homepage
              </Link>
            </div>
          </Card>
        )}

      </div>
    </div>
  )
}