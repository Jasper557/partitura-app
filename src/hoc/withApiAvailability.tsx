import React, { ComponentType } from 'react';
import { useApiStatus } from '../context/ApiStatusContext';
import ApiUnavailable from '../components/ApiUnavailable';

// Higher-Order Component that checks API availability
export const withApiAvailability = <P extends object>(
  Component: ComponentType<P>,
  options: {
    message?: string;
  } = {}
) => {
  const { message = 'API Connection Lost' } = options;
  
  const WithApiAvailability: React.FC<P> = (props) => {
    const { isApiAvailable } = useApiStatus();
    
    if (!isApiAvailable) {
      return (
        <div className="p-4">
          <ApiUnavailable message={message} />
        </div>
      );
    }
    
    return <Component {...props} />;
  };
  
  // Set the display name for debugging purposes
  const displayName = Component.displayName || Component.name || 'Component';
  WithApiAvailability.displayName = `withApiAvailability(${displayName})`;
  
  return WithApiAvailability;
};

export default withApiAvailability; 