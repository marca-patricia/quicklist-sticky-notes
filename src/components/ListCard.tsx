
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLists, TodoList } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Circle, MoreVertical, Trash2 } from 'lucide-react';

interface ListCardProps {
  list: TodoList;
  isGridView?: boolean;
}

export const ListCard: React.FC<ListCardProps> = ({ list, isGridView = false }) => {
  const { deleteList, updateList } = useLists();
  const { t } = useLanguage();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const completedItems = list.items.filter(item => item.completed);
  const progress = list.items.length > 0 ? (completedItems.length / list.items.length) * 100 : 0;

  const handleDeleteList = () => {
    if (confirm(t('confirmDeleteList') || 'Tem certeza que deseja excluir esta lista?')) {
      deleteList(list.id);
    }
  };

  return (
    <div 
      className="rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-border cursor-pointer hover:scale-[1.02] min-h-[200px] flex flex-col"
      style={{ 
        backgroundColor: list.color,
      }}
      role="article"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg truncate flex-1 text-foreground" title={list.title}>
          {list.title}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteList}
            className="text-destructive hover:text-destructive/90 h-8 w-8 p-0"
            title="Excluir lista"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-end">
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-foreground font-medium">{completedItems.length}/{list.items.length} completos</span>
            <span className="text-foreground">{Math.round(progress)}%</span>
          </div>
          <div 
            className="w-full bg-background/20 rounded-full h-2"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div 
              className="bg-primary rounded-full h-2 transition-all" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-1 max-h-20 overflow-hidden">
          {list.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-sm">
              {item.completed ? (
                <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
              ) : (
                <Circle className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              )}
              <span className={`truncate ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {item.text}
              </span>
            </div>
          ))}
          {list.items.length > 3 && (
            <div className="text-xs text-muted-foreground">
              +{list.items.length - 3} mais itens...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
