
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
    <div className="flex items-center justify-between gap-2 text-sm py-1" style={{minHeight: '32px'}}>
      <div className="text-foreground font-medium">
        {pendingItems === 0 ? (
          <span>{t('allCompleted')}</span>
        ) : (
          <span>
            {pendingItems} {pendingItems === 1 ? t('oneItemLeft') : t('itemsLeft')}
          </span>
        )}
      </div>
      
      <div className="flex gap-1 items-center">
        {/* Export sempre no meio */}
        {completedItems > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearCompleted}
          className="text-foreground border-border hover:bg-muted text-xs px-2 py-1 h-7"
          style={{order: 1}}
        >
          <CheckCheck className="h-3 w-3" />
          <span className="text-xs ml-1">Export</span>
        </Button>
        )}
        
        {/* Share sempre por último */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="text-foreground hover:text-foreground/80 hover:bg-muted text-xs px-2 py-1 h-7"
          style={{order: 2}}
        >
          <Share2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
