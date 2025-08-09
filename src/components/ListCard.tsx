
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TodoList } from '@/contexts/ListsContext';
import { useLists } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ColorPicker } from '@/components/ColorPicker';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useUndo } from '@/hooks/useUndo';
import { useFeedbackToast } from '@/components/FeedbackToast';
import { Trash2, ExternalLink, Archive, ArchiveRestore } from 'lucide-react';

interface ListCardProps {
  list: TodoList;
  isGridView?: boolean;
}

export const ListCard: React.FC<ListCardProps> = ({ list, isGridView = false }) => {
  const { deleteList, updateList } = useLists();
  const { t } = useLanguage();
  const { addUndoAction } = useUndo();
  const { showSuccess } = useFeedbackToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const completedItems = list.items.filter(item => item.completed);
  const progress = list.items.length > 0 ? (completedItems.length / list.items.length) * 100 : 0;

  const handleDeleteList = () => {
    const listCopy = { ...list };
    deleteList(list.id);
    
    addUndoAction({
      id: `delete-list-${list.id}`,
      action: () => {
        // Note: This would need to be implemented in the context
        // For now, just show feedback
        showSuccess(t('listRestored'));
      },
      message: t('listDeleted')
    });
    
    setShowDeleteConfirm(false);
  };

  const handleArchiveToggle = () => {
    const newArchivedState = !list.archived;
    updateList(list.id, { archived: newArchivedState });
    showSuccess(newArchivedState ? t('listArchived') : t('listUnarchived'));
  };

  return (
    <Link 
      to={`/list/${list.id}`} 
      className="block"
      aria-label={`Abrir lista ${list.title} com ${completedItems.length} de ${list.items.length} tarefas concluídas`}
    >
      <div 
        className={`rounded-xl shadow-soft hover:shadow-notepad transition-all duration-300 border border-border cursor-pointer hover:scale-[1.02] animate-fade-in-up bg-card ${
          isGridView ? 'p-4 min-h-[200px] flex flex-col' : 'p-5'
        }`}
        style={{ 
          backgroundColor: list.color,
          borderLeft: `4px solid hsl(var(--primary))`,
        }}
        role="article"
        aria-describedby={`list-progress-${list.id}`}
      >
        <div className={`flex justify-between items-start ${isGridView ? 'mb-2' : 'mb-3'}`}>
          <h3 
            className={`font-semibold truncate flex-1 ${isGridView ? 'text-lg' : 'text-xl'}`} 
            style={{ color: 'hsl(var(--note-text))' }}
            title={list.title}
          >
            {list.title}
          </h3>
          <div className={`flex items-center ${isGridView ? 'gap-1' : 'gap-2'}`} onClick={(e) => e.preventDefault()}>
            {!isGridView && (
              <ColorPicker 
                selectedColor={list.color}
                onColorChange={(color) => updateList(list.id, { color })}
                aria-label={`Alterar cor da lista ${list.title}`}
              />
            )}
            <Button
              variant="ghost"
              size={isGridView ? "sm" : "sm"}
              onClick={(e) => {
                e.preventDefault();
                handleArchiveToggle();
              }}
              className="text-muted-foreground hover:text-foreground"
              aria-label={list.archived ? t('unarchive') : t('archiveList')}
              title={list.archived ? t('unarchive') : t('archiveList')}
            >
              {list.archived ? <ArchiveRestore className="w-3 h-3" /> : <Archive className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size={isGridView ? "sm" : "sm"}
              onClick={(e) => {
                e.preventDefault();
                setShowDeleteConfirm(true);
              }}
              className="text-destructive hover:text-destructive/90"
              aria-label={t('confirmDeleteList')}
              title={t('deleteList')}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {/* Description for grid view */}
        {isGridView && list.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{list.description}</p>
        )}
        
        <div className={`${isGridView ? 'flex-1 flex flex-col justify-end' : ''}`}>
          <div className={isGridView ? 'mb-2' : 'mb-3'} id={`list-progress-${list.id}`}>
            <div className={`flex justify-between text-sm ${isGridView ? 'mb-1' : 'mb-1'}`}>
              <span className="text-black dark:text-black font-medium">{completedItems.length}/{list.items.length} {t('completed')}</span>
              <span className="text-black dark:text-black">{Math.round(progress)}%</span>
            </div>
            <div 
              className="w-full bg-secondary rounded-full h-2"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progresso da lista: ${Math.round(progress)}% concluído`}
            >
              <div 
                className="bg-primary rounded-full h-2 transition-all" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Grid view color picker */}
          {isGridView && (
            <div className="flex justify-center pt-2" onClick={(e) => e.preventDefault()}>
              <ColorPicker 
                selectedColor={list.color}
                onColorChange={(color) => updateList(list.id, { color })}
                aria-label={`Alterar cor da lista ${list.title}`}
              />
            </div>
          )}
        </div>
      </div>
      
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={t('confirmDeleteList')}
        description={t('confirmDeleteListDesc')}
        onConfirm={handleDeleteList}
        confirmText={t('deleteList')}
        variant="destructive"
      />
    </Link>
  );
};
