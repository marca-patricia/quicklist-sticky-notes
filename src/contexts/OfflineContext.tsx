
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
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Evitar execução durante SSR
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      setInitialized(true);
      return;
    }

    let mounted = true;

    const initOfflineContext = () => {
      try {
        // Set initial states
        if (mounted) {
          setIsOnline(navigator.onLine);
          setLastSync(new Date());
          setInitialized(true);
        }
      } catch (error) {
        console.warn('Offline context initialization error:', error);
        if (mounted) {
          setInitialized(true);
        }
      }
    };

    const handleOnline = () => {
      if (mounted) {
        setIsOnline(true);
        setLastSync(new Date());
      }
    };
    
    const handleOffline = () => {
      if (mounted) {
        setIsOnline(false);
      }
    };

    // Delay initialization
    const timer = setTimeout(initOfflineContext, 50);

    // Add event listeners after initialization
    const listenerTimer = setTimeout(() => {
      if (mounted && typeof window !== 'undefined') {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
      }
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      clearTimeout(listenerTimer);
      
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  // Provide fallback values during initialization
  if (!initialized) {
    return (
      <OfflineContext.Provider value={{ 
        isOnline: true, 
        lastSync: null, 
        pendingChanges: 0 
      }}>
        {children}
      </OfflineContext.Provider>
    );
  }

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
