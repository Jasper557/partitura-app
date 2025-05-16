import React from 'react'
import { Music, Calendar, Settings, BarChart } from 'lucide-react'
import NavItem from './NavItem'
import { useTheme } from '../context/ThemeContext'
import { SidebarProps } from '../types/index'

const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  onNavigate, 
  isExpanded, 
  onExpandedChange 
}) => {
  const { isDarkMode } = useTheme()
  const toggleSidebar = () => onExpandedChange(!isExpanded)

  return (
    <aside className={`
      fixed top-4 left-4 h-[calc(100vh-2rem)] 
      ${isDarkMode 
        ? 'bg-gray-800 text-gray-100 border-gray-700' 
        : 'bg-white text-gray-600 border-gray-200'
      }
      transition-all duration-300
      ease-in-out
      flex flex-col
      rounded-xl shadow-lg
      overflow-hidden
      border
      will-change-[width,transform]
      ${isExpanded ? 'w-60' : 'w-20'}
    `}>
      <div className={`
        flex items-center p-4 cursor-pointer
        ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}
        border-b
        transition-colors duration-300 ease-in-out
        hover:brightness-110
        group
      `}
      onClick={toggleSidebar}
      >
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
          <img 
            src="/assets/icon.png"
            alt="Partitura Logo"
            className={`
              w-10 h-10
              transition-transform duration-300
              group-hover:scale-105
              ${isExpanded ? '' : 'rotate-360'}
            `}
          />
        </div>
        <div className={`
          ml-3
          transition-all duration-300 ease-in-out
          whitespace-nowrap
          ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5 absolute'}
        `}>
          <h1 className={`
            text-xl font-bold
            ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}
          `}>
            Partitura
          </h1>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-4">
          <NavItem 
            icon={<Music size={24} />} 
            text="Sheet Music" 
            isExpanded={isExpanded}
            isActive={currentPage === 'sheet-music'}
            onClick={() => onNavigate('sheet-music')}
          />
          <NavItem 
            icon={<Calendar size={24} />} 
            text="Calendar" 
            isExpanded={isExpanded}
            isActive={currentPage === 'calendar'}
            onClick={() => onNavigate('calendar')}
          />
          <NavItem 
            icon={<BarChart size={24} />} 
            text="Dashboard" 
            isExpanded={isExpanded}
            isActive={currentPage === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
          />
        </ul>
      </nav>

      <div className={`
        p-4 
        ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}
        border-t
      `}>
        <ul className="list-none">
          <NavItem 
            icon={<Settings size={24} />} 
            text="Settings" 
            isExpanded={isExpanded}
            isActive={currentPage === 'settings'}
            onClick={() => onNavigate('settings')}
          />
        </ul>
      </div>
    </aside>
  )
}

export default React.memo(Sidebar) 