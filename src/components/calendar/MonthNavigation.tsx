import React from 'react'
import { format, addMonths, subMonths } from 'date-fns'
import { useTheme } from '../../context/ThemeContext'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

interface MonthNavigationProps {
  currentDate: Date
  onDateChange: (date: Date) => void
}

const MonthNavigation: React.FC<MonthNavigationProps> = ({ 
  currentDate,
  onDateChange
}) => {
  const { isDarkMode } = useTheme()
  
  const goToPreviousMonth = () => {
    onDateChange(subMonths(currentDate, 1))
  }
  
  const goToNextMonth = () => {
    onDateChange(addMonths(currentDate, 1))
  }
  
  const goToToday = () => {
    onDateChange(new Date())
  }
  
  return (
    <div className="flex items-center">
      <h1 
        className={`
          text-2xl font-bold mr-4
          ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
        `}
      >
        {format(currentDate, 'MMMM yyyy')}
      </h1>
      <div className="flex space-x-1">
        <button
          onClick={goToPreviousMonth}
          className={`
            p-2 rounded-lg
            ${isDarkMode 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }
            transition-colors
          `}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goToToday}
          className={`
            p-2 rounded-lg
            ${isDarkMode 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }
            transition-colors
          `}
        >
          <CalendarDays size={20} />
        </button>
        <button
          onClick={goToNextMonth}
          className={`
            p-2 rounded-lg
            ${isDarkMode 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }
            transition-colors
          `}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

export default MonthNavigation 