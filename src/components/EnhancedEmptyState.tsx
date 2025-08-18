
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, FileText, CheckSquare, List } from 'lucide-react';

interface EnhancedEmptyStateProps {
  type: 'lists' | 'items';
  onAction?: () => void;
}

export const EnhancedEmptyState: React.FC<EnhancedEmptyStateProps> = ({ type, onAction }) => {
  const { t } = useLanguage();

  if (type === 'lists') {
    return (
      <div className="text-center py-12 px-4">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
            <List className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-foreground dark:text-white">
            {t('noLists')}
          </h3>
          <p className="text-muted-foreground dark:text-white/70 text-lg mb-8 max-w-md mx-auto">
            {t('noListsDesc')}
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={onAction}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('createList')}
          </Button>
          
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-white/60 bg-secondary/50 dark:bg-white/5 px-3 py-2 rounded-full">
              <CheckSquare className="w-4 h-4" />
              <span>Tarefas</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-white/60 bg-secondary/50 dark:bg-white/5 px-3 py-2 rounded-full">
              <FileText className="w-4 h-4" />
              <span>Compras</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-white/60 bg-secondary/50 dark:bg-white/5 px-3 py-2 rounded-full">
              <List className="w-4 h-4" />
              <span>Projetos</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
        <Plus className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground dark:text-white">
        {t('noItems')}
      </h3>
      <p className="text-muted-foreground dark:text-white/70">
        {t('addItemHere')}
      </p>
    </div>
  );
};
