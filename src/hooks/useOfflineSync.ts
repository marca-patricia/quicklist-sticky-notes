
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SyncData {
  lists: any[];
  achievements: any[];
  lastSync: Date;
}

interface PendingAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'list' | 'item' | 'category';
  data: any;
  timestamp: Date;
}

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: '✅ Conexão Restaurada',
        description: 'Sincronizando dados...',
        duration: 3000,
      });
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: '⚠️ Modo Offline',
        description: 'Suas alterações serão sincronizadas quando a conexão for restaurada.',
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending actions from localStorage
    const savedActions = localStorage.getItem('quicklist-pending-actions');
    if (savedActions) {
      try {
        const parsed = JSON.parse(savedActions);
        setPendingActions(parsed.map((action: any) => ({
          ...action,
          timestamp: new Date(action.timestamp)
        })));
      } catch (error) {
        console.error('Error loading pending actions:', error);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save pending actions to localStorage
  useEffect(() => {
    localStorage.setItem('quicklist-pending-actions', JSON.stringify(pendingActions));
  }, [pendingActions]);

  const addPendingAction = (action: Omit<PendingAction, 'id' | 'timestamp'>) => {
    const newAction: PendingAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setPendingActions(prev => [...prev, newAction]);
  };

  const syncPendingActions = async () => {
    if (pendingActions.length === 0) return;
    
    setIsSyncing(true);
    
    try {
      // Simulate API sync - in a real app, this would sync with your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear pending actions after successful sync
      setPendingActions([]);
      localStorage.removeItem('quicklist-pending-actions');
      
      toast({
        title: '✅ Sincronização Completa',
        description: `${pendingActions.length} alterações sincronizadas com sucesso.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: '❌ Erro na Sincronização',
        description: 'Não foi possível sincronizar. Tentaremos novamente em breve.',
        duration: 5000,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const exportData = () => {
    const lists = JSON.parse(localStorage.getItem('quicklist-lists') || '[]');
    const achievements = JSON.parse(localStorage.getItem('quicklist-achievements') || '[]');
    
    const exportData: SyncData = {
      lists,
      achievements,
      lastSync: new Date()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quicklist-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: '💾 Backup Criado',
      description: 'Seus dados foram exportados com sucesso.',
      duration: 3000,
    });
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data: SyncData = JSON.parse(e.target?.result as string);
        
        // Merge with existing data
        const existingLists = JSON.parse(localStorage.getItem('quicklist-lists') || '[]');
        const existingAchievements = JSON.parse(localStorage.getItem('quicklist-achievements') || '[]');
        
        // Simple merge strategy - in a real app, you'd want more sophisticated conflict resolution
        const mergedLists = [...existingLists, ...data.lists];
        const mergedAchievements = [...existingAchievements, ...data.achievements];
        
        localStorage.setItem('quicklist-lists', JSON.stringify(mergedLists));
        localStorage.setItem('quicklist-achievements', JSON.stringify(mergedAchievements));
        
        toast({
          title: '📂 Dados Importados',
          description: 'Seus dados foram importados com sucesso. Recarregue a página para ver as alterações.',
          duration: 5000,
        });
      } catch (error) {
        toast({
          title: '❌ Erro na Importação',
          description: 'Não foi possível importar os dados. Verifique se o arquivo está correto.',
          duration: 5000,
        });
      }
    };
    
    reader.readAsText(file);
  };

  const getStorageUsage = () => {
    let totalSize = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith('quicklist-')) {
        totalSize += localStorage[key].length;
      }
    }
    
    return {
      used: totalSize,
      usedMB: (totalSize / 1024 / 1024).toFixed(2),
      available: 5 * 1024 * 1024 - totalSize, // Assuming 5MB localStorage limit
      availableMB: ((5 * 1024 * 1024 - totalSize) / 1024 / 1024).toFixed(2)
    };
  };

  return {
    isOnline,
    isSyncing,
    pendingActions: pendingActions.length,
    addPendingAction,
    syncPendingActions,
    exportData,
    importData,
    getStorageUsage
  };
};
