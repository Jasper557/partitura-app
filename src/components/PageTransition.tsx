import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: React.ReactNode
}

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1], // Custom ease curve for smooth feel
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    }
  }
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  // Reset scroll position when component mounts
  useEffect(() => {
    // Reset scroll position for any scrollable elements
    const scrollableElements = document.querySelectorAll('.overflow-y-auto');
    scrollableElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.scrollTop = 0;
      }
    });
  }, []);
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  )
}

export default PageTransition 