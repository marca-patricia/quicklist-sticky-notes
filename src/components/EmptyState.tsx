import React from 'react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import quicklistIcon from '@/assets/quicklist-icon.png';

export const EmptyState: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Card className="p-8 text-center bg-muted/30 border-dashed border-2 border-border/50">
      <div className="flex flex-col items-center gap-4">
        <img 
          src={quicklistIcon} 
          alt="QuickList" 
          className="w-16 h-16 opacity-60" 
        />
        <div>
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            {t('noItems')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('noItemsDesc')}
          </p>
        </div>
      </div>
    </Card>
  );
};