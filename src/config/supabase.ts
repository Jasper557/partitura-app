import { createClient } from '@supabase/supabase-js'

// Use environment variables for sensitive data
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const publicUrl = import.meta.env.VITE_PUBLIC_URL || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Determine if we're in development mode
const isDev = import.meta.env.DEV

// Calculate the redirect URL based on environment
const redirectUrl = `${publicUrl || window.location.origin}/auth/callback`

// Create Supabase client with appropriate configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // We're handling the URL manually in our app
    storage: localStorage,
    storageKey: 'partitura-auth',
    flowType: 'pkce', // Use PKCE flow for better security
    debug: isDev // Enable debug mode in development for troubleshooting
  },
  // Configure realtime (WebSocket) settings
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  },
  // Global request settings
  global: {
    headers: {
      'x-client-info': 'partitura-app'
    }
  }
})

// Helper function to get file public URL
export const getPublicUrl = (bucketName: string, path: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path)
  return data.publicUrl
} 