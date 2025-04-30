import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useApiStatus } from '../context/ApiStatusContext';

interface ApiUnavailableProps {
  message?: string;
  className?: string;
}

const ApiUnavailable: React.FC<ApiUnavailableProps> = ({
  message = 'Server connection lost',
  className = '',
}) => {
  const { retryConnection, lastChecked } = useApiStatus();
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await retryConnection();
    setIsRetrying(false);
  };

  const lastCheckedText = lastChecked 
    ? `Last checked: ${lastChecked.toLocaleTimeString()}`
    : 'Checking connection...';

  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 ${className}`}>
      <WifiOff className="w-8 h-8 text-red-500 dark:text-red-400 mb-2" />
      <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2">
        {message}
      </h3>
      <p className="text-sm text-red-600 dark:text-red-400 mb-3 text-center">
        The Partitura API is currently unavailable.
      </p>
      <button
        onClick={handleRetry}
        disabled={isRetrying}
        className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
      >
        {isRetrying ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Retrying...
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </>
        )}
      </button>
      <p className="text-xs text-red-500 dark:text-red-400 mt-2">
        {lastCheckedText}
      </p>
    </div>
  );
};

export default ApiUnavailable; 