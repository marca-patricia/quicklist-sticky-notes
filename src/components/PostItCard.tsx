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

  // Post-it colors based on list color
  const getPostItStyle = (color: string) => {
    return {
      backgroundColor: color,
      background: `linear-gradient(135deg, ${color} 0%, ${color}f0 100%)`,
    };
  };

  return (
    <div className="relative group">
      {/* Pin */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-5 h-5 bg-red-500 rounded-full shadow-lg flex items-center justify-center">
          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
        </div>
        <div className="w-1 h-3 bg-gray-400 mx-auto shadow-sm"></div>
      </div>

      <Link 
        to={`/list/${list.id}`} 
        className="block"
        aria-label={`Abrir lista ${list.title} com ${completedItems.length} de ${list.items.length} tarefas concluídas`}
      >
        <div 
          className={`
            relative transform rotate-1 hover:rotate-0 transition-all duration-300 
            cursor-pointer hover:scale-105 animate-fade-in-up
            shadow-xl hover:shadow-2xl
            ${isGridView ? 'min-h-[220px] p-4' : 'min-h-[180px] p-5'}
          `}
          style={getPostItStyle(list.color)}
          role="article"
          aria-describedby={`list-progress-${list.id}`}
        >
          {/* Post-it corner fold */}
          <div 
            className="absolute bottom-0 right-0 w-8 h-8 opacity-20"
            style={{
              background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.1) 50%)`,
              clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)'
            }}
          ></div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            <div className={`flex justify-between items-start ${isGridView ? 'mb-2' : 'mb-3'}`}>
              <h3 
                className={`font-bold text-gray-800 flex-1 leading-tight ${isGridView ? 'text-lg' : 'text-xl'}`}
                style={{ 
                  fontFamily: 'cursive',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
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
                  className="text-gray-600 hover:text-gray-800 bg-white/20 hover:bg-white/40 rounded-full"
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
                  className="text-red-600 hover:text-red-800 bg-white/20 hover:bg-white/40 rounded-full"
                  aria-label={t('confirmDeleteList')}
                  title={t('deleteList')}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            {/* Description for grid view */}
            {isGridView && list.description && (
              <p 
                className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed"
                style={{ fontFamily: 'cursive' }}
              >
                {list.description}
              </p>
            )}
            
            <div className={`${isGridView ? 'flex-1 flex flex-col justify-end' : ''}`}>
              <div className={isGridView ? 'mb-2' : 'mb-3'} id={`list-progress-${list.id}`}>
                <div className={`flex justify-between text-sm ${isGridView ? 'mb-2' : 'mb-2'}`}>
                  <span 
                    className="text-gray-700 font-semibold"
                    style={{ fontFamily: 'cursive' }}
                  >
                    {completedItems.length}/{list.items.length} {t('completed')}
                  </span>
                  <span 
                    className="text-gray-700 font-semibold"
                    style={{ fontFamily: 'cursive' }}
                  >
                    {Math.round(progress)}%
                  </span>
                </div>
                <div 
                  className="w-full bg-black/10 rounded-full h-2 shadow-inner"
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progresso da lista: ${Math.round(progress)}% concluído`}
                >
                  <div 
                    className="bg-green-600 rounded-full h-2 transition-all shadow-sm" 
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
    </div>
  );
};