import React, { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { v4 as uuidv4 } from 'uuid'
import { PracticeEvent, SheetMusicItem, EventType } from '../types/index'
import { 
  fetchEvents, 
  addEvent, 
  updateEvent,
  deleteEvent, 
  toggleEventCompletion 
} from '../services/calendarService'
import { useToast } from '../context/ToastContext'
import CalendarGrid from '../components/calendar/CalendarGrid'
import MonthNavigation from '../components/calendar/MonthNavigation'
import EventForm from '../components/calendar/EventForm'
import EventDetail from '../components/calendar/EventDetail'
import { fetchSheetMusic } from '../services/sheetMusicService'
import PageTransition from '../components/PageTransition'
import { Filter, X } from 'lucide-react'

const Calendar: React.FC = () => {
  const { isDarkMode } = useTheme()
  const { user } = useAuth()
  const { showToast } = useToast()
  // State
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [events, setEvents] = useState<PracticeEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<PracticeEvent | null>(null)
  const [isEventFormOpen, setIsEventFormOpen] = useState(false)
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [sheetMusicItems, setSheetMusicItems] = useState<SheetMusicItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Event type options
  const eventTypeOptions: { type: EventType; label: string }[] = [
    { type: 'practice', label: 'Practice Sessions' },
    { type: 'concert', label: 'Concerts' },
    { type: 'lesson', label: 'Lessons' },
    { type: 'rehearsal', label: 'Rehearsals' },
    { type: 'recital', label: 'Recitals' },
  ]

  // Filtered events based on selected types
  const filteredEvents = selectedEventTypes.length > 0
    ? events.filter(event => selectedEventTypes.includes(event.type))
    : events

  // Toggle event type filter
  const toggleEventType = (type: EventType) => {
    setSelectedEventTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedEventTypes([])
  }

  // Load events and sheet music
  useEffect(() => {
    if (user) {
      loadEvents()
      loadSheetMusic()
    }
  }, [user])
  
  // Ensure all events have a valid type field
  const normalizeEvents = (loadedEvents: PracticeEvent[]): PracticeEvent[] => {
    return loadedEvents.map(event => ({
      ...event,
      // Ensure type is one of the valid options
      type: event.type || 'practice',
      // Make sure other required fields have defaults
      color: event.color || '#3B82F6',
      description: event.description || ''
    }));
  };

  const loadEvents = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      const fetchedEvents = await fetchEvents(user.id)
      
      // Normalize events to ensure all have valid type fields
      const normalizedEvents = normalizeEvents(fetchedEvents);
      setEvents(normalizedEvents)
    } catch (error) {
      console.error('Error loading events:', error)
      showToast('Failed to load Practice Sessions', 'error')
    } finally {
      setIsLoading(false)
    }
  }
  
  const loadSheetMusic = async () => {
    if (!user) return
    
    try {
      const items = await fetchSheetMusic(user.id)
      setSheetMusicItems(items)
    } catch (error) {
      console.error('Error loading sheet music:', error)
    }
  }
  
  // Handle creating/updating events
  const handleSaveEvent = async (eventData: Omit<PracticeEvent, 'id'>) => {
    if (!user) return
    
    try {
      setIsSubmitting(true)

      // Make sure type is always set
      const safeEventData = {
        ...eventData,
        type: eventData.type || 'practice',
        description: eventData.description || '',
        color: eventData.color || '#3B82F6'
      };
      
      if (selectedEvent) {
        // Update existing event
        await updateEvent(user.id, {
          ...safeEventData,
          id: selectedEvent.id
        })
        
        // Update local state with the updated event
        setEvents(prevEvents => 
          prevEvents.map(event => 
          event.id === selectedEvent.id 
              ? { ...safeEventData, id: selectedEvent.id }
            : event
          )
        )
        
        showToast('Practice Session updated successfully', 'success')
      } else {
        // Create new event
        try {
          const newEvent = await addEvent(user.id, safeEventData)
        
          // Update local state ensuring we're using the previous state
          setEvents(prevEvents => [...prevEvents, newEvent])
        
        showToast('Practice Session created successfully', 'success')
        } catch (error) {
          console.error('Error in addEvent:', error);
          throw error; // Re-throw to be caught by outer catch
        }
      }
      
      // Close form
      handleCloseEventForm()
    } catch (error) {
      console.error('Error saving Practice Session:', error)
      showToast('Failed to save Practice Session', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Handle deleting event
  const handleDeleteEvent = async () => {
    if (!user || !selectedEvent) return
    
    try {
      await deleteEvent(user.id, selectedEvent.id)
      
      // Update local state
      setEvents(events.filter(event => event.id !== selectedEvent.id))
      
      // Close detail view
      setIsEventDetailOpen(false)
      setSelectedEvent(null)
      
      showToast('Practice Session deleted successfully', 'success')
    } catch (error) {
      console.error('Error deleting Practice Session:', error)
      showToast('Failed to delete Practice Session', 'error')
    }
  }
  
  // Handle toggling event completion
  const handleToggleCompletion = async (isCompleted: boolean) => {
    if (!user || !selectedEvent) return
    
    // Check if the event is in the future when trying to mark as completed
    if (isCompleted && new Date(selectedEvent.startTime) > new Date()) {
      showToast('Future events cannot be marked as completed', 'error')
      return
    }
    
    try {
      await toggleEventCompletion(user.id, selectedEvent.id, isCompleted)
      
      // Update local state
      setEvents(events.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, isCompleted } 
          : event
      ))
      
      // Update selected event
      setSelectedEvent({
        ...selectedEvent,
        isCompleted
      })
      
      showToast(`Event marked as ${isCompleted ? 'completed' : 'incomplete'}`, 'success')
    } catch (error) {
      console.error('Error toggling Practice Session completion:', error)
      showToast('Failed to update Practice Session', 'error')
    }
  }
  
  // Open event form for editing an existing event
  const handleEditEvent = () => {
    setIsEventDetailOpen(false)
    setIsEventFormOpen(true)
  }
  
  // Open event detail view
  const handleViewEvent = (event: PracticeEvent) => {
    setSelectedEvent(event)
    setIsEventDetailOpen(true)
  }
  
  // Handle date click in calendar
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setIsEventFormOpen(true)
  }
  
  // Close event form
  const handleCloseEventForm = () => {
    setIsEventFormOpen(false)
    setSelectedEvent(null)
    setSelectedDate(null)
  }
  
  // Find sheet music item for selected event
  const getSheetMusicForEvent = () => {
    if (!selectedEvent?.sheetMusicId) return undefined
    return sheetMusicItems.find(item => item.id === selectedEvent.sheetMusicId)
  }
  
  return (
    <PageTransition>
      <div className={`
        h-full overflow-hidden
        ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}
      `}>
        <div className="max-w-7xl mx-auto p-6 h-full overflow-y-auto">
          {/* Month navigation */}
          <div className="flex justify-between items-center mb-6">
            <MonthNavigation 
              currentDate={currentDate} 
              onDateChange={setCurrentDate}
            />
            
            {/* Filter button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`
                  flex items-center gap-2 py-2 px-4 rounded-lg
                  ${isDarkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }
                  transition-colors shadow-sm
                `}
              >
                <Filter size={16} />
                <span>Filter</span>
                {selectedEventTypes.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {selectedEventTypes.length}
                  </span>
                )}
              </button>

              {/* Filter dropdown */}
              {isFilterOpen && (
                <div 
                  className={`
                    absolute right-0 mt-2 w-64 rounded-lg shadow-lg
                    ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                    border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
                    z-50
                  `}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        Filter Events
                      </h3>
                      {selectedEventTypes.length > 0 && (
                        <button
                          onClick={clearFilters}
                          className={`
                            text-xs px-2 py-1 rounded
                            ${isDarkMode 
                              ? 'text-blue-400 hover:text-blue-300' 
                              : 'text-blue-600 hover:text-blue-500'
                            }
                          `}
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {eventTypeOptions.map(option => (
                        <label
                          key={option.type}
                          className={`
                            flex items-center gap-2 p-2 rounded-lg cursor-pointer
                            ${selectedEventTypes.includes(option.type)
                              ? isDarkMode
                                ? 'bg-gray-700'
                                : 'bg-gray-100'
                              : ''
                            }
                            ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={selectedEventTypes.includes(option.type)}
                            onChange={() => toggleEventType(option.type)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Loading indicator */}
          {isLoading ? (
            <div className={`
              rounded-xl shadow-lg p-8 flex items-center justify-center
              ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
              min-h-[500px]
            `}>
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Loading calendar events...
                </p>
              </div>
            </div>
          ) : (
            <div className={`
              rounded-xl shadow-lg overflow-hidden
              ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
            `}>
              <CalendarGrid 
                currentDate={currentDate}
                events={filteredEvents}
                onDateClick={handleDateClick}
                onEventClick={handleViewEvent}
              />
            </div>
          )}
        </div>
        
        {/* Event form modal */}
        {isEventFormOpen && (
          <EventForm 
            event={selectedEvent || undefined}
            isOpen={isEventFormOpen}
            onClose={handleCloseEventForm}
            onSave={handleSaveEvent}
            selectedDate={selectedDate || undefined}
            sheetMusicItems={sheetMusicItems}
          />
        )}
        
        {/* Event detail modal */}
        {isEventDetailOpen && selectedEvent && (
          <EventDetail 
            event={selectedEvent}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onToggleComplete={handleToggleCompletion}
            onClose={() => setIsEventDetailOpen(false)}
            sheetMusicItem={getSheetMusicForEvent()}
          />
        )}
      </div>
    </PageTransition>
  )
}

export default Calendar 