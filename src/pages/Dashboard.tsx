import React, { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { PracticeEvent, SheetMusicItem } from '../types/index'
import { fetchEvents } from '../services/calendarService'
import { fetchSheetMusic } from '../services/sheetMusicService'
import { useToast } from '../context/ToastContext'
import PageTransition from '../components/PageTransition'
import { 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  MusicalNoteIcon,
  CalendarIcon,
  ChevronDownIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  ClockIcon as ClockIconSolid
} from '@heroicons/react/24/outline'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

type TimePeriod = 'current_week' | 'week' | 'month' | 'quarter' | 'year' | 'all'

interface TimePeriodOption {
  value: TimePeriod
  label: string
  days: number
  icon: React.ElementType
}

const timePeriodOptions: TimePeriodOption[] = [
  { value: 'current_week', label: 'This Week', days: 0, icon: ClockIcon },
  { value: 'week', label: 'Last Week', days: 7, icon: CalendarDaysIcon },
  { value: 'month', label: 'Last Month', days: 30, icon: CalendarIcon },
  { value: 'quarter', label: 'Last Quarter', days: 90, icon: ArrowTrendingUpIcon },
  { value: 'year', label: 'Last Year', days: 365, icon: ClockIconSolid },
  { value: 'all', label: 'All Time', days: Infinity, icon: ChartBarIcon }
]

// Helper function to get start date based on selected time period
const getStartDate = (period: TimePeriod): Date => {
  const now = new Date()
  
  switch(period) {
    case 'current_week': {
      // Get the start of the current week (Sunday)
      const currentDay = now.getDay()
      const startDate = new Date(now)
      startDate.setDate(now.getDate() - currentDay)
      startDate.setHours(0, 0, 0, 0)
      return startDate
    }
    case 'week': {
      // Get the start of the previous week (last Sunday)
      const currentDay = now.getDay()
      const startDate = new Date(now)
      // Go back to the start of the current week, then back 7 more days
      startDate.setDate(now.getDate() - currentDay - 7)
      startDate.setHours(0, 0, 0, 0)
      return startDate
    }
    case 'all':
      return new Date(0)
    default: {
      // For month, quarter, year - use the specified number of days
      const selectedOption = timePeriodOptions.find(opt => opt.value === period)!
      const startDate = new Date(now)
      startDate.setDate(startDate.getDate() - selectedOption.days)
      return startDate
    }
  }
}

interface PracticeStats {
  totalPracticeTime: number
  completedSessions: number
  totalSessions: number
  averageSessionDuration: number
  recentPieces: {
    id: string
    title: string
    composer: string
    practiceCount: number
    lastPracticed: Date
  }[]
}

const TIME_PERIOD_STORAGE_KEY = 'dashboard_time_period'

interface PracticeTimeData {
  labels: string[]
  data: number[]
}

const Dashboard: React.FC = () => {
  const { isDarkMode } = useTheme()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [events, setEvents] = useState<PracticeEvent[]>([])
  const [sheetMusic, setSheetMusic] = useState<SheetMusicItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(() => {
    const saved = localStorage.getItem(TIME_PERIOD_STORAGE_KEY)
    return (saved as TimePeriod) || 'month'
  })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [stats, setStats] = useState<PracticeStats>({
    totalPracticeTime: 0,
    completedSessions: 0,
    totalSessions: 0,
    averageSessionDuration: 0,
    recentPieces: []
  })
  const [practiceTimeData, setPracticeTimeData] = useState<PracticeTimeData>({
    labels: [],
    data: []
  })

  const calculatePracticeTimeData = (events: PracticeEvent[]) => {
    const now = new Date()
    const startDate = getStartDate(selectedPeriod)
    
    // Filter events to only include completed sessions and exclude future ones
    const recentEvents = events.filter(event => 
      new Date(event.startTime) >= startDate && 
      new Date(event.startTime) <= now &&
      event.isCompleted
    )

    // Group events by day
    const dailyPractice = new Map<string, number>()
    recentEvents.forEach(event => {
      const date = new Date(event.startTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
      const duration = (new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / (1000 * 60) // in minutes
      dailyPractice.set(date, (dailyPractice.get(date) || 0) + duration)
    })

    // Sort by date
    const sortedEntries = Array.from(dailyPractice.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())

    setPracticeTimeData({
      labels: sortedEntries.map(([date]) => date),
      data: sortedEntries.map(([_, minutes]) => Math.round(minutes))
    })
  }

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, selectedPeriod])

  const loadData = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      const [events, sheetMusic] = await Promise.all([
        fetchEvents(user.id),
        fetchSheetMusic(user.id)
      ])
      setEvents(events)
      setSheetMusic(sheetMusic)
      calculateStats(events, sheetMusic)
      calculatePracticeTimeData(events)
    } catch (error) {
      console.error('Error loading data:', error)
      showToast('Failed to load practice data', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (events: PracticeEvent[], sheetMusic: SheetMusicItem[]) => {
    const now = new Date()
    const startDate = getStartDate(selectedPeriod)
    
    // Filter events to only include completed sessions and exclude future ones
    const recentEvents = events.filter(event => 
      new Date(event.startTime) >= startDate && 
      new Date(event.startTime) <= now &&
      event.isCompleted
    )

    const totalTime = recentEvents.reduce((acc, event) => {
      const duration = (new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / (1000 * 60) // in minutes
      return acc + duration
    }, 0)

    // Get all sessions (completed and uncompleted) for the total count, but still exclude future ones
    const allRecentSessions = events.filter(event =>
      new Date(event.startTime) >= startDate && 
      new Date(event.startTime) <= now
    )

    // Calculate practice stats for each piece
    const pieceStats = new Map<string, { count: number, lastPracticed: Date }>()
    recentEvents.forEach(event => {
      if (event.sheetMusicId) {
        const current = pieceStats.get(event.sheetMusicId) || { count: 0, lastPracticed: new Date(0) }
        pieceStats.set(event.sheetMusicId, {
          count: current.count + 1,
          lastPracticed: new Date(event.startTime) > current.lastPracticed ? new Date(event.startTime) : current.lastPracticed
        })
      }
    })

    const recentPieces = Array.from(pieceStats.entries())
      .map(([id, stats]) => {
        const piece = sheetMusic.find(sm => sm.id === id)
        return piece ? {
          id: piece.id,
          title: piece.title,
          composer: piece.composer,
          practiceCount: stats.count,
          lastPracticed: stats.lastPracticed
        } : null
      })
      .filter(Boolean)
      .sort((a, b) => b!.lastPracticed.getTime() - a!.lastPracticed.getTime())
      .slice(0, 6) as PracticeStats['recentPieces']

    setStats({
      totalPracticeTime: Math.round(totalTime),
      completedSessions: recentEvents.length,
      totalSessions: allRecentSessions.length,
      averageSessionDuration: recentEvents.length > 0 ? Math.round(totalTime / recentEvents.length) : 0,
      recentPieces
    })
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon,
    unit = '',
    description = ''
  }: { 
    title: string
    value: number
    icon: React.ElementType
    unit?: string
    description?: string
  }) => (
    <div className={`
      p-6 rounded-xl shadow-lg
      ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
      hover:scale-[1.02] transition-transform duration-200
    `}>
      <div className="flex items-start space-x-4">
        <div className={`
          p-3 rounded-lg
          ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
        `}>
          <Icon className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <p className={`
            text-sm font-medium
            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
          `}>
            {title}
          </p>
          <p className={`
            text-2xl font-bold
            ${isDarkMode ? 'text-white' : 'text-gray-600'}
          `}>
            {value}{unit}
          </p>
          {description && (
            <p className={`
              text-sm mt-1
              ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}
            `}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const TimePeriodSelector = () => {
    const selectedOption = timePeriodOptions.find(opt => opt.value === selectedPeriod)!
    const Icon = selectedOption.icon

    const handlePeriodChange = (period: TimePeriod) => {
      setSelectedPeriod(period)
      localStorage.setItem(TIME_PERIOD_STORAGE_KEY, period)
      setIsDropdownOpen(false)
    }

    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg
            ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}
            shadow transition-colors duration-200
          `}
        >
          <Icon className="h-5 w-5 text-blue-500" />
          <span className={`
            ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
          `}>
            {selectedOption.label}
          </span>
          <ChevronDownIcon className={`
            h-4 w-4 transition-transform duration-200
            ${isDropdownOpen ? 'rotate-180' : ''}
            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
          `} />
        </button>

        {isDropdownOpen && (
          <div className={`
            absolute right-0 mt-2 w-48 rounded-lg shadow-lg
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
            border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
            overflow-hidden z-10
          `}>
            {timePeriodOptions.map((option) => {
              const OptionIcon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => handlePeriodChange(option.value)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3
                    ${isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-50 text-gray-700'
                    }
                    transition-colors duration-200
                    ${selectedPeriod === option.value 
                      ? isDarkMode 
                        ? 'bg-gray-700' 
                        : 'bg-gray-50'
                      : ''
                    }
                  `}
                >
                  <OptionIcon className="h-5 w-5 text-blue-500" />
                  <span>{option.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const minutes = context.raw as number
            const hours = Math.floor(minutes / 60)
            const remainingMinutes = minutes % 60
            return `${hours}h ${remainingMinutes}m`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            const minutes = value as number
            const hours = Math.floor(minutes / 60)
            const remainingMinutes = minutes % 60
            return `${hours}h ${remainingMinutes}m`
          }
        }
      }
    }
  }

  const chartData = {
    labels: practiceTimeData.labels,
    datasets: [
      {
        data: practiceTimeData.data,
        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: 'rgb(59, 130, 246)'
      }
    ]
  }

  return (
    <PageTransition>
      <div className={`
        h-full overflow-hidden
        ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}
      `}>
        <div className="max-w-7xl mx-auto p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`
              text-3xl font-bold
              ${isDarkMode ? 'text-white' : 'text-gray-700'}
            `}>
              Practice Dashboard
            </h1>
            <TimePeriodSelector />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Practice Time"
                  value={stats.totalPracticeTime}
                  icon={ClockIcon}
                  unit=" min"
                  description={`${selectedPeriod === 'current_week' ? 'This week' : selectedPeriod === 'week' ? 'Last week' : selectedPeriod === 'month' ? 'Last 30 days' : selectedPeriod === 'quarter' ? 'Last 90 days' : selectedPeriod === 'year' ? 'Last year' : 'All time'}`}
                />
                <StatCard
                  title="Completed Sessions"
                  value={stats.completedSessions}
                  icon={CheckCircleIcon}
                  description={`of ${stats.totalSessions} total`}
                />
                <StatCard
                  title="Total Sessions"
                  value={stats.totalSessions}
                  icon={CalendarIcon}
                  description={`${selectedPeriod === 'current_week' ? 'This week' : selectedPeriod === 'week' ? 'Last week' : selectedPeriod === 'month' ? 'Last 30 days' : selectedPeriod === 'quarter' ? 'Last 90 days' : selectedPeriod === 'year' ? 'Last year' : 'All time'}`}
                />
                <StatCard
                  title="Avg. Session Duration"
                  value={stats.averageSessionDuration}
                  icon={ClockIcon}
                  unit=" min"
                  description="Per session"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className={`
                  p-6 rounded-xl shadow-lg
                  ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                `}>
                  <h2 className={`
                    text-xl font-semibold mb-6
                    ${isDarkMode ? 'text-white' : 'text-gray-600'}
                  `}>
                    Practice Time Overview
                  </h2>
                  <div className="h-80">
                    <Bar options={chartOptions} data={chartData} />
                  </div>
                </div>

                <div className={`
                  p-6 rounded-xl shadow-lg
                  ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                `}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`
                      text-xl font-semibold
                      ${isDarkMode ? 'text-white' : 'text-gray-600'}
                    `}>
                      Recently Practiced Pieces
                    </h2>
                    <div className={`
                      flex items-center space-x-2 px-3 py-1 rounded-lg
                      ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                    `}>
                      <MusicalNoteIcon className="h-4 w-4 text-blue-500" />
                      <span className={`
                        text-sm
                        ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                      `}>
                        {stats.recentPieces.length} pieces
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {stats.recentPieces.map((piece) => (
                      <div
                        key={piece.id}
                        className={`
                          flex flex-col p-4 rounded-lg
                          ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}
                          hover:scale-[1.02] transition-transform duration-200
                        `}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <MusicalNoteIcon className="h-5 w-5 text-blue-500" />
                          <div>
                            <h3 className={`
                              font-medium
                              ${isDarkMode ? 'text-white' : 'text-gray-600'}
                            `}>
                              {piece.title}
                            </h3>
                            <p className={`
                              text-sm
                              ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                            `}>
                              {piece.composer}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className={`
                            flex items-center space-x-1
                            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                          `}>
                            <CalendarIcon className="h-4 w-4" />
                            <span className="text-sm">
                              {formatDate(piece.lastPracticed)}
                            </span>
                          </div>
                          <div className={`
                            flex items-center space-x-1
                            ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                          `}>
                            <ChartBarIcon className="h-4 w-4" />
                            <span className="text-sm">
                              {piece.practiceCount} {piece.practiceCount === 1 ? 'session' : 'sessions'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

export default Dashboard 