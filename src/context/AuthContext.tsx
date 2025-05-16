import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../config/supabase'
import axios from 'axios'
import { invoke } from '@tauri-apps/api/core'
import { buildApiUrl, apiRequest } from '../config/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
  refreshSession: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Use a fixed port for authentication callbacks to match OAuth provider configuration
const AUTH_CALLBACK_PORT = 43123

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const apiUrl = import.meta.env.PROD 
    ? 'https://partitura-api.onrender.com' 
    : (import.meta.env.VITE_API_URL || 'http://localhost:3001')

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        // If we have a session but it's close to expiration, refresh it
        if (session && shouldRefreshSession(session)) {
          await refreshSession()
        }
      } catch (err) {
        console.error('Error initializing auth session:', err)
      } finally {
        setLoading(false)
      }
    }
    
    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Helper to determine if we should refresh the session
  const shouldRefreshSession = (session: any) => {
    if (!session?.expires_at) return false
    
    // Refresh if token expires in less than 10 minutes
    const expiresAt = session.expires_at * 1000 // Convert to milliseconds
    const tenMinutesFromNow = Date.now() + 10 * 60 * 1000
    
    return expiresAt < tenMinutesFromNow
  }

  // Function to refresh the session
  const refreshSession = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Failed to refresh session:', error)
        return false
      }
      
      if (data.session) {
        // Session refreshed successfully
        return true
      }
      
      return false
    } catch (err) {
      console.error('Error refreshing session:', err)
      return false
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the fixed port for the callback
      const localPort = AUTH_CALLBACK_PORT
      const callbackUrl = `http://localhost:${localPort}/auth-callback`
      
      try {
        // Get the OAuth URL from our API
        const response = await axios.get(buildApiUrl('/auth/google/url'), {
          params: { redirectUrl: callbackUrl }
        })
        
        const { url } = response.data
        
        // Open URL using the Tauri command
        try {
          await invoke('open_url_in_browser', { url })
        } catch (err) {
          // Fallback to browser open if Tauri command fails
          window.open(url, "_blank")
        }
        
        // Now we need to listen for the callback on our local server
        try {
          // This will receive the access_token directly
          const accessToken = await invoke<string>('listen_for_auth_callback', { 
            port: localPort,
            timeout: 300 // 5 minutes timeout
          })
          
          if (!accessToken) {
            throw new Error("No access token received")
          }
          
          // The token we get is from Google. We need to exchange it for a Supabase session
          const response = await axios.post(buildApiUrl('/auth/session'), {
            code: accessToken
          })
          
          if (!response.data || !response.data.session) {
            throw new Error("Failed to exchange token for session")
          }
          
          // Set the full session data
          const sessionData = response.data.session;
          
          // Check if we have a full session or just a user
          if (sessionData.access_token && sessionData.user) {
            // Store session directly in localStorage
            const storageKey = 'partitura-auth';
            
            // Create a properly formatted session object
            const sessionObject = {
              access_token: sessionData.access_token,
              refresh_token: sessionData.refresh_token || '',
              user: sessionData.user,
              expires_at: Date.now() + (3600 * 1000), // Default 1 hour expiration
              expires_in: 3600 // 1 hour in seconds
            };
            
            // Store the session
            localStorage.setItem(storageKey, JSON.stringify(sessionObject));
            
            // Set the user state directly from the session data
            setUser(sessionData.user);
          } else {
            throw new Error("Invalid session data");
          }
        } catch (err) {
          console.error("Error during auth callback:", err)
          setError("Authentication failed. Please try again.")
          throw err
        }
      } catch (axiosError) {
        console.error('Error in authentication process:', axiosError)
        setError("Failed to complete authentication. Please try again.")
        throw axiosError
      }
    } catch (error) {
      setError("Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const signInWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Signing in with email:', email)
      
      try {
        // Call our API endpoint for email sign-in
        const response = await fetch(buildApiUrl('/auth/email/signin'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        })
        
        const data = await response.json()
        console.log('Sign in response:', data)
        
        // Handle successful login
        if (response.ok && data && data.session) {
          const sessionData = data.session
          
          // Store session in localStorage
          const storageKey = 'partitura-auth'
          const sessionObject = {
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token || '',
            user: sessionData.user,
            expires_at: sessionData.expires_at || (Date.now() + 3600 * 1000),
            expires_in: sessionData.expires_in || 3600
          }
          
          localStorage.setItem(storageKey, JSON.stringify(sessionObject))
          
          // Set the user state
          setUser(sessionData.user)
          return { error: null }
        }
        
        return { error: data.error || 'Could not sign in with the provided credentials' }
      } catch (error: any) {
        console.error('Email sign in error:', error)
        return { error: 'Authentication failed. Please try again.' }
      }
    } catch (error: any) {
      console.error('Email sign in error:', error)
      const errorMessage = error.message || 'Authentication failed. Please try again.'
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Signing up with email:', email)
      
      try {
        // Call our API endpoint for email sign-up
        const response = await fetch(buildApiUrl('/auth/email/signup'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        })
        
        const data = await response.json()
        console.log('Sign up response:', data)
        
        // If signup is successful but requires email confirmation
        if (response.ok && data && data.requiresEmailConfirmation) {
          return { error: null }
        }
        
        // Handle successful signup with immediate login
        if (response.ok && data && data.session) {
          const sessionData = data.session
          
          // Store session in localStorage
          const storageKey = 'partitura-auth'
          const sessionObject = {
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token || '',
            user: sessionData.user,
            expires_at: sessionData.expires_at || (Date.now() + 3600 * 1000),
            expires_in: sessionData.expires_in || 3600
          }
          
          localStorage.setItem(storageKey, JSON.stringify(sessionObject))
          
          // Set the user state
          setUser(sessionData.user)
          return { error: null }
        }
        
        return { error: data.error || 'Could not sign up with the provided credentials' }
      } catch (error: any) {
        console.error('Email sign up error:', error)
        return { error: 'Registration failed. Please try again.' }
      }
    } catch (error: any) {
      console.error('Email sign up error:', error)
      const errorMessage = error.message || 'Signup failed. Please try again.'
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Requesting password reset for:', email)
      
      try {
        // Call our API endpoint for password reset
        const response = await fetch(buildApiUrl('/auth/email/reset-password'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        })
        
        const data = await response.json()
        console.log('Password reset response:', data)
        
        if (response.ok) {
          return { error: null }
        }
        
        return { error: data.error || 'Password reset failed. Please try again.' }
      } catch (error: any) {
        console.error('Password reset error:', error)
        return { error: 'Password reset failed. Please try again.' }
      }
    } catch (error: any) {
      console.error('Password reset error:', error)
      const errorMessage = error.message || 'Password reset failed. Please try again.'
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Force user state update first
      setUser(null)

      // Clear all local storage
      localStorage.clear()
      sessionStorage.clear()

      // Try to sign out from Supabase, but don't wait for it
      supabase.auth.signOut().catch(() => {
        // Ignore errors during sign out
      })

      // Force reload to clear any cached state
      window.location.reload()
    } catch (error) {
      // Even if there's an error, force a reload
      window.location.reload()
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      logout, 
      refreshSession 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 