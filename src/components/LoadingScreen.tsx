import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  const { isDarkMode } = useTheme();
  
  // Colors from the logo
  const colors = {
    lightBlue: '#64B5F6',
    lightGreen: '#81C784',
    lightOrange: '#FFB74D'
  };
  
  // Background color based on theme
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  // Light gray text with reduced opacity
  const textColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${bgColor}`}>
      {/* Simple dot animation */}
      <div className="flex space-x-3 mb-8">
        {[colors.lightBlue, colors.lightGreen, colors.lightOrange].map((color, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
              repeatDelay: 0.1
            }}
          />
        ))}
      </div>
      
      {/* Message - positioned lower with lighter color and further reduced opacity */}
      <p className={`${textColor} text-base opacity-40 mt-3`}>
        {message}
      </p>
    </div>
  );
};

export default LoadingScreen; 