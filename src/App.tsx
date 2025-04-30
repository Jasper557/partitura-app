import React, { useState, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ShortcutProvider } from './context/ShortcutContext'
import { AnimatePresence } from 'framer-motion'
import MainLayout from './layouts/MainLayout'
import { Page } from './types/index'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'

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

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
  </div>
)

// Auth callback handler component
const AuthCallback = () => {
  const { hash, search } = useLocation();
  
  // The hash and search params are automatically processed by Supabase
  // when auth.detectSessionInUrl is true
  
  return <Navigate to="/" replace />;
};

const ProtectedContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('sheet-music')
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingFallback />
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
        <Suspense fallback={<LoadingFallback />}>
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
            <Routes>
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<ProtectedContent />} />
            </Routes>
          </ToastProvider>
        </ShortcutProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App 