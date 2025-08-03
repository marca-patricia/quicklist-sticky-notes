
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
import { Trash2, Archive, ArchiveRestore } from 'lucide-react';

interface PostItCardProps {
  list: TodoList;
  isGridView?: boolean;
}

export const PostItCard: React.FC<PostItCardProps> = ({ list, isGridView = false }) => {
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

  const handleColorChange = (color: string) => {
    console.log('Changing color to:', color);
    updateList(list.id, { color });
    showSuccess('Cor alterada com sucesso!');
  };

  // Function to darken color for better contrast
  const darkenColor = (hex: string, amount: number = 0.15) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
    const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - amount)));
    const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - amount)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  // Function to lighten color slightly
  const lightenColor = (hex: string, amount: number = 0.05) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * amount));
    const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * amount));
    const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const postItColor = list.color;
  const darkerColor = darkenColor(postItColor, 0.2);
  const lighterColor = lightenColor(postItColor, 0.05);

  const getPostItStyle = (color: string) => {
    return {
      backgroundColor: color,
      color: '#1a1a1a',
      border: `2px solid ${darkenColor(color, 0.1)}`,
      boxShadow: `0 4px 12px ${darkenColor(color, 0.3)}40`
    };
  };

  const cardStyle = getPostItStyle(postItColor);

  return (
    <div className="relative group transform">
      <div 
        onClick={() => window.location.href = `/list/${list.id}`}
        className={`
          relative transform transition-all duration-300 ease-out
          hover:scale-105 hover:-rotate-0 animate-fade-in-up
          cursor-pointer group
          ${isGridView ? 'min-h-[100px] p-3 m-1 rotate-1 hover:rotate-0' : 'min-h-[90px] p-3 m-1 rotate-2 hover:rotate-1'}
          rounded-xl
        `}
        style={cardStyle}
        role="article"
        aria-describedby={`list-progress-${list.id}`}
        aria-label={`Abrir lista ${list.title} com ${completedItems.length} de ${list.items.length} tarefas concluídas`}
      >
        {/* Enhanced shadow for better depth */}
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `linear-gradient(145deg, ${lighterColor}, ${darkerColor})`,
            opacity: 0.3
          }}
        />

        {/* Post-it corner fold */}
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 opacity-40 rounded-bl-xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 45%, ${darkerColor} 50%, ${darkenColor(postItColor, 0.3)} 55%, transparent 60%)`,
            clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          <div className={`flex justify-between items-start ${isGridView ? 'mb-2' : 'mb-1'}`}>
            <h3 
              className={`font-bold flex-1 leading-tight ${isGridView ? 'text-sm' : 'text-sm'} mr-2 dark:text-black dark:font-extrabold`}
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#1a1a1a',
                textShadow: `0 1px 2px ${lighterColor}`
              }}
              title={list.title}
            >
              {list.title}
            </h3>
            <div 
              className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0`} 
              onClick={(e) => e.stopPropagation()}
            >
              {!isGridView && (
                <ColorPicker 
                  selectedColor={list.color}
                  onColorChange={handleColorChange}
                  className="w-5 h-5"
                  aria-label={`Alterar cor da lista ${list.title}`}
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchiveToggle();
                }}
                className="w-5 h-5 p-0 rounded-full transition-all duration-200 hover:scale-110 dark:text-black"
                style={{ 
                  backgroundColor: lighterColor,
                  color: '#1a1a1a',
                  border: `1px solid ${darkerColor}`
                }}
                aria-label={list.archived ? t('unarchive') : t('archiveList')}
                title={list.archived ? t('unarchive') : t('archiveList')}
              >
                {list.archived ? (
                  <ArchiveRestore className="w-3 h-3" strokeWidth={2.5} />
                ) : (
                  <Archive className="w-3 h-3" strokeWidth={2.5} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="w-5 h-5 p-0 rounded-full transition-all duration-200 hover:scale-110"
                style={{ 
                  backgroundColor: lighterColor,
                  color: '#dc2626',
                  border: `1px solid ${darkerColor}`
                }}
                aria-label={t('confirmDeleteList')}
                title={t('deleteList')}
              >
                <Trash2 className="w-3 h-3" strokeWidth={2.5} />
              </Button>
            </div>
          </div>
          
          {/* Description for grid view */}
          {isGridView && list.description && (
              <p 
              className="text-xs mb-2 line-clamp-2 leading-relaxed opacity-80 dark:text-black dark:font-semibold"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                color: '#1a1a1a'
              }}
            >
              {list.description}
            </p>
          )}
          
          <div className={`${isGridView ? 'flex-1 flex flex-col justify-end' : ''}`}>
            <div className={isGridView ? 'mb-2' : 'mb-1'} id={`list-progress-${list.id}`}>
              <div className={`flex justify-between text-xs font-medium ${isGridView ? 'mb-1' : 'mb-1'}`}>
                <span 
                  className="font-semibold dark:text-black dark:font-bold"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    color: '#1a1a1a'
                  }}
                >
                  {completedItems.length}/{list.items.length} {t('completed')}
                </span>
                <span 
                  className="font-semibold dark:text-black dark:font-bold"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    color: '#1a1a1a'
                  }}
                >
                  {Math.round(progress)}%
                </span>
              </div>
              <div 
                className="w-full rounded-full h-2 shadow-inner"
                style={{
                  backgroundColor: darkerColor,
                  border: `1px solid ${darkenColor(postItColor, 0.3)}`
                }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progresso da lista: ${Math.round(progress)}% concluído`}
              >
                <div 
                  className="bg-green-600 rounded-full h-full transition-all shadow-sm" 
                  style={{ 
                    width: `${progress}%`,
                    backgroundColor: '#059669'
                  }}
                />
              </div>
            </div>

            {/* Grid view color picker */}
            {isGridView && (
              <div className="flex justify-center pt-1" onClick={(e) => e.stopPropagation()}>
                <ColorPicker 
                  selectedColor={list.color}
                  onColorChange={handleColorChange}
                  className="w-6 h-6"
                  aria-label={`Alterar cor da lista ${list.title}`}
                />
              </div>
            )}
          </div>
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
    </div>
  );
};
