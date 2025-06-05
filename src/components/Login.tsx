import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import LoadingScreen from './LoadingScreen'

type AuthMode = 'signin' | 'signup' | 'reset'

interface FormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
}

const Login: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, error, clearError } = useAuth()
  const { isDarkMode } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Clear errors when switching modes
  const handleModeChange = (mode: AuthMode) => {
    setAuthMode(mode)
    clearError()
    setFormErrors({})
    if (mode !== 'reset') {
      setFormData(prev => ({ ...prev, confirmPassword: '' }))
    }
  }

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation for signin/signup
    if (authMode !== 'reset') {
      if (!formData.password) {
        errors.password = 'Password is required'
      } else if (authMode === 'signup' && formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long'
      }

      // Confirm password validation for signup
      if (authMode === 'signup') {
        if (!formData.confirmPassword) {
          errors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match'
        }

        // Name validation for signup
        if (!formData.firstName.trim()) {
          errors.firstName = 'First name is required'
        }
        if (!formData.lastName.trim()) {
          errors.lastName = 'Last name is required'
        }
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
    clearError()
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Google login error:', error)
      setIsLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    clearError()

    try {
      switch (authMode) {
        case 'signin':
          await signInWithEmail(formData.email, formData.password)
          break
        case 'signup':
          await signUpWithEmail(formData.email, formData.password, formData.firstName, formData.lastName)
          break
        case 'reset':
          await resetPassword(formData.email)
          break
      }
    } catch (error) {
      console.error('Email auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingScreen message="Connecting to your account" />
  }

  return (
    <div className={`
      min-h-screen flex items-center justify-center
      ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
      p-4
    `}>
      <div className={`
        max-w-md w-full space-y-6
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        p-8 rounded-xl shadow-lg
      `}>
        {/* Header */}
        <div className="text-center">
          <img
            src="/assets/icon.png"
            alt="Partitura Logo"
            className="mx-auto h-16 w-16"
          />
          <h2 className={`
            mt-6 text-3xl font-bold
            ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
          `}>
            Welcome to Partitura
          </h2>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your sheet music, synchronized across all devices
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
          <button
            onClick={() => handleModeChange('signin')}
            className={`
              flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${authMode === 'signin'
                ? isDarkMode 
                  ? 'bg-gray-800 text-white shadow-sm' 
                  : 'bg-white text-gray-900 shadow-sm'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            Sign In
          </button>
          <button
            onClick={() => handleModeChange('signup')}
            className={`
              flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${authMode === 'signup'
                ? isDarkMode 
                  ? 'bg-gray-800 text-white shadow-sm' 
                  : 'bg-white text-gray-900 shadow-sm'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`
            p-3 rounded-md text-sm
            ${error.includes('created!') || error.includes('reset link')
              ? isDarkMode 
                ? 'bg-green-900/20 text-green-400 border border-green-800' 
                : 'bg-green-50 text-green-700 border border-green-200'
              : isDarkMode 
                ? 'bg-red-900/20 text-red-400 border border-red-800' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }
          `}>
            {error}
          </div>
        )}

        {/* Email Auth Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {/* First Name & Last Name for Sign Up */}
          {authMode === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`
                    w-full px-3 py-2 border rounded-lg shadow-sm
                    ${isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }
                    ${formErrors.firstName 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'focus:border-blue-500 focus:ring-blue-500'
                    }
                    focus:ring-1 focus:outline-none
                  `}
                  placeholder="John"
                />
                {formErrors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`
                    w-full px-3 py-2 border rounded-lg shadow-sm
                    ${isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }
                    ${formErrors.lastName 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'focus:border-blue-500 focus:ring-blue-500'
                    }
                    focus:ring-1 focus:outline-none
                  `}
                  placeholder="Doe"
                />
                {formErrors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
                )}
              </div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`
                w-full px-3 py-2 border rounded-lg shadow-sm
                ${isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }
                ${formErrors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'focus:border-blue-500 focus:ring-blue-500'
                }
                focus:ring-1 focus:outline-none
              `}
              placeholder="you@example.com"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          {/* Password Input */}
          {authMode !== 'reset' && (
            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`
                    w-full px-3 py-2 pr-10 border rounded-lg shadow-sm
                    ${isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }
                    ${formErrors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'focus:border-blue-500 focus:ring-blue-500'
                    }
                    focus:ring-1 focus:outline-none
                  `}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`
                    absolute inset-y-0 right-0 pr-3 flex items-center
                    ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}
                  `}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>
          )}

          {/* Confirm Password Input */}
          {authMode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`
                    w-full px-3 py-2 pr-10 border rounded-lg shadow-sm
                    ${isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }
                    ${formErrors.confirmPassword 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'focus:border-blue-500 focus:ring-blue-500'
                    }
                    focus:ring-1 focus:outline-none
                  `}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`
                    absolute inset-y-0 right-0 pr-3 flex items-center
                    ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}
                  `}
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`
              w-full py-3 px-4 rounded-lg text-sm font-medium
              bg-blue-600 hover:bg-blue-700 text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            disabled={isLoading}
          >
            {authMode === 'signin' && 'Sign In'}
            {authMode === 'signup' && 'Create Account'}
            {authMode === 'reset' && 'Send Reset Link'}
          </button>
        </form>

        {/* Forgot Password Link */}
        {authMode === 'signin' && (
          <div className="text-center">
            <button
              onClick={() => handleModeChange('reset')}
              className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              Forgot your password?
            </button>
          </div>
        )}

        {/* Back to Sign In Link */}
        {authMode === 'reset' && (
          <div className="text-center">
            <button
              onClick={() => handleModeChange('signin')}
              className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              Back to sign in
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          className={`
            group relative w-full flex justify-center
            py-3 px-4 rounded-lg text-sm font-medium
            ${isDarkMode 
              ? 'bg-white text-gray-900 hover:bg-gray-100' 
              : 'bg-white text-gray-900 hover:bg-gray-50'
            }
            border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition-colors duration-200
          `}
        >
          <span className="flex items-center">
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
            Continue with Google
          </span>
        </button>
      </div>
    </div>
  )
}

export default Login 