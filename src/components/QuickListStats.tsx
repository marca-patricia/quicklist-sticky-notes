
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
    <div className="flex items-center justify-between gap-1 text-sm py-1 overflow-hidden" style={{minHeight: '32px'}}>
      {/* Contador de itens - lado esquerdo */}
      <div className="text-foreground font-medium flex-shrink-0 min-w-0">
        {pendingItems === 0 ? (
          <span className="text-xs">{t('allCompleted')}</span>
        ) : (
          <span className="text-xs truncate">
            {pendingItems} {pendingItems === 1 ? t('oneItemLeft') : t('itemsLeft')}
          </span>
        )}
      </div>
      
      {/* Botões centralizados - lado direito */}
      <div className="flex gap-1 items-center flex-shrink-0">
        {/* Export no meio */}
        {completedItems > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearCompleted}
            className="text-foreground border-border hover:bg-muted text-xs px-1.5 py-0.5 h-6"
          >
            <CheckCheck className="h-2.5 w-2.5" />
            <span className="text-xs ml-0.5 hidden sm:inline">Export</span>
          </Button>
        )}
        
        {/* Share por último */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="flex items-center gap-1 px-2 py-1 h-7 text-foreground dark:text-black hover:bg-secondary/20 dark:hover:bg-white/10 min-w-0 flex-shrink-0"
        >
          <Share2 className="h-2.5 w-2.5 text-foreground dark:text-black" />
          <span className="text-xs hidden sm:inline">{t('share')}</span>
        </Button>
      </div>
    </div>
  );
};
