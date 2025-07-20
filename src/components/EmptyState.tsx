
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus } from 'lucide-react';

export const EmptyState: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Plus className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{t('noLists')}</h3>
        <p className="text-muted-foreground">{t('noListsDesc')}</p>
      </div>
    </div>
  );
};
