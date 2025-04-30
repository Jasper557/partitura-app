import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeContextType } from '../types/index'
import { useAuth } from './AuthContext'
import { getUserPreferences, updateUserPreferences } from '../services/userService'

/**
 * Context for managing theme state across the application.
 * Provides dark mode state and toggle functionality.
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Provider component that manages theme state and syncs with the API.
 * - Initializes with system preference
 * - Loads user preference when logged in
 * - Syncs changes to database via API
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with system preference
  const [isDarkMode, setIsDarkMode] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const { user } = useAuth()

  /**
   * Load user's theme preference from API on login
   */
  useEffect(() => {
    const loadThemePreference = async () => {
      if (!user) return

      try {
        const prefs = await getUserPreferences(user.id)
        
        if (prefs) {
          setIsDarkMode(prefs.theme === 'dark')
        }
      } catch (error) {
        console.error('Theme preference error:', error)
      }
    }

    loadThemePreference()
  }, [user])

  /**
   * Toggle theme and sync with API
   */
  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode
      
      if (user) {
        await updateUserPreferences(user.id, {
          theme: newTheme ? 'dark' : 'light'
        })
      }

      setIsDarkMode(newTheme)
    } catch (error) {
      console.error('Theme toggle error:', error)
    }
  }

  /**
   * Apply theme to document
   */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access theme context
 * @throws {Error} When used outside of ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 