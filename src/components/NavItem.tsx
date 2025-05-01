import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { NavItemProps } from '../types/index'

const NavItem: React.FC<NavItemProps> = ({ icon, text, isExpanded, isActive = false, onClick }) => {
  const { isDarkMode } = useTheme()

  const getIconAnimation = () => {
    if (text === 'Settings') {
      return 'transition-transform duration-300 group-hover:rotate-90'
    }
    return 'transition-transform duration-300 group-hover:scale-110'
  }

  return (
    <li>
      <button 
        onClick={onClick}
        className={`
          w-full flex items-center ${isExpanded ? 'justify-start' : 'justify-center'} p-3 rounded-lg
          transition-colors duration-200
          focus:outline-none
          ${isDarkMode
            ? `${isActive 
                ? 'text-blue-400' 
                : 'text-gray-300 hover:text-blue-400'
              }`
            : `${isActive 
                ? 'text-blue-600' 
                : 'text-gray-600 hover:text-blue-600'
              }`
          }
          relative group
        `}
      >
        {/* Active indicator background */}
        {isActive && (
          <span className={`
            absolute inset-0 rounded-lg opacity-20
            ${isDarkMode ? 'bg-blue-500' : 'bg-blue-100'}
          `}></span>
        )}
        
        <span className={`
          z-10 flex-shrink-0 inline-flex justify-center items-center w-8 h-8
          ${getIconAnimation()}
          ${isActive ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : ''}
        `}>
          {icon}
        </span>
        
        {isExpanded && (
          <div className="ml-3 overflow-hidden whitespace-nowrap z-10 transition-all duration-300 ease-in-out">
            <span className="font-medium">{text}</span>
          </div>
        )}
      </button>
    </li>
  )
}

export default NavItem 