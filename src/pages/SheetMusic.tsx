import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Plus, X, Music, Search, Book, Share2, PlusCircle } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { SheetMusicItem } from '../types/index'
import SheetMusicCard from '../components/SheetMusicCard'
import DropZone from '../components/DropZone'
import { 
  saveSheetMusic, 
  getUserSheetMusic, 
  updateSheetMusic, 
  deleteSheetMusic 
} from '../services/sheetMusicService'
import { useShortcuts } from '../context/ShortcutContext'
import useScrollReset from '../hooks/useScrollReset'
import PageTransition from '../components/PageTransition'
import withApiAvailability from '../hoc/withApiAvailability'

/**
 * Individual icon button component for the control panel
 */
const IconButton: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  isDarkMode: boolean;
  isPrimary?: boolean;
  className?: string;
}> = ({ icon, onClick, isDarkMode, isPrimary = false, className = '' }) => (
  <button
    onClick={onClick}
    className={`
      w-16 h-16 rounded-2xl
      ${isDarkMode ? 'bg-gray-800/70' : 'bg-white/80'}
      backdrop-blur-xl
      shadow-lg hover:shadow-xl
      transition-all duration-200 ease-out
      hover:scale-105 active:scale-95
      flex items-center justify-center
      border
      ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'}
      ${isPrimary 
        ? 'hover:border-blue-400/80 hover:bg-blue-500/20' 
        : 'hover:border-gray-400/60 hover:bg-gray-50/20'
      }
      group
      relative
      overflow-hidden
      ${className}
    `}
  >
    {/* Icon container with simpler animations */}
    <div className={`
      relative z-10
      transition-all duration-200 ease-out
      ${isPrimary 
        ? (isDarkMode ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-500 group-hover:text-blue-400')
        : (isDarkMode ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-500 group-hover:text-gray-700')
      }
      group-hover:scale-110
      drop-shadow-sm
    `}>
      {icon}
    </div>
  </button>
)

/**
 * Component for the control panel with icon buttons
 */
const ControlPanel: React.FC<{ 
  onAddNew: () => void; 
  isDarkMode: boolean;
}> = ({ onAddNew, isDarkMode }) => (
  <div
    className={`
      rounded-3xl shadow-xl overflow-hidden
      transition-all duration-300 ease-out
      hover:shadow-2xl hover:scale-[1.01]
      ${isDarkMode 
        ? 'bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50' 
        : 'bg-gradient-to-br from-white/70 via-white/50 to-gray-50/70'
      }
      backdrop-blur-2xl
      border
      ${isDarkMode ? 'border-gray-700/40' : 'border-gray-200/40'}
      h-[200px] w-56
      relative
      group
      cursor-default
    `}
  >
    {/* Animated gradient overlay */}
    <div className={`
      absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out
      ${isDarkMode 
        ? 'bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10' 
        : 'bg-gradient-to-br from-blue-50/40 via-transparent to-indigo-50/30'
      }
    `} />
    
    {/* Content - Compact 2x2 grid */}
    <div className="relative h-full flex items-center justify-center p-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Top row */}
        <IconButton
          icon={<Music size={24} />}
          onClick={() => {}} // Placeholder for app info/about
          isDarkMode={isDarkMode}
        />
        <IconButton
          icon={<Book size={24} />}
          onClick={() => {}} // Placeholder for library/collection view
          isDarkMode={isDarkMode}
        />
        
        {/* Bottom row */}
        <IconButton
          icon={<PlusCircle size={26} />}
          onClick={onAddNew}
          isDarkMode={isDarkMode}
          isPrimary={true}
          className="relative z-10"
        />
        <IconButton
          icon={<Share2 size={24} />}
          onClick={() => {}} // Placeholder for sharing functionality
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
    
    {/* Corner accent - now more subtle */}
    <div className={`
      absolute top-0 right-0 w-12 h-12 opacity-5 group-hover:opacity-15
      ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}
      rounded-bl-full
      transition-all duration-500 ease-out
      group-hover:scale-110
    `} />
    
    {/* Bottom accent line */}
    <div className={`
      absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-0 group-hover:w-16
      ${isDarkMode ? 'bg-blue-400/30' : 'bg-blue-500/30'}
      transition-all duration-700 ease-out
      rounded-full
    `} />
  </div>
)

/**
 * Expandable search bar component for searching sheet music
 */
const SearchBar: React.FC<{
  onSearch: (query: string) => void;
  isDarkMode: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}> = ({ onSearch, isDarkMode, inputRef, isExpanded, setIsExpanded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleExpand = () => {
    setIsExpanded(true);
    // Focus the input after a small delay to ensure the expansion animation has started
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        if (!searchQuery) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchQuery, setIsExpanded]);

  return (
    <div className="relative flex items-center" ref={searchRef}>
      <div
        className={`
          flex items-center
          rounded-full
          ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
          shadow-md
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-10'}
          h-10
        `}
      >
        <button
          onClick={handleExpand}
          className={`
            p-2 rounded-full
            ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}
            transition-colors duration-200
            flex-shrink-0
          `}
        >
          <Search size={20} />
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search music..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className={`
            bg-transparent
            border-none
            outline-none
            ${isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
            transition-all duration-300
            ${isExpanded ? 'w-full opacity-100 px-2' : 'w-0 opacity-0 px-0'}
          `}
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch('')}
            className={`
              p-2
              ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}
              transition-colors duration-200
            `}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Modal component for adding new sheet music
 */
const AddNewModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onAdd: (data: { title: string; composer: string; file?: File }) => void
  data: { title: string; composer: string; file?: File }
  onDataChange: (data: { title: string; composer: string; file?: File }) => void
  isDarkMode: boolean
  isLoading: boolean
}> = ({ isOpen, onClose, onAdd, data, onDataChange, isDarkMode, isLoading }) => {
  const { showToast } = useToast();
  const [animateIn, setAnimateIn] = useState(false);
  
  const handleClose = () => {
    if (isLoading) {
      showToast('Upload in progress. Please wait...', 'warning');
      return;
    }
    onClose();
  };
  
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setAnimateIn(true), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Theme-based style classes
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-600';
  const mutedTextClass = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBgClass = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';

  const isFormComplete = data.title && data.composer && data.file;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${animateIn ? 'opacity-50' : 'opacity-0'}`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`
          ${bgClass} w-full max-w-lg rounded-xl overflow-hidden shadow-xl
          transition-all duration-500 ease-out
          ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          z-10 relative
        `}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${mutedTextClass} hover:${textClass}`}
          disabled={isLoading}
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="p-6 pb-0">
          <h2 className={`text-xl font-medium ${textClass} flex items-center gap-2`}>
            <Music size={18} className="text-blue-500" />
            <span>New Sheet Music</span>
          </h2>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={data.title}
            onChange={e => onDataChange({ ...data, title: e.target.value })}
            disabled={isLoading}
            className={`
              w-full px-4 py-2 rounded-lg border ${borderClass}
              ${inputBgClass} ${textClass}
              focus:outline-none focus:ring-1 focus:ring-blue-500
              transition-all duration-200
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          />
          
          <input
            type="text"
            placeholder="Composer"
            value={data.composer}
            onChange={e => onDataChange({ ...data, composer: e.target.value })}
            disabled={isLoading}
            className={`
              w-full px-4 py-2 rounded-lg border ${borderClass}
              ${inputBgClass} ${textClass}
              focus:outline-none focus:ring-1 focus:ring-blue-500
              transition-all duration-200
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          />
          
          <div className="pt-2">
            <DropZone 
              onFileSelect={file => onDataChange({ ...data, file: file || undefined })}
              selectedFile={data.file}
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={() => isFormComplete && !isLoading && onAdd(data)}
            disabled={!isFormComplete || isLoading}
            className={`
              w-full py-2 rounded-lg mt-4
              transition-all duration-300
              flex items-center justify-center gap-2
              ${isFormComplete && !isLoading
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg' 
                : 'bg-gray-300 cursor-not-allowed text-gray-500'}
              ${data.file && !isLoading ? 'animate-pulse-once' : ''}
            `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Component for the notifications panel
 */
const NotificationsPanel: React.FC<{ 
  isDarkMode: boolean;
}> = ({ isDarkMode }) => (
  <div
    className={`
      rounded-3xl shadow-xl overflow-hidden
      transition-all duration-300 ease-out
      hover:shadow-2xl hover:scale-[1.01]
      ${isDarkMode 
        ? 'bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50' 
        : 'bg-gradient-to-br from-white/70 via-white/50 to-gray-50/70'
      }
      backdrop-blur-2xl
      border
      ${isDarkMode ? 'border-gray-700/40' : 'border-gray-200/40'}
      h-[280px] w-56
      relative
      group
      cursor-default
    `}
  >
    {/* Animated gradient overlay */}
    <div className={`
      absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out
      ${isDarkMode 
        ? 'bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10' 
        : 'bg-gradient-to-br from-blue-50/40 via-transparent to-indigo-50/30'
      }
    `} />
    
    {/* Content */}
    <div className="relative h-full flex flex-col p-4">
      <h3 className={`
        text-sm font-medium mb-3
        ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}
      `}>
        Notifications
      </h3>
      
      {/* Placeholder for notifications */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className={`
          p-3 rounded-lg mb-2
          ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}
          ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
          text-sm
        `}>
          <p className="font-medium">New Sheet Music Added</p>
          <p className="text-xs opacity-75">2 minutes ago</p>
        </div>
        
        <div className={`
          p-3 rounded-lg mb-2
          ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}
          ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
          text-sm
        `}>
          <p className="font-medium">Upload Complete</p>
          <p className="text-xs opacity-75">15 minutes ago</p>
        </div>

        {/* Additional notifications to demonstrate scrolling */}
        <div className={`
          p-3 rounded-lg mb-2
          ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}
          ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
          text-sm
        `}>
          <p className="font-medium">Sheet Music Updated</p>
          <p className="text-xs opacity-75">1 hour ago</p>
        </div>

        <div className={`
          p-3 rounded-lg mb-2
          ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}
          ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
          text-sm
        `}>
          <p className="font-medium">New Version Available</p>
          <p className="text-xs opacity-75">2 hours ago</p>
        </div>

        <div className={`
          p-3 rounded-lg mb-2
          ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'}
          ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
          text-sm
        `}>
          <p className="font-medium">Backup Completed</p>
          <p className="text-xs opacity-75">3 hours ago</p>
        </div>
      </div>
    </div>
    
    {/* Corner accent */}
    <div className={`
      absolute top-0 right-0 w-12 h-12 opacity-5 group-hover:opacity-15
      ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}
      rounded-bl-full
      transition-all duration-500 ease-out
      group-hover:scale-110
    `} />
  </div>
);

/**
 * Main component for the Sheet Music page
 */
const SheetMusic: React.FC = () => {
  // Context hooks
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { isShortcutTriggered } = useShortcuts();
  
  // State for UI
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // State for data
  const [items, setItems] = useState<SheetMusicItem[]>([]);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [newItemData, setNewItemData] = useState<{
    title: string;
    composer: string;
    file?: File;
  }>({
    title: '',
    composer: ''
  });

  // Reset scroll position when component mounts
  useScrollReset();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Search shortcut (Cmd/Ctrl + F)
      if (isShortcutTriggered(e, 'sheetMusic', 'search')) {
        e.preventDefault();
        setIsSearchExpanded(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isShortcutTriggered]);

  // Load user's sheet music
  useEffect(() => {
    const loadSheetMusic = async () => {
      if (!user) return;
      
      try {
        const userSheetMusic = await getUserSheetMusic(user.id);
        setItems(userSheetMusic);
      } catch (error) {
        console.error('Error loading sheet music:', error);
        showToast('Failed to load your sheet music', 'error');
      }
    };
    
    loadSheetMusic();
  }, [user, showToast]);

  /**
   * Handle adding new sheet music
   */
  const handleAddNew = async (data: { title: string; composer: string; file?: File }) => {
    if (!user || !data.file) return;

    try {
      setIsLoading(true);

      const newItemId = crypto.randomUUID();
      const newItem: SheetMusicItem = {
        id: newItemId,
        title: data.title,
        composer: data.composer,
        dateAdded: new Date(),
        isFavorite: false,
        pdfPath: '' // Will be replaced with URL after upload
      };

      // Close the modal right away for immediate feedback
      setIsAddingNew(false);
      
      // Show upload progress toast
      showToast(`Uploading "${data.title}"...`, 'info');

      // Upload file and get the URL
      const pdfUrl = await saveSheetMusic(user.id, newItem, data.file);
      
      // Update with the final URL
      newItem.pdfPath = pdfUrl;
      
      // Update the state with new item
      setItems(prev => [newItem, ...prev]);
      setNewItemData({ title: '', composer: '' });
      
      // Set the last added id for animation
      setLastAddedId(newItemId);
      
      // Clear the animation after 3 seconds
      setTimeout(() => setLastAddedId(null), 3000);

      // Show success toast
      showToast(`"${data.title}" successfully added!`, 'success');
    } catch (error) {
      console.error('Error adding new sheet music:', error);
      showToast('Failed to add sheet music. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle updating a sheet music item
   */
  const handleUpdateItem = async (id: string, updates: Partial<SheetMusicItem>) => {
    if (!user) return;

    try {
      await updateSheetMusic(user.id, id, updates);
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
    } catch (error) {
      console.error('Error updating sheet music:', error);
      showToast('Failed to update sheet music', 'error');
    }
  };

  /**
   * Handle deleting a sheet music item
   */
  const handleDeleteItem = async (id: string) => {
    if (!user) return;

    try {
      await deleteSheetMusic(user.id, id);
      setItems(prev => prev.filter(item => item.id !== id));
      showToast('Sheet music deleted', 'info');
    } catch (error) {
      console.error('Error deleting sheet music:', error);
      showToast('Failed to delete sheet music', 'error');
    }
  };

  /**
   * Filter and sort the sheet music items
   */
  const filteredItems = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    
    // First filter by search query
    const filtered = items.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.composer.toLowerCase().includes(searchLower)
    );
    
    // Then sort: favorites first, then by date (newest first)
    return filtered.sort((a, b) => {
      // First sort by favorite status
      if (a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1;
      }
      
      // If same favorite status, sort by date
      return b.dateAdded.getTime() - a.dateAdded.getTime();
    });
  }, [items, searchQuery]);

  /**
   * Handle opening the add new modal
   */
  const handleOpenAddNew = () => {
    if (isLoading) {
      showToast('Please wait for the current upload to finish', 'info');
      return;
    }
    setIsAddingNew(true);
  };

  /**
   * Handle closing the add new modal
   */
  const handleCloseAddNew = () => {
    if (isLoading) {
      showToast('Upload in progress. Please wait...', 'warning');
      return;
    }
    setIsAddingNew(false);
    setNewItemData({ title: '', composer: '' });
  };

  return (
    <PageTransition>
      <div className={`
        p-6 min-h-screen overflow-y-auto
        ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}
      `}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 sticky top-0 z-10 bg-inherit py-2">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-600'}`}>
              Sheet Music
            </h1>
            <SearchBar
              onSearch={setSearchQuery}
              isDarkMode={isDarkMode}
              inputRef={searchInputRef}
              isExpanded={isSearchExpanded}
              setIsExpanded={setIsSearchExpanded}
            />
          </div>

          {/* Main Content Layout */}
          <div className="flex gap-6">
            {/* Left Sidebar with Control Panel and Notifications */}
            <div className="flex-shrink-0 sticky top-24 space-y-4">
              <ControlPanel 
                onAddNew={handleOpenAddNew} 
                isDarkMode={isDarkMode} 
              />
              <NotificationsPanel isDarkMode={isDarkMode} />
            </div>

            {/* Sheet Music Grid */}
            <div className="flex-1">
              <div 
                className="grid gap- pb-6"
                style={{ 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 320px))',
                }}
              >
                {filteredItems.map(item => (
                  <SheetMusicCard
                    key={item.id}
                    item={item}
                    onUpdate={handleUpdateItem}
                    onDelete={handleDeleteItem}
                    isNew={item.id === lastAddedId}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Add New Modal */}
          <AddNewModal
            isOpen={isAddingNew}
            onClose={handleCloseAddNew}
            onAdd={handleAddNew}
            data={newItemData}
            onDataChange={setNewItemData}
            isDarkMode={isDarkMode}
            isLoading={isLoading}
          />
        </div>
      </div>
    </PageTransition>
  );
};

// Export the component wrapped with API availability check
export default withApiAvailability(SheetMusic, {
  message: 'Sheet Music Library Unavailable'
});