import React, { useState, useEffect, useRef, useCallback } from 'react'
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Download, 
  FileText, 
  AlertCircle, 
  MousePointer 
} from 'lucide-react'
import { Document, Page } from 'react-pdf'
import { useShortcuts } from '../context/ShortcutContext'
import { saveAs } from 'file-saver'
import pdfjs from '../config/pdfjs'

interface PDFViewerProps {
  pdfPath: string | File
  isOpen: boolean
  onClose: () => void
  title: string
  isDarkMode: boolean
}

/**
 * PDFViewer component for displaying and interacting with PDF documents.
 * Features include:
 * - Page navigation
 * - Zoom controls with mouse wheel support
 * - Fullscreen mode
 * - PDF download
 * - Keyboard shortcuts support
 */
const PDFViewer: React.FC<PDFViewerProps> = ({ pdfPath, isOpen, onClose, title, isDarkMode }) => {
  // Document state
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isPdfFullscreen, setIsPdfFullscreen] = useState(false)
  const [useMouseWheelZoom, setUseMouseWheelZoom] = useState(true)
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isPageChanging, setIsPageChanging] = useState(false)
  
  // Page transition states
  const [pageWidth, setPageWidth] = useState(0)
  const [pageHeight, setPageHeight] = useState(0)
  const [renderKey, setRenderKey] = useState(0)
  const [animateIn, setAnimateIn] = useState(false)
  
  // Refs
  const viewerRef = useRef<HTMLDivElement>(null)
  const pdfContentRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  
  // Hooks
  const { isShortcutTriggered } = useShortcuts()

  // ======= LIFECYCLE & EFFECTS =======

  // Animation effect for opening/closing modal
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setAnimateIn(true), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ======= PDF DOCUMENT HANDLING =======
  
  // Load PDF when component opens
  useEffect(() => {
    if (isOpen && pdfPath) {
      setScale(1.0);
      
      // Setup loading state
      setIsLoading(true);
      setLoadingProgress(0);
      setError(null);
      setPageNumber(1);

      // Simulate loading progress for better UX
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + (Math.random() * 15);
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      // Set up PDF URL and cleanup function
      try {
        if (pdfPath instanceof File) {
          const url = URL.createObjectURL(pdfPath);
          setPdfUrl(url);
          return () => {
            clearInterval(progressInterval);
            URL.revokeObjectURL(url);
            setPdfUrl(null);
          };
        } else {
          setPdfUrl(pdfPath);
          return () => {
            clearInterval(progressInterval);
            setPdfUrl(null);
          };
        }
      } catch (err) {
        clearInterval(progressInterval);
        setError('Failed to load PDF file');
        setIsLoading(false);
      }
    }
  }, [isOpen, pdfPath]);

  const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoadingProgress(100);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    setError(null);
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error('PDF loading error:', error);
    setError('Failed to load PDF file');
    setIsLoading(false);
  }, []);

  // Capture page dimensions for transitions
  const handlePageRenderSuccess = useCallback((page: any) => {
    if (pageRef.current) {
      const { width, height } = pageRef.current.getBoundingClientRect();
      setPageWidth(width);
      setPageHeight(height);
    }
    
    if (isPageChanging) {
      setTimeout(() => {
        setIsPageChanging(false);
      }, 100);
    }
  }, [isPageChanging]);

  // ======= PAGE NAVIGATION =======

  const nextPage = useCallback(() => {
    if (numPages && pageNumber < numPages && !isPageChanging) {
      setIsPageChanging(true);
      setRenderKey(prev => prev + 1);
      setPageNumber(pageNumber + 1);
    }
  }, [numPages, pageNumber, isPageChanging]);

  const prevPage = useCallback(() => {
    if (pageNumber > 1 && !isPageChanging) {
      setIsPageChanging(true);
      setRenderKey(prev => prev + 1);
      setPageNumber(pageNumber - 1);
    }
  }, [pageNumber, isPageChanging]);

  // ======= FULLSCREEN HANDLING =======

  const handleFullscreenChange = useCallback((fullscreen: boolean) => {
    setIsPdfFullscreen(fullscreen);
    document.body.style.overflow = fullscreen ? 'hidden' : '';
    
    const handleBrowserFullscreenChange = () => {
      if (!document.fullscreenElement && isPdfFullscreen) {
        setIsPdfFullscreen(false);
        document.body.style.overflow = '';
      }
    };
    
    document.addEventListener('fullscreenchange', handleBrowserFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleBrowserFullscreenChange);
    };
  }, [isPdfFullscreen]);
  
  const togglePdfFullscreen = useCallback(async () => {
    if (!isPdfFullscreen) {
      try {
        if (viewerRef.current?.requestFullscreen) {
          await viewerRef.current.requestFullscreen();
        }
        handleFullscreenChange(true);
      } catch (error) {
        console.error('Error enabling fullscreen:', error);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        handleFullscreenChange(false);
      } catch (error) {
        console.error('Error exiting fullscreen:', error);
      }
    }
  }, [isPdfFullscreen, handleFullscreenChange]);

  // ======= ZOOM CONTROLS =======
  
  const zoomIn = useCallback(() => {
    setScale(prev => {
      const newScale = Math.min(prev + 0.1, 3.0);
      return newScale;
    });
  }, []);
  
  const zoomOut = useCallback(() => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.1, 0.5);
      return newScale;
    });
  }, []);
  
  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!useMouseWheelZoom) return;
    
    const isCtrlPressed = e.ctrlKey || e.metaKey;
    
    if (isCtrlPressed) {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.deltaY < 0) {
        setScale(prev => {
          const newScale = prev + 0.05;
          return newScale > 3.0 ? 3.0 : newScale;
        });
      } else {
        setScale(prev => {
          const newScale = prev - 0.05;
          return newScale < 0.5 ? 0.5 : newScale;
        });
      }
    }
  }, [useMouseWheelZoom]);

  // ======= EVENT LISTENERS =======
  
  // Mouse wheel event listener
  useEffect(() => {
    if (!isOpen) return;
    
    const captureWheel = (e: WheelEvent) => {
      if (useMouseWheelZoom && (e.ctrlKey || e.metaKey)) {
        handleWheel(e);
      }
    };
    
    window.addEventListener('wheel', captureWheel, { passive: false, capture: true });
    
    return () => {
      window.removeEventListener('wheel', captureWheel, { capture: true });
    };
  }, [isOpen, handleWheel, useMouseWheelZoom]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser's default zoom behavior
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.code === 'Equal' || e.code === 'Minus')) {
        e.preventDefault();
      }

      // Handle custom shortcuts
      if (isShortcutTriggered(e, 'pdfViewer', 'previousPage')) {
        e.preventDefault();
        prevPage();
      } else if (isShortcutTriggered(e, 'pdfViewer', 'nextPage')) {
        e.preventDefault();
        nextPage();
      } else if (isShortcutTriggered(e, 'pdfViewer', 'zoomIn')) {
        e.preventDefault();
        zoomIn();
      } else if (isShortcutTriggered(e, 'pdfViewer', 'zoomOut')) {
        e.preventDefault();
        zoomOut();
      } else if (isShortcutTriggered(e, 'pdfViewer', 'toggleFullscreen')) {
        e.preventDefault();
        togglePdfFullscreen();
      }
      
      // Direct keyboard handling for standard zoom shortcuts
      if (e.ctrlKey) {
        if (e.key === '+' || e.key === '=' || e.code === 'Equal') {
          e.preventDefault();
          zoomIn();
        } else if (e.key === '-' || e.code === 'Minus') {
          e.preventDefault();
          zoomOut();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutTriggered, prevPage, nextPage, zoomIn, zoomOut, togglePdfFullscreen]);

  // ======= UI INTERACTION HANDLERS =======

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimateIn(false);
    
    setTimeout(() => {
      onClose();
      
      if (isPdfFullscreen) {
        try {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
          handleFullscreenChange(false);
        } catch (error) {
          console.error('Error exiting fullscreen:', error);
        }
      }
    }, 300);
  }, [onClose, isPdfFullscreen, handleFullscreenChange]);

  const handleDownload = useCallback(async () => {
    try {
      if (typeof pdfPath === 'string') {
        const response = await fetch(pdfPath);
        const blob = await response.blob();
        saveAs(blob, `${title || 'document'}.pdf`);
      } else if (pdfPath instanceof File) {
        saveAs(pdfPath, pdfPath.name);
      }
    } catch (err) {
      console.error('Error downloading PDF:', err);
    }
  }, [pdfPath, title]);

  // Early return if not open
  if (!isOpen) return null;

  // ======= THEME-BASED STYLES =======

  // Theme-based color classes
  const textClass = isDarkMode ? 'text-gray-200' : 'text-gray-600';
  const bgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const headerBgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const loadingBgClass = isDarkMode ? 'bg-gray-700' : 'bg-gray-200';
  const loadingFillClass = isDarkMode ? 'bg-blue-500' : 'bg-blue-600';
  const errorBgClass = isDarkMode ? 'bg-red-900/20' : 'bg-red-50';
  const errorTextClass = isDarkMode ? 'text-red-300' : 'text-red-600';
  const skeletonBgClass = isDarkMode ? 'bg-gray-700' : 'bg-gray-300';

  // ======= COMPONENT RENDER =======

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black transition-opacity duration-300 ease-in-out
        ${animateIn ? 'bg-opacity-75' : 'bg-opacity-0'} 
      `}
      onClick={handleClose}
    >
      <div 
        ref={viewerRef}
        className={`
          relative w-full max-w-4xl h-[90vh] 
          ${bgClass} 
          rounded-lg shadow-xl overflow-hidden 
          ${isPdfFullscreen ? 'max-w-none m-0 rounded-none h-screen' : ''}
          transition-all duration-300 ease-out
          ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${borderClass} ${headerBgClass}`}>
          <h3 className={`font-semibold truncate ${textClass}`}>{title}</h3>
          <div className="flex items-center gap-2">
            {useMouseWheelZoom && (
              <div className={`
                flex items-center gap-1 px-2 py-1 rounded-full text-xs
                ${isDarkMode ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-100 text-blue-700'}
              `}>
                <MousePointer size={12} />
                <span>Ctrl+Wheel Zoom</span>
              </div>
            )}
            <button
              onClick={zoomOut}
              disabled={isLoading}
              className={`
                p-2 rounded-full transition-colors duration-200
                ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'} 
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              aria-label="Zoom out"
            >
              <ZoomOut size={20} />
            </button>
            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{Math.round(scale * 100)}%</span>
            <button
              onClick={zoomIn}
              disabled={isLoading}
              className={`
                p-2 rounded-full transition-colors duration-200
                ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'} 
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              aria-label="Zoom in"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div 
          ref={pdfContentRef}
          className={`
            overflow-auto flex flex-col items-center p-4 
            ${bgClass} 
            pdf-viewer-content
            ${isPdfFullscreen 
              ? 'h-[calc(100vh-8.5rem)]'
              : 'h-[calc(90vh-8.5rem)]'
            }
            relative
          `}
        >
          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-20">
              <div className="w-full max-w-md flex flex-col items-center gap-4">
                <div className="flex items-center justify-center">
                  <FileText size={32} className={`${textClass} mb-2 opacity-90`} />
                </div>
                
                <div className="font-medium text-lg mb-2 text-center max-w-[80%]">
                  <span className={textClass}>Loading {title}</span>
                </div>
                
                {/* Progress bar */}
                <div className={`w-full h-2 rounded-full overflow-hidden ${loadingBgClass}`}>
                  <div 
                    className={`h-full ${loadingFillClass} transition-all duration-300 ease-out`}
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Preparing document...
                </div>
              </div>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className={`p-6 rounded-lg ${errorBgClass} max-w-md shadow-lg`}>
                <div className="flex items-center gap-4 mb-4">
                  <AlertCircle size={24} className={errorTextClass} />
                  <span className={`font-medium ${errorTextClass}`}>Failed to load document</span>
                </div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                  There was a problem loading this PDF. Please check if the file is valid or try again later.
                </p>
                <button
                  onClick={handleClose}
                  className={`mt-4 px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} transition-colors`}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          
          {/* Page skeleton for transitions */}
          {isPageChanging && !isLoading && pageWidth > 0 && (
            <div 
              className={`
                absolute z-10 rounded-lg shadow-lg ${skeletonBgClass}
                transition-opacity duration-200 opacity-80
              `}
              style={{
                width: `${pageWidth}px`,
                height: `${pageHeight}px`,
              }}
            />
          )}
          
          {/* Document display */}
          {pdfUrl && !error && (
            <Document
              file={pdfUrl}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleError}
              loading={null}
              error={null}
              className="max-w-full relative z-10"
            >
              {(!isLoading || isPageChanging) && !error && (
                <div ref={pageRef} key={renderKey} className="relative">
                  <Page
                    key={`page_${pageNumber}`}
                    pageNumber={pageNumber}
                    scale={scale}
                    className={`
                      shadow-lg bg-white rounded-lg
                      transition-transform duration-100 ease-out
                      ${isPageChanging ? 'opacity-0' : 'opacity-100'}
                    `}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    onRenderSuccess={handlePageRenderSuccess}
                    loading=""
                  />
                </div>
              )}
            </Document>
          )}
          
          {/* Loading skeleton placeholder */}
          {isLoading && (
            <div className={`w-full max-w-[600px] aspect-[3/4] ${skeletonBgClass} rounded-lg opacity-30 absolute z-0`} />
          )}
        </div>

        {/* Footer */}
        {!error && numPages && (
          <div className={`absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 ${headerBgClass} border-t ${borderClass}`}>
            <div className="flex items-center gap-4">
              <button
                onClick={prevPage}
                disabled={pageNumber <= 1 || isLoading || isPageChanging}
                className={`
                  p-2 rounded-full 
                  ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'} 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200
                `}
              >
                <ChevronLeft size={20} />
              </button>
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Page {pageNumber} of {numPages}
              </span>
              <button
                onClick={nextPage}
                disabled={pageNumber >= numPages || isLoading || isPageChanging}
                className={`
                  p-2 rounded-full 
                  ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'} 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200
                `}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={isLoading}
                className={`
                  p-2 rounded-full 
                  ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}
                  transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <Download size={20} />
              </button>
              <button
                onClick={togglePdfFullscreen}
                disabled={isLoading}
                className={`
                  p-2 rounded-full 
                  ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'} 
                  transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `} 
              >
                {isPdfFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;