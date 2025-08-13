
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const OfflineStatus: React.FC = () => {
  const { t } = useLanguage();
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
    <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-black">
      <WifiOff className="w-4 h-4 dark:text-black" />
      <span className="dark:text-black">{t('offline')}</span>
    </div>
  );
};
