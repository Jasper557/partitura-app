import React, { ReactNode, useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import Sidebar from '../components/Sidebar'
import { Page } from '../types/index'

interface MainLayoutProps {
  children: ReactNode
  currentPage: Page
  onNavigate: (page: Page) => void
  isSidebarExpanded: boolean
  onSidebarExpandedChange: (expanded: boolean) => void
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
  isSidebarExpanded,
  onSidebarExpandedChange
}) => {
  const { isDarkMode } = useTheme()
  const mainRef = useRef<HTMLElement>(null)

  // Reset scroll position when page changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0
    }
  }, [currentPage])

  return (
    <div className={`h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={onNavigate}
        isExpanded={isSidebarExpanded}
        onExpandedChange={onSidebarExpandedChange}
      />
      <main 
        ref={mainRef}
        className={`
        transition-all duration-300
        ${isSidebarExpanded ? 'ml-72' : 'ml-28'}
          h-screen overflow-y-auto
        p-8
        `}
      >
        {children}
      </main>
    </div>
  )
}

export default MainLayout 