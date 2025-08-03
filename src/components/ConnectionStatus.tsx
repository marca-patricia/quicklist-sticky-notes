import React from 'react';
import { AlertCircle, Wifi, WifiOff, Clock } from 'lucide-react';
import { useOffline } from '@/contexts/OfflineContext';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ConnectionStatus: React.FC = () => {
  const { isOnline, lastSync, pendingChanges } = useOffline();

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`flex items-center gap-1 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
        {isOnline ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {lastSync && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="text-xs hidden md:inline">
            Sync {formatDistanceToNow(lastSync, { addSuffix: true, locale: ptBR })}
          </span>
        </div>
      )}

      {pendingChanges > 0 && (
        <Badge variant="secondary" className="text-xs">
          <AlertCircle className="w-3 h-3 mr-1" />
          {pendingChanges} pendente{pendingChanges > 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  );
};