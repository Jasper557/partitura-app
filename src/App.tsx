import React, { useState, lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ApiStatusProvider } from './context/ApiStatusContext'
import { ShortcutProvider } from './context/ShortcutContext'
import { AnimatePresence, motion } from 'framer-motion'
import MainLayout from './layouts/MainLayout'
import { Page } from './types/index'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import Login from './components/Login'
import { API_URL } from './config/api'

// Lazy load components
const SheetMusic = lazy(() => import('./pages/SheetMusic'))
const Practice = lazy(() => import('./pages/Practice'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))
const Documentation = lazy(() => import('./pages/Documentation'))
const KeyboardShortcuts = lazy(() => import('./pages/KeyboardShortcuts'))
const ContactSupport = lazy(() => import('./pages/ContactSupport'))
const PrivacySettings = lazy(() => import('./pages/PrivacySettings'))
const NotificationSettings = lazy(() => import('./pages/NotificationSettings'))

// Creative loading component using brand colors
const CreativeLoader = () => {
  const { isDarkMode } = useTheme();
  
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const dotBaseClasses = "w-4 h-4 rounded-full";
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`min-h-screen flex flex-col items-center justify-center ${bgColor}`}
    >
      <div className="relative h-24 w-24">
        {/* Outer rotating circle with brand colors */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          <motion.div className={`${dotBaseClasses} absolute top-0 left-1/2 -translate-x-1/2 bg-green-400 shadow-lg shadow-green-400/30`} />
          <motion.div className={`${dotBaseClasses} absolute top-1/2 right-0 -translate-y-1/2 bg-blue-400 shadow-lg shadow-blue-400/30`} />
          <motion.div className={`${dotBaseClasses} absolute bottom-0 left-1/2 -translate-x-1/2 bg-orange-400 shadow-lg shadow-orange-400/30`} />
          <motion.div className={`${dotBaseClasses} absolute top-1/2 left-0 -translate-y-1/2 bg-blue-300 shadow-lg shadow-blue-300/30`} />
        </motion.div>
        
        {/* Inner rotating ring (opposite direction) */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full"
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          style={{ scale: 0.65 }}
        >
          <motion.div 
            className={`${dotBaseClasses} absolute top-0 left-1/2 -translate-x-1/2 bg-blue-300 shadow-lg shadow-blue-300/20 w-3 h-3`}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className={`${dotBaseClasses} absolute top-1/2 right-0 -translate-y-1/2 bg-green-300 shadow-lg shadow-green-300/20 w-3 h-3`}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
          <motion.div 
            className={`${dotBaseClasses} absolute bottom-0 left-1/2 -translate-x-1/2 bg-orange-300 shadow-lg shadow-orange-300/20 w-3 h-3`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          />
          <motion.div 
            className={`${dotBaseClasses} absolute top-1/2 left-0 -translate-y-1/2 bg-blue-200 shadow-lg shadow-blue-200/20 w-3 h-3`}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
          />
        </motion.div>
      </div>
      
      <motion.p 
        className={`mt-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Loading your music...
      </motion.p>
    </motion.div>
  );
};

// Auth callback handler component
const AuthCallback = () => {
  const { hash, search } = useLocation();
  
  // Add debug console logs to help identify issues
  console.log('Auth callback received', { hash, search });
  
  // Force reload to ensure the session is properly loaded
  useEffect(() => {
    // Give Supabase a moment to process the auth callback
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }, []);
  
  return <CreativeLoader />;
};

const ProtectedContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('sheet-music')
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <CreativeLoader />
  }

  if (!user) {
    return <Login />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'sheet-music':
        return <SheetMusic key="sheet-music" />
      case 'dashboard':
        return <Dashboard key="dashboard" />
      case 'calendar':
        return <Calendar key="calendar" />
      case 'settings':
        return <Settings key="settings" onNavigate={setCurrentPage} />
      case 'documentation':
        return <Documentation key="documentation" onNavigate={setCurrentPage} />
      case 'keyboard-shortcuts':
        return <KeyboardShortcuts key="keyboard-shortcuts" onNavigate={setCurrentPage} />
      case 'contact-support':
        return <ContactSupport key="contact-support" onNavigate={setCurrentPage} />
      case 'privacy-settings':
        return <PrivacySettings key="privacy-settings" onNavigate={setCurrentPage} />
      case 'notifications':
        return <NotificationSettings key="notifications" onNavigate={setCurrentPage} />
      default:
        return <SheetMusic key="sheet-music-default" />
    }
  }

  return (
    <MainLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      isSidebarExpanded={isSidebarExpanded}
      onSidebarExpandedChange={setIsSidebarExpanded}
    >
      <AnimatePresence mode="wait">
        <Suspense fallback={<CreativeLoader />}>
          {renderPage()}
        </Suspense>
      </AnimatePresence>
    </MainLayout>
  )
}

const App: React.FC = () => {
  // Log the API URL to verify our environment detection works
  console.log('APP ENVIRONMENT:', import.meta.env.PROD ? 'Production' : 'Development');
  console.log('API URL being used:', API_URL);

  return (
    <AuthProvider>
      <ThemeProvider>
        <ShortcutProvider>
          <ToastProvider>
            <ApiStatusProvider>
              <Routes>
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="*" element={<ProtectedContent />} />
              </Routes>
            </ApiStatusProvider>
          </ToastProvider>
        </ShortcutProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App 