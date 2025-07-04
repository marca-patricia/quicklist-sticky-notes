
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
    <Card className="p-4 bg-secondary/50 border-border/50">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {pendingItems === 0 ? (
            <span className="text-primary font-medium">{t('allCompleted')}</span>
          ) : (
            <span>
              {pendingItems} {pendingItems === 1 ? t('oneItemLeft') : t('itemsLeft')}
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {completedItems > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearCompleted}
              className="text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">{t('clearCompleted')}</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">{t('shareList')}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
