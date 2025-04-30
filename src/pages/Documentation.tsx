import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { 
  ArrowLeft, 
  File, 
  Settings, 
  BookOpen, 
  Calendar, 
  Music, 
  Search, 
  Star, 
  Upload,
  Maximize2,
  ZoomIn,
  Download,
  HelpCircle,
  MousePointer,
  ChevronLeft,
  ChevronRight,
  BarChart,
  Bell,
  Shield,
  Keyboard,
  MessageCircle,
  Clock,
  CheckCircle,
  Users,
  Mic,
  Filter,
  PieChart,
  ArrowUpRight,
  CalendarDays
} from 'lucide-react'
import { Page } from '../types/index'
import useScrollReset from '../hooks/useScrollReset'
import InfoBox from '../components/InfoBox'
import PageTransition from '../components/PageTransition'

const Documentation: React.FC<{
  onNavigate?: (page: Page) => void
}> = ({ onNavigate }) => {
  const { isDarkMode } = useTheme()
  
  // Reset scroll position when component mounts
  useScrollReset()
  
  const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
      <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        <BookOpen size={18} />
        {title}
      </h2>
      <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {children}
      </div>
    </div>
  )
  
  const Subsection: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="mb-6">
      <h3 className={`text-base font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {icon}
        {title}
      </h3>
      <div className="space-y-2 ml-6">
        {children}
      </div>
    </div>
  )
  
  const Feature: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className={`
      p-4 rounded-lg
      ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
      shadow-sm
      mb-4
    `}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          {icon}
        </div>
        <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{title}</h4>
      </div>
      <div className={`ml-7 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {children}
      </div>
    </div>
  )
  
  const Shortcut: React.FC<{ keys: string, action: string }> = ({ keys, action }) => (
    <div className="flex justify-between items-center py-2 border-b last:border-0 border-gray-700">
      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{action}</span>
      <kbd className={`
        px-2 py-1 rounded text-sm font-mono
        ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
      `}>{keys}</kbd>
    </div>
  )

  return (
    <PageTransition>
      <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button 
              onClick={() => onNavigate && onNavigate('settings')}
              className={`
                p-2 rounded-full mr-2
                ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}
                transition-colors duration-200
              `}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">Documentation</h1>
          </div>
          
          {/* Information box */}
          <InfoBox icon={<HelpCircle size={20} />}>
            Welcome to Partitura documentation. Here you'll find helpful information about how to use the application
            and get the most out of its features.
          </InfoBox>
          
          <Section title="Getting Started">
            <p>
              Partitura is a comprehensive sheet music management application designed for musicians. 
              It helps you organize, practice, and schedule your musical repertoire in one place.
            </p>
          </Section>
          
          <Section title="Navigation">
            <p className="mb-4">
              Partitura uses a sidebar navigation system to access different sections of the app.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Feature icon={<Music size={20} />} title="Sheet Music">
                Access your sheet music library, upload new scores, and manage your collection.
              </Feature>
              
              <Feature icon={<Calendar size={20} />} title="Calendar">
                Plan your practice schedule and musical events in a calendar view.
              </Feature>
              
              <Feature icon={<BarChart size={20} />} title="Dashboard">
                View statistics and analytics about your practice routines and music collection.
              </Feature>
              
              <Feature icon={<Settings size={20} />} title="Settings">
                Customize your app preferences, change themes, and manage your account.
              </Feature>
            </div>
          </Section>
          
          <Section title="Sheet Music Library">
            <Subsection title="Managing Your Collection" icon={<File size={18} />}>
              <p className="mb-3">
                The Sheet Music page is where you can view and manage your entire collection.
              </p>
              
              <Feature icon={<Upload size={20} />} title="Adding Music">
                Click the "Add Sheet Music" button to upload new PDF files to your collection.
                You can provide details like composer, title, and other metadata.
              </Feature>
              
              <Feature icon={<Search size={20} />} title="Searching">
                Use the search bar to quickly find sheet music by title, composer, or other details.
                Press Ctrl+F to activate the search box.
              </Feature>
              
              <Feature icon={<Star size={20} />} title="Favorites">
                Mark your most used sheet music as favorites for quick access.
                Favorited pieces appear at the top of your collection for easy retrieval.
              </Feature>
            </Subsection>
            
            <Subsection title="PDF Viewer" icon={<File size={18} />}>
              <p className="mb-3">
                Partitura includes a built-in PDF viewer with several useful features:
              </p>
              
              <Feature icon={<ZoomIn size={20} />} title="Zoom Controls">
                <p>Several options for zooming in and out:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Use the zoom buttons in the header (+/-)</li>
                  <li>Keyboard shortcuts: Ctrl++ (plus) and Ctrl+- (minus)</li>
                  <li>Hold Ctrl while using mouse wheel to zoom in/out</li>
                </ul>
                <p className="mt-2">Visual feedback shows zoom percentage and displays helpful indicators when you reach minimum or maximum zoom levels.</p>
              </Feature>
              
              <Feature icon={<MousePointer size={20} />} title="Mouse Wheel Zoom">
                Hold the Ctrl key while scrolling your mouse wheel to zoom in and out with precision. 
                A subtle indicator appears during zooming to show your current zoom level.
                This feature can be enabled or disabled in keyboard shortcut settings.
              </Feature>
              
              <Feature icon={<ChevronLeft size={20} />} title="Page Navigation">
                <p>Navigate through multi-page documents:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Use the arrow buttons at the bottom of the viewer</li>
                  <li>Keyboard shortcuts: Left Arrow for previous page, Right Arrow for next page</li>
                </ul>
                <p className="mt-2">The current page number and total pages are displayed at the bottom of the viewer.</p>
              </Feature>
              
              <Feature icon={<Maximize2 size={20} />} title="Fullscreen Mode">
                Open the PDF in fullscreen mode for distraction-free viewing. Press the fullscreen button
                or use the keyboard shortcut (F) to toggle between normal and fullscreen views.
              </Feature>
              
              <Feature icon={<Download size={20} />} title="Download">
                Download the current PDF to your device for offline use by clicking the download button
                in the bottom toolbar.
              </Feature>
            </Subsection>
          </Section>
          
          <Section title="Calendar">
            <p className="mb-4">
              The Calendar provides a visual schedule of all your musical activities and practice sessions.
            </p>
            
            <Subsection title="Event Management" icon={<Calendar size={18} />}>
              <Feature icon={<Clock size={20} />} title="Practice Session Planning">
                Schedule practice sessions by clicking on any date in the calendar.
                Set start and end times, add descriptions, and link sessions to specific sheet music in your collection.
              </Feature>

              <Feature icon={<Filter size={20} />} title="Event Filtering">
                Filter events by type to focus on specific activities:
                <ul className="list-disc ml-5 mt-2">
                  <li>Practice Sessions - Your personal practice time</li>
                  <li>Concerts - Upcoming performances</li>
                  <li>Lessons - Music instruction sessions</li>
                  <li>Rehearsals - Group practice sessions</li>
                  <li>Recitals - Formal performances</li>
                </ul>
              </Feature>

              <Feature icon={<CheckCircle size={20} />} title="Completion Tracking">
                Mark practice sessions as complete to track your progress.
                Completed events are visually distinguished in the calendar view for easy tracking.
              </Feature>
            </Subsection>
            
            <Subsection title="Calendar View" icon={<CalendarDays size={18} />}>
              <Feature icon={<Mic size={20} />} title="Event Types">
                Different event types are color-coded and use distinctive icons:
                <ul className="list-disc ml-5 mt-2">
                  <li>Practice Sessions - Blue with music note icon</li>
                  <li>Concerts - Red with microphone icon</li>
                  <li>Lessons - Green with book icon</li>
                  <li>Rehearsals - Purple with users icon</li>
                  <li>Recitals - Orange with music icon</li>
                </ul>
              </Feature>

              <Feature icon={<Users size={20} />} title="Event Details">
                Click on any event to view its full details, make edits, or delete it.
                The event detail view shows all information about the event, including any linked sheet music.
              </Feature>

              <Feature icon={<ChevronLeft size={20} />} title="Month Navigation">
                Navigate between months using the arrow buttons at the top of the calendar.
                The current date is highlighted for easy reference, and today's date is always marked.
              </Feature>
            </Subsection>
          </Section>
          
          <Section title="Dashboard">
            <p className="mb-4">
              The Dashboard provides an overview of your practice statistics and performance metrics.
            </p>
            
            <Subsection title="Practice Analytics" icon={<BarChart size={18} />}>
              <Feature icon={<Clock size={20} />} title="Practice Time Statistics">
                View your total practice time, average session duration, and practice trends over time.
                The bar chart visualizes your daily practice minutes, giving you a clear picture of your practice patterns.
              </Feature>

              <Feature icon={<PieChart size={20} />} title="Practice Session Overview">
                See a breakdown of your completed practice sessions versus planned sessions.
                Track your practice consistency with metrics showing your completion rate.
              </Feature>

              <Feature icon={<CalendarDays size={20} />} title="Time Period Selection">
                Customize your dashboard view by selecting different time periods:
                <ul className="list-disc ml-5 mt-2">
                  <li>This Week - Focus on your current week's progress</li>
                  <li>Last Week - Review your previous week's activities</li>
                  <li>Last Month - Get a monthly perspective on your practice</li>
                  <li>Last Quarter - View three months of data at once</li>
                  <li>Last Year - See your annual practice trends</li>
                  <li>All Time - Analyze your entire practice history</li>
                </ul>
              </Feature>
            </Subsection>
            
            <Subsection title="Repertoire Insights" icon={<Music size={18} />}>
              <Feature icon={<ArrowUpRight size={20} />} title="Recent Practice Activity">
                See which pieces you've practiced most recently and how frequently you've worked on them.
                This helps you identify neglected pieces in your repertoire.
              </Feature>

              <Feature icon={<CheckCircle size={20} />} title="Progress Tracking">
                Monitor your overall progress with all pieces in your repertoire.
                The dashboard highlights your practice consistency and helps identify areas for improvement.
              </Feature>
            </Subsection>
          </Section>
          
          <Section title="Additional Pages">
            <Subsection title="Settings Pages" icon={<Settings size={18} />}>
              <Feature icon={<Keyboard size={20} />} title="Keyboard Shortcuts">
                View and customize keyboard shortcuts for faster navigation and controls throughout the app.
                Access this page from the Settings menu.
              </Feature>
              
              <Feature icon={<Bell size={20} />} title="Notification Settings">
                Configure how and when you receive notifications about practice reminders, upcoming events,
                and other important updates.
              </Feature>
              
              <Feature icon={<Shield size={20} />} title="Privacy Settings">
                Manage your privacy preferences and data settings. Control what information is stored
                and how it's used within the application.
              </Feature>
            </Subsection>
            
            <Subsection title="Support" icon={<HelpCircle size={18} />}>
              <Feature icon={<MessageCircle size={20} />} title="Contact Support">
                Reach out to our support team for help with any issues or questions you have about
                using Partitura. Access the contact form from the Settings menu.
              </Feature>
              
              <Feature icon={<BookOpen size={20} />} title="Documentation">
                This documentation page provides detailed information about all features and
                how to use them effectively.
              </Feature>
            </Subsection>
          </Section>
          
          <div className="mt-8 mb-12">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              For additional help or support, please <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => onNavigate && onNavigate('contact-support')}>contact our support team</span>.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default Documentation 