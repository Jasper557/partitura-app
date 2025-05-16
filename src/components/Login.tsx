import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

// Loading spinner component with dark mode support
const LoadingSpinner: React.FC<{ size?: string; color?: string }> = ({ 
  size = "w-4 h-4", 
  color 
}) => {
  const { isDarkMode } = useTheme()
  const spinnerColor = color || (isDarkMode ? 'text-blue-300' : 'text-white')
  
  return (
    <svg className={`animate-spin ${size} ${spinnerColor}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
}

const Login: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth()
  const { isDarkMode } = useTheme()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      console.log(`Attempting ${isResetPassword ? 'password reset' : (isSignUp ? 'sign up' : 'sign in')} with email: ${email}`)
      
      if (isResetPassword) {
        const { error } = await resetPassword(email)
        console.log('Reset password result:', error)
        if (error) {
          setError(error)
        } else {
          setResetSent(true)
        }
      } else {
        const result = isSignUp
          ? await signUpWithEmail(email, password)
          : await signInWithEmail(email, password)
        
        console.log(`${isSignUp ? 'Sign up' : 'Sign in'} result:`, result)
        
        if (result.error) {
          setError(result.error)
        }
      }
    } catch (err) {
      console.error('Authentication error:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setIsResetPassword(false)
    setResetSent(false)
    setError(null)
  }

  return (
    <div className={`
      min-h-screen flex items-center justify-center
      ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
      p-4
    `}>
      <div className={`
        max-w-md w-full space-y-8
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        p-8 rounded-xl shadow-lg
      `}>
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
            {isResetPassword 
              ? 'Reset your password'
              : 'Sign in to access your sheet music from anywhere'}
          </p>
        </div>

        {isResetPassword ? (
          // Password Reset Form
          <form className="mt-8 space-y-6" onSubmit={handleEmailAuth}>
            {resetSent ? (
              <div className="text-center">
                <div className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-4`}>
                  If an account exists with this email, you will receive password reset instructions.
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className={`
                    w-full flex justify-center py-2 px-4 rounded-lg text-sm font-medium
                    ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
                    text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    transition-colors duration-200
                  `}
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`
                      mt-1 appearance-none relative block w-full px-3 py-2 
                      border ${isDarkMode ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} 
                      placeholder-gray-500 rounded-lg focus:outline-none 
                      focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm
                    `}
                    placeholder="Email address"
                  />
                </div>
                
                {error && (
                  <div className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                    {error}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`
                      group relative w-full flex justify-center items-center
                      py-2 px-4 rounded-lg text-sm font-medium
                      ${isDarkMode 
                        ? `bg-blue-600 ${isLoading ? '' : 'hover:bg-blue-700'}` 
                        : `bg-blue-500 ${isLoading ? '' : 'hover:bg-blue-600'}`}
                      text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      transition-all duration-200 
                      ${isLoading ? 'bg-opacity-80' : ''}
                    `}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <LoadingSpinner />
                        <span className="ml-2">Sending...</span>
                      </span>
                    ) : 'Send reset instructions'}
                  </button>
                </div>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={resetForm}
                    className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                  >
                    Back to sign in
                  </button>
                </div>
              </>
            )}
          </form>
        ) : (
          // Login/Signup Form
          <>
            <form className="mt-8 space-y-6" onSubmit={handleEmailAuth}>
              <div className="rounded-md space-y-4">
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`
                      mt-1 appearance-none relative block w-full px-3 py-2 
                      border ${isDarkMode ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} 
                      placeholder-gray-500 rounded-lg focus:outline-none 
                      focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm
                    `}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`
                      mt-1 appearance-none relative block w-full px-3 py-2 
                      border ${isDarkMode ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} 
                      placeholder-gray-500 rounded-lg focus:outline-none 
                      focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm
                    `}
                    placeholder="Password"
                  />
                </div>
              </div>
              
              {error && (
                <div className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </button>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setIsResetPassword(true)}
                    className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    group relative w-full flex justify-center items-center
                    py-2 px-4 rounded-lg text-sm font-medium
                    ${isDarkMode 
                      ? `bg-blue-600 ${isLoading ? '' : 'hover:bg-blue-700'}` 
                      : `bg-blue-500 ${isLoading ? '' : 'hover:bg-blue-600'}`}
                    text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    transition-all duration-200
                    ${isLoading ? 'bg-opacity-80' : ''}
                  `}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <LoadingSpinner />
                      <span className="ml-2">{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                    </span>
                  ) : (isSignUp ? 'Sign up' : 'Sign in')}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}>
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={signInWithGoogle}
                  disabled={isLoading}
                  className={`
                    group relative w-full flex justify-center items-center
                    py-3 px-4 rounded-lg text-sm font-medium
                    ${isDarkMode 
                      ? `bg-white text-gray-900 ${isLoading ? '' : 'hover:bg-gray-100'}` 
                      : `bg-white text-gray-900 ${isLoading ? '' : 'hover:bg-gray-50'}`
                    }
                    border border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    transition-colors duration-200
                    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <LoadingSpinner color={isDarkMode ? 'text-gray-600' : 'text-gray-600'} />
                      <span className="ml-2">Connecting...</span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5 mr-3"
                      />
                      Sign in with Google
                    </span>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your sheet music, synchronized across all devices
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login 