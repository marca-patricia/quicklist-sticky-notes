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

  // Post-it colors - cores realistas de post-it
  const getPostItStyle = (color: string) => {
    const postItColors = {
      '#fef3c7': { // Amarelo clássico
        bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #f59e0b 100%)',
        shadow: '0 8px 25px -8px rgba(245, 158, 11, 0.4), 0 4px 12px -4px rgba(245, 158, 11, 0.3)',
        texture: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,.02) 1px, rgba(0,0,0,.02) 2px)'
      },
      '#dcfce7': { // Verde menta
        bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 30%, #16a34a 100%)',
        shadow: '0 8px 25px -8px rgba(22, 163, 74, 0.4), 0 4px 12px -4px rgba(22, 163, 74, 0.3)',
        texture: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,.02) 1px, rgba(0,0,0,.02) 2px)'
      },
      '#fce7f3': { // Rosa suave
        bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 30%, #ec4899 100%)',
        shadow: '0 8px 25px -8px rgba(236, 72, 153, 0.4), 0 4px 12px -4px rgba(236, 72, 153, 0.3)',
        texture: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,.02) 1px, rgba(0,0,0,.02) 2px)'
      },
      '#e0e7ff': { // Azul claro
        bg: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 30%, #6366f1 100%)',
        shadow: '0 8px 25px -8px rgba(99, 102, 241, 0.4), 0 4px 12px -4px rgba(99, 102, 241, 0.3)',
        texture: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,.02) 1px, rgba(0,0,0,.02) 2px)'
      },
      '#fed7d7': { // Laranja pêssego
        bg: 'linear-gradient(135deg, #fed7d7 0%, #fecaca 30%, #f97316 100%)',
        shadow: '0 8px 25px -8px rgba(249, 115, 22, 0.4), 0 4px 12px -4px rgba(249, 115, 22, 0.3)',
        texture: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,.02) 1px, rgba(0,0,0,.02) 2px)'
      },
      '#f3e8ff': { // Roxo lavanda
        bg: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 30%, #a855f7 100%)',
        shadow: '0 8px 25px -8px rgba(168, 85, 247, 0.4), 0 4px 12px -4px rgba(168, 85, 247, 0.3)',
        texture: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,.02) 1px, rgba(0,0,0,.02) 2px)'
      },
      '#f1f5f9': { // Cinza pérola
        bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 30%, #64748b 100%)',
        shadow: '0 8px 25px -8px rgba(100, 116, 139, 0.4), 0 4px 12px -4px rgba(100, 116, 139, 0.3)',
        texture: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,.02) 1px, rgba(0,0,0,.02) 2px)'
      },
      '#ecfdf5': { // Verde água
        bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 30%, #059669 100%)',
        shadow: '0 8px 25px -8px rgba(5, 150, 105, 0.4), 0 4px 12px -4px rgba(5, 150, 105, 0.3)',
        texture: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,.02) 1px, rgba(0,0,0,.02) 2px)'
      }
    };

    const selectedColor = postItColors[color] || postItColors['#fef3c7'];
    
    return {
      background: selectedColor.bg,
      boxShadow: selectedColor.shadow,
      backgroundImage: selectedColor.texture,
      backdropFilter: 'blur(1px)',
    };
  };

  return (
    <div className="relative group transform">{/* Pin removido */}

      <Link 
        to={`/list/${list.id}`} 
        className="block"
        aria-label={`Abrir lista ${list.title} com ${completedItems.length} de ${list.items.length} tarefas concluídas`}
      >
        <div 
          className={`
            relative transform transition-all duration-300 ease-out
            hover:scale-105 hover:-rotate-0 animate-fade-in-up
            cursor-pointer group
            ${isGridView ? 'min-h-[240px] p-6 m-4 rotate-1 hover:rotate-0' : 'min-h-[200px] p-6 m-3 rotate-2 hover:rotate-1'}
          `}
          style={{
            ...getPostItStyle(list.color),
            filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.15)) drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '8px',
          }}
          role="article"
          aria-describedby={`list-progress-${list.id}`}
        >
          {/* Sombra interna realista */}
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.05)'
            }}
          ></div>

          {/* Post-it corner fold mais realista */}
          <div 
            className="absolute bottom-0 right-0 w-10 h-10 opacity-30 rounded-bl-lg pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent 45%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.08) 55%, transparent 60%)`,
              clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
              filter: 'blur(0.5px)'
            }}
          ></div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            <div className={`flex justify-between items-start ${isGridView ? 'mb-3' : 'mb-4'}`}>
              <h3 
                className={`font-bold text-gray-900 flex-1 leading-tight ${isGridView ? 'text-lg' : 'text-xl'}`}
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                  color: '#1f2937'
                }}
                title={list.title}
              >
                {list.title}
              </h3>
              <div className={`flex items-center ${isGridView ? 'gap-1' : 'gap-2'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} onClick={(e) => e.preventDefault()}>
                {!isGridView && (
                  <ColorPicker 
                    selectedColor={list.color}
                    onColorChange={(color) => updateList(list.id, { color })}
                    aria-label={`Alterar cor da lista ${list.title}`}
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleArchiveToggle();
                  }}
                  className="text-gray-700 hover:text-gray-900 bg-white/60 hover:bg-white/80 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label={list.archived ? t('unarchive') : t('archiveList')}
                  title={list.archived ? t('unarchive') : t('archiveList')}
                >
                  {list.archived ? <ArchiveRestore className="w-3 h-3" /> : <Archive className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDeleteConfirm(true);
                  }}
                  className="text-red-700 hover:text-red-900 bg-white/60 hover:bg-red-50 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
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
                className="text-sm text-gray-800 mb-4 line-clamp-2 leading-relaxed"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: '#374151'
                }}
              >
                {list.description}
              </p>
            )}
            
            <div className={`${isGridView ? 'flex-1 flex flex-col justify-end' : ''}`}>
              <div className={isGridView ? 'mb-3' : 'mb-4'} id={`list-progress-${list.id}`}>
                <div className={`flex justify-between text-sm font-medium ${isGridView ? 'mb-2' : 'mb-2'}`}>
                  <span 
                    className="text-gray-800"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      color: '#374151'
                    }}
                  >
                    {completedItems.length}/{list.items.length} {t('completed')}
                  </span>
                  <span 
                    className="text-gray-800"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      color: '#374151'
                    }}
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