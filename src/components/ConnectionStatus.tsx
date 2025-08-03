
import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { useOffline } from '@/contexts/OfflineContext';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ConnectionStatus: React.FC = () => {
  const { isOnline, lastSync, pendingChanges } = useOffline();

  // Don't show connection status at all since it's not needed
  if (pendingChanges === 0 && isOnline) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 dark:bg-muted/80 dark:border-border">
      {lastSync && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">
            {formatDistanceToNow(lastSync, { addSuffix: true, locale: ptBR })}
          </span>
        </div>
      )}

      {pendingChanges > 0 && (
        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border-amber-200 dark:border-amber-700">
          <AlertCircle className="w-3 h-3 mr-1" />
          {pendingChanges} pendente{pendingChanges > 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  );
};
