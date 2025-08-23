import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Share2, Download, Upload, Smartphone, Bell } from 'lucide-react';

export const NativeFeatures: React.FC = () => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [notificationPermission, setNotificationPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    try {
      // Handle PWA install prompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Check if app is already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstallable(false);
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    } catch (err) {
      console.warn('Error initializing native features:', err);
      setError('Failed to initialize native features');
    }
  }, []);

  const handleInstallPWA = async () => {
    try {
      if (!deferredPrompt) return;

      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: t('appInstalled'),
          description: t('appInstalledDesc'),
        });
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error installing PWA:', error);
      toast({
        title: t('error'),
        description: t('exportError'),
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: 'QuickList',
        text: t('shareAppText'),
        url: window.location.origin
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          toast({
            title: t('sharedSuccessfully'),
            description: t('sharedSuccessfullyDesc'),
          });
        } catch (error) {
          if ((error as Error).name !== 'AbortError') {
            fallbackShare();
          }
        }
      } else {
        fallbackShare();
      }
    } catch (error) {
      console.error('Error sharing app:', error);
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    try {
      setShowShareDialog(true);
    } catch (error) {
      console.error('Error showing share dialog:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: t('copiedToClipboard'),
        description: text,
      });
      setShowShareDialog(false);
    } catch (error) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast({
          title: t('copiedToClipboard'),
          description: text,
        });
        setShowShareDialog(false);
      } catch (fallbackError) {
        console.error('Error copying to clipboard:', fallbackError);
        toast({
          title: t('error'),
          description: t('exportError'),
          variant: 'destructive',
        });
      }
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: t('notificationsNotSupported'),
        description: t('notificationsNotSupportedDesc'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        toast({
          title: t('notificationsEnabled'),
          description: t('notificationsEnabledDesc'),
        });
        
        // Show a test notification
        new Notification('QuickList', {
          body: t('testNotificationBody'),
          icon: '/src/assets/quicklist-icon.png',
          badge: '/src/assets/quicklist-icon.png',
        });
      } else {
        toast({
          title: t('notificationsDenied'),
          description: t('notificationsDeniedDesc'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('notificationsError'),
        description: t('notificationsErrorDesc'),
        variant: 'destructive',
      });
    }
  };

  const exportData = () => {
    try {
      const data = {
        lists: JSON.parse(localStorage.getItem('quicklist-lists') || '[]'),
        stickyNotes: JSON.parse(localStorage.getItem('quicklist-sticky-notes') || '[]'),
        achievements: JSON.parse(localStorage.getItem('quicklist-achievements') || '[]'),
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quicklist-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: t('dataExported'),
        description: t('dataExportedDesc'),
      });
    } catch (error) {
      toast({
        title: t('exportError'),
        description: t('exportErrorDesc'),
        variant: 'destructive',
      });
    }
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          // Validate data structure
          if (!data.lists || !data.stickyNotes || !data.achievements) {
            throw new Error('Invalid backup file format');
          }

          // Import data
          if (data.lists.length > 0) {
            localStorage.setItem('quicklist-lists', JSON.stringify(data.lists));
          }
          if (data.stickyNotes.length > 0) {
            localStorage.setItem('quicklist-sticky-notes', JSON.stringify(data.stickyNotes));
          }
          if (data.achievements.length > 0) {
            localStorage.setItem('quicklist-achievements', JSON.stringify(data.achievements));
          }

          toast({
            title: t('dataImported'),
            description: t('dataImportedDesc'),
          });
          
          // Refresh page to show imported data
          setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
          toast({
            title: t('importError'),
            description: t('importErrorDesc'),
            variant: 'destructive',
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground mb-2">{error}</p>
        <Button onClick={() => setError(null)} variant="outline" size="sm">
          {t('tryAgain')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {isInstallable && (
          <Button onClick={handleInstallPWA} className="w-full" variant="outline">
            <Smartphone className="h-4 w-4 mr-2" />
            {t('installApp')}
          </Button>
        )}

        <Button onClick={handleShare} className="w-full" variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          {t('shareApp')}
        </Button>

        <Button 
          onClick={requestNotificationPermission} 
          className="w-full" 
          variant="outline"
          disabled={notificationPermission === 'granted'}
        >
          <Bell className="h-4 w-4 mr-2" />
          {notificationPermission === 'granted' ? t('notificationsEnabled') : t('enableNotifications')}
        </Button>

        <div className="flex gap-2">
          <Button onClick={exportData} className="flex-1" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t('exportData')}
          </Button>
          
          <Button onClick={importData} className="flex-1" variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            {t('importData')}
          </Button>
        </div>
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('shareApp')}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('shareAppDescription')}
            </p>
            
            <Button 
              onClick={() => copyToClipboard(window.location.origin)}
              className="w-full"
              variant="outline"
            >
              {t('copyLink')}
            </Button>
            
            <div className="text-xs text-muted-foreground">
              {window.location.origin}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};