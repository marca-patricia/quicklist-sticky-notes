import React from 'react';
import { AlertCircle, Wifi, WifiOff, Clock } from 'lucide-react';
import { useOffline } from '@/contexts/OfflineContext';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ConnectionStatus: React.FC = () => {
  const { isOnline, lastSync, pendingChanges } = useOffline();

  return (
    <div className="flex items-center gap-2 text-sm px-2 py-1 rounded-md bg-primary/10 border border-primary/30 dark:bg-muted dark:border-border">
      <div className={`flex items-center gap-1 ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {isOnline ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span className="hidden sm:inline text-primary-foreground dark:text-foreground font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {lastSync && (
        <div className="flex items-center gap-1 text-muted-foreground dark:text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="text-xs hidden md:inline">
            Sync {formatDistanceToNow(lastSync, { addSuffix: true, locale: ptBR })}
          </span>
        </div>
      )}

      {pendingChanges > 0 && (
        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
          <AlertCircle className="w-3 h-3 mr-1" />
          {pendingChanges} pendente{pendingChanges > 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  );
};