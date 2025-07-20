
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export const OfflineStatus: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <WifiOff className="w-4 h-4" />
      <span>Offline</span>
    </div>
  );
};
