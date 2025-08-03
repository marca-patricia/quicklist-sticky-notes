import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmptyListStateProps {
  onAddItem: () => void;
  onRefresh?: () => void;
  onClearCompleted?: () => void;
  completedCount?: number;
  title?: string;
  description?: string;
}

export const EmptyListState: React.FC<EmptyListStateProps> = ({
  onAddItem,
  onRefresh,
  onClearCompleted,
  completedCount = 0,
  title = "Lista vazia",
  description = "Adicione alguns itens para começar!"
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Plus className="w-12 h-12 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      
      <div className="flex gap-3">
        <Button onClick={onAddItem} size="lg" className="gap-2">
          <Plus className="w-4 h-4" />
          {t('addItem')}
        </Button>
        
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh} size="lg" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {t('refresh')}
          </Button>
        )}
        
        {completedCount > 0 && onClearCompleted && (
          <Button variant="outline" onClick={onClearCompleted} size="lg" className="gap-2">
            <Trash2 className="w-4 h-4" />
            Limpar concluídas ({completedCount})
          </Button>
        )}
      </div>
    </div>
  );
};