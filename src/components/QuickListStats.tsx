
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Share2, CheckCheck } from 'lucide-react';

interface QuickListStatsProps {
  totalItems: number;
  completedItems: number;
  onShare: () => void;
  onClearCompleted: () => void;
}

export const QuickListStats: React.FC<QuickListStatsProps> = ({
  totalItems,
  completedItems,
  onShare,
  onClearCompleted
}) => {
  const { t } = useLanguage();
  const pendingItems = totalItems - completedItems;

  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between gap-2 text-sm py-2">
      <div className="text-foreground font-medium">
        {pendingItems === 0 ? (
          <span>{t('allCompleted')}</span>
        ) : (
          <span>
            {pendingItems} {pendingItems === 1 ? t('oneItemLeft') : t('itemsLeft')}
          </span>
        )}
      </div>
      
      <div className="flex gap-1">
        {completedItems > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearCompleted}
          className="text-foreground hover:text-foreground/80 hover:bg-muted text-xs px-2 py-1 h-7"
        >
          <CheckCheck className="h-3 w-3" />
          <span className="hidden sm:inline ml-1">{t('clearCompleted')}</span>
        </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="text-foreground border-border hover:bg-muted text-xs px-2 py-1 h-7"
        >
          <Share2 className="h-3 w-3" />
          <span className="hidden sm:inline ml-1">{t('shareList')}</span>
        </Button>
      </div>
    </div>
  );
};
