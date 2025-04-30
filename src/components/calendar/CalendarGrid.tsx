import React from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay,
  parseISO,
  isToday
} from 'date-fns'
import { useTheme } from '../../context/ThemeContext'
import { PracticeEvent, EventType } from '../../types/index'
import { Music2, Mic2, BookOpen, Users, Music, LucideIcon } from 'lucide-react'

// Event type icons
const eventTypeIcons: Record<EventType, LucideIcon> = {
  practice: Music2,
  concert: Mic2,
  lesson: BookOpen,
  rehearsal: Users,
  recital: Music
}

interface CalendarGridProps {
  currentDate: Date
  events: PracticeEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: PracticeEvent) => void
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  currentDate, 
  events, 
  onDateClick,
  onEventClick 
}) => {
  const { isDarkMode } = useTheme()
  
  // Get all days in month view, including days from previous/next months to fill grid
  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)
    
    const rows = []
    let days = []
    let day = startDate
    
    // Generate array of dates
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(day)
        day = addDays(day, 1)
      }
      rows.push(days)
      days = []
    }
    
    return rows
  }
  
  // Group events by date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return isSameDay(date, eventDate);
    })
  }
  
  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, 'd')
  }
  
  const renderEvents = (date: Date) => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.startTime);
      return isSameDay(date, eventDate);
    })
    
    // If no events, return empty div
    if (dayEvents.length === 0) {
      return <div className="mt-1"></div>;
    }
    
    return (
      <div className="mt-1 space-y-1">
        {dayEvents.map(event => {
          const Icon = eventTypeIcons[event.type] || eventTypeIcons.practice;
          
          return (
            <button
              key={event.id}
              onClick={(e) => {
                e.stopPropagation()
                onEventClick(event)
              }}
              className={`
                w-full text-left px-1 py-0.5 rounded text-xs truncate
                ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
                ${event.isCompleted ? 'opacity-50' : ''}
              `}
              style={{ backgroundColor: event.color || '#3B82F6' }}
            >
              <div className="flex items-center gap-1">
                <Icon size={12} className="flex-shrink-0" />
                <span className="truncate">{event.title}</span>
              </div>
            </button>
          )
        })}
      </div>
    )
  }
  
  return (
    <div className="w-full">
      {/* Header row with weekday names */}
      <div className="grid grid-cols-7 mb-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div 
            key={index}
            className={`
              py-2 text-sm font-medium
              ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}
            `}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid">
        {getDaysInMonth().map((week, weekIndex) => (
          <div 
            key={weekIndex} 
            className="grid grid-cols-7"
          >
            {week.map((day, dayIndex) => {
              const eventsForDay = getEventsForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isSelectedDay = isSameDay(day, currentDate)
              const isTodayDate = isToday(day)
              
              return (
                <div
                  key={dayIndex}
                  onClick={() => onDateClick(day)}
                  className={`
                    min-h-[100px] p-1 border-t border-l
                    ${weekIndex === 5 ? 'border-b' : ''}
                    ${dayIndex === 6 ? 'border-r' : ''}
                    ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
                    ${isCurrentMonth 
                      ? isDarkMode ? 'bg-gray-800' : 'bg-white' 
                      : isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                    }
                    ${isSelectedDay 
                      ? isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50' 
                      : ''
                    }
                    transition-colors duration-200
                    cursor-pointer
                  `}
                >
                  <div className="flex flex-col h-full">
                    {/* Date number */}
                    <div 
                      className={`
                        text-sm font-medium mb-1 h-6 w-6 flex items-center justify-center rounded-full
                        ${!isCurrentMonth 
                          ? isDarkMode ? 'text-gray-600' : 'text-gray-400' 
                          : isDarkMode ? 'text-gray-300' : 'text-gray-800'
                        }
                        ${isTodayDate 
                          ? isDarkMode 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-500 text-white' 
                          : ''
                        }
                      `}
                    >
                      {formatDate(day)}
                    </div>
                    
                    {/* Events */}
                    <div className="flex flex-col gap-1 overflow-hidden">
                      {renderEvents(day)}
                      
                      {/* Show indicator for more events */}
                      {eventsForDay.length > 3 && (
                        <div 
                          className={`
                            text-xs px-2
                            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                          `}
                        >
                          +{eventsForDay.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarGrid 