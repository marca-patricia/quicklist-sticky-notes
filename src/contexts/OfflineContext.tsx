import React, { createContext, useContext, useState, useEffect } from 'react';

interface OfflineContextType {
  isOnline: boolean;
  lastSync: Date | null;
  pendingChanges: number;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    // Set initial online status
    setIsOnline(navigator.onLine);
    
    // Set initial sync time
    setLastSync(new Date());

    const handleOnline = () => {
      setIsOnline(true);
      setLastSync(new Date());
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Remove dependencies to prevent loops

  return (
    <OfflineContext.Provider value={{ isOnline, lastSync, pendingChanges }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};