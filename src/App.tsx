import React, { useState, lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ApiStatusProvider } from './context/ApiStatusContext'
import { ShortcutProvider } from './context/ShortcutContext'
import { AnimatePresence } from 'framer-motion'
import MainLayout from './layouts/MainLayout'
import { Page } from './types/index'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import LoadingScreen from './components/LoadingScreen'
import AuthStatusMonitor from './components/AuthStatusMonitor'

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
  
  return <LoadingScreen message="Finalizing authentication" />;
};

const ProtectedContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('sheet-music')
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingScreen message="Connecting to your account" />
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
        <Suspense fallback={<LoadingScreen message="Loading content" />}>
          {renderPage()}
        </Suspense>
      </AnimatePresence>
    </MainLayout>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ShortcutProvider>
          <ToastProvider>
            <ApiStatusProvider>
              <AuthStatusMonitor />
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