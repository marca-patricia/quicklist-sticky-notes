import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WifiOff, Wifi, RefreshCw, Upload, Download } from 'lucide-react';

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingActions: number;
  isSyncing: boolean;
}

export const AdvancedSyncManager: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingActions: 0,
    isSyncing: false
  });
  const { t } = useLanguage();

  useEffect(() => {
    try {
      // Monitor online/offline status
      const handleOnline = () => {
        setSyncStatus(prev => ({ ...prev, isOnline: true }));
        // Trigger sync when coming back online
        triggerSync();
      };

      const handleOffline = () => {
        setSyncStatus(prev => ({ ...prev, isOnline: false }));
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Initialize sync status
      initializeSyncStatus();

      // Register for background sync if supported
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
          // Register for background sync (type assertion for compatibility)
          (registration as any).sync?.register('quicklist-sync');
        }).catch(() => {
          // Silent fail for unsupported browsers
        });
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    } catch (error) {
      console.warn('Error initializing sync manager:', error);
    }
  }, []);

  const initializeSyncStatus = () => {
    try {
      const lastSyncString = localStorage.getItem('quicklist-last-sync');
      const pendingActions = JSON.parse(localStorage.getItem('quicklist-pending-actions') || '[]');
      
      setSyncStatus(prev => ({
        ...prev,
        lastSync: lastSyncString ? new Date(lastSyncString) : null,
        pendingActions: pendingActions.length
      }));
    } catch (error) {
      console.warn('Error initializing sync status:', error);
    }
  };

  const triggerSync = async () => {
    if (!syncStatus.isOnline || syncStatus.isSyncing) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear pending actions after successful sync
      localStorage.removeItem('quicklist-pending-actions');
      localStorage.setItem('quicklist-last-sync', new Date().toISOString());
      
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        pendingActions: 0,
        isSyncing: false
      }));

      // Trigger background sync if available
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if ('sync' in registration) {
          (registration as any).sync?.register('quicklist-sync');
        }
      }
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  };

  const addPendingAction = (action: any) => {
    const pendingActions = JSON.parse(localStorage.getItem('quicklist-pending-actions') || '[]');
    pendingActions.push({
      ...action,
      timestamp: new Date().toISOString(),
      id: Date.now()
    });
    localStorage.setItem('quicklist-pending-actions', JSON.stringify(pendingActions));
    
    setSyncStatus(prev => ({ ...prev, pendingActions: pendingActions.length }));
  };

  const formatLastSync = (lastSync: Date | null) => {
    try {
      if (!lastSync) return t('neverSynced');
      
      const now = new Date();
      const diffMs = now.getTime() - lastSync.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return t('justNow');
      if (diffMins < 60) return `${diffMins} ${t('minutesAgo').replace('{{count}}', '')}`;
      if (diffHours < 24) return `${diffHours} ${t('hoursAgo').replace('{{count}}', '')}`;
      return `${diffDays} ${t('daysAgo').replace('{{count}}', '')}`;
    } catch (error) {
      console.warn('Error formatting last sync:', error);
      return t('neverSynced');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>{t('syncStatus')}</span>
          <div className="flex items-center gap-2">
            {syncStatus.isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={syncStatus.isOnline ? 'default' : 'destructive'}>
              {syncStatus.isOnline ? t('online') : t('offline')}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('lastSync')}</span>
          <span>{formatLastSync(syncStatus.lastSync)}</span>
        </div>
        
        {syncStatus.pendingActions > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('pendingChanges')}</span>
            <Badge variant="outline">
              {syncStatus.pendingActions}
            </Badge>
          </div>
        )}
        
        {syncStatus.isSyncing && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>{t('syncInProgress')}</span>
          </div>
        )}
        
        {!syncStatus.isOnline && syncStatus.pendingActions > 0 && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            {t('offlineModeDesc')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};