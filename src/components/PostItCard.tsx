
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
    updateList(list.id, { color });
    showSuccess('Cor alterada com sucesso!');
  };

  // Post-it colors - cores realistas com melhor contraste
  const getPostItStyle = (color: string) => {
    const postItColors = {
      '#fef3c7': { // Amarelo clássico
        bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #fbbf24 100%)',
        bgDark: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 30%, #d97706 100%)',
        shadow: '0 6px 20px -6px rgba(251, 191, 36, 0.4), 0 3px 8px -3px rgba(251, 191, 36, 0.3)',
        shadowDark: '0 6px 20px -6px rgba(251, 191, 36, 0.5), 0 3px 8px -3px rgba(251, 191, 36, 0.4)',
        textColor: '#1f2937',
        textColorDark: '#1f2937'
      },
      '#dcfce7': { // Verde menta
        bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 30%, #34d399 100%)',
        bgDark: 'linear-gradient(135deg, #34d399 0%, #10b981 30%, #059669 100%)',
        shadow: '0 6px 20px -6px rgba(52, 211, 153, 0.4), 0 3px 8px -3px rgba(52, 211, 153, 0.3)',
        shadowDark: '0 6px 20px -6px rgba(52, 211, 153, 0.5), 0 3px 8px -3px rgba(52, 211, 153, 0.4)',
        textColor: '#1f2937',
        textColorDark: '#1f2937'
      },
      '#fce7f3': { // Rosa suave
        bg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 30%, #f472b6 100%)',
        bgDark: 'linear-gradient(135deg, #f472b6 0%, #ec4899 30%, #db2777 100%)',
        shadow: '0 6px 20px -6px rgba(244, 114, 182, 0.4), 0 3px 8px -3px rgba(244, 114, 182, 0.3)',
        shadowDark: '0 6px 20px -6px rgba(244, 114, 182, 0.5), 0 3px 8px -3px rgba(244, 114, 182, 0.4)',
        textColor: '#1f2937',
        textColorDark: '#ffffff'
      },
      '#e0e7ff': { // Azul claro
        bg: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 30%, #818cf8 100%)',
        bgDark: 'linear-gradient(135deg, #818cf8 0%, #6366f1 30%, #4f46e5 100%)',
        shadow: '0 6px 20px -6px rgba(129, 140, 248, 0.4), 0 3px 8px -3px rgba(129, 140, 248, 0.3)',
        shadowDark: '0 6px 20px -6px rgba(129, 140, 248, 0.5), 0 3px 8px -3px rgba(129, 140, 248, 0.4)',
        textColor: '#1f2937',
        textColorDark: '#ffffff'
      },
      '#fed7d7': { // Laranja pêssego
        bg: 'linear-gradient(135deg, #fed7d7 0%, #fecaca 30%, #fb923c 100%)',
        bgDark: 'linear-gradient(135deg, #fb923c 0%, #f97316 30%, #ea580c 100%)',
        shadow: '0 6px 20px -6px rgba(251, 146, 60, 0.4), 0 3px 8px -3px rgba(251, 146, 60, 0.3)',
        shadowDark: '0 6px 20px -6px rgba(251, 146, 60, 0.5), 0 3px 8px -3px rgba(251, 146, 60, 0.4)',
        textColor: '#1f2937',
        textColorDark: '#ffffff'
      },
      '#f3e8ff': { // Roxo lavanda
        bg: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 30%, #c084fc 100%)',
        bgDark: 'linear-gradient(135deg, #c084fc 0%, #a855f7 30%, #9333ea 100%)',
        shadow: '0 6px 20px -6px rgba(192, 132, 252, 0.4), 0 3px 8px -3px rgba(192, 132, 252, 0.3)',
        shadowDark: '0 6px 20px -6px rgba(192, 132, 252, 0.5), 0 3px 8px -3px rgba(192, 132, 252, 0.4)',
        textColor: '#1f2937',
        textColorDark: '#ffffff'
      },
      '#f1f5f9': { // Cinza pérola
        bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 30%, #94a3b8 100%)',
        bgDark: 'linear-gradient(135deg, #64748b 0%, #475569 30%, #334155 100%)',
        shadow: '0 6px 20px -6px rgba(148, 163, 184, 0.4), 0 3px 8px -3px rgba(148, 163, 184, 0.3)',
        shadowDark: '0 6px 20px -6px rgba(100, 116, 139, 0.5), 0 3px 8px -3px rgba(100, 116, 139, 0.4)',
        textColor: '#1f2937',
        textColorDark: '#ffffff'
      },
      '#ecfdf5': { // Verde água
        bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 30%, #22d3ee 100%)',
        bgDark: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 30%, #0891b2 100%)',
        shadow: '0 6px 20px -6px rgba(34, 211, 238, 0.4), 0 3px 8px -3px rgba(34, 211, 238, 0.3)',
        shadowDark: '0 6px 20px -6px rgba(34, 211, 238, 0.5), 0 3px 8px -3px rgba(34, 211, 238, 0.4)',
        textColor: '#1f2937',
        textColorDark: '#ffffff'
      }
    };

    const selectedColor = postItColors[color] || postItColors['#fef3c7'];
    const isDark = document.documentElement.classList.contains('dark');
    
    return {
      background: isDark ? selectedColor.bgDark : selectedColor.bg,
      boxShadow: isDark ? selectedColor.shadowDark : selectedColor.shadow,
      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,.02) 1px, rgba(0,0,0,.02) 2px)',
      backdropFilter: 'blur(1px)',
      textColor: isDark ? selectedColor.textColorDark : selectedColor.textColor,
    };
  };

  const postItStyle = getPostItStyle(list.color);

  return (
    <div className="relative group transform">
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
            ${isGridView ? 'min-h-[200px] p-3 m-1 rotate-1 hover:rotate-0' : 'min-h-[180px] p-3 m-1 rotate-2 hover:rotate-1'}
            rounded-lg border border-black/10 dark:border-white/10
          `}
          style={{
            ...postItStyle,
            filter: 'drop-shadow(1px 3px 6px rgba(0,0,0,0.12)) drop-shadow(0 1px 3px rgba(0,0,0,0.08))',
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
          />

          {/* Post-it corner fold mais realista */}
          <div 
            className="absolute bottom-0 right-0 w-6 h-6 opacity-30 rounded-bl-lg pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent 45%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.08) 55%, transparent 60%)`,
              clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
              filter: 'blur(0.5px)'
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            <div className={`flex justify-between items-start ${isGridView ? 'mb-2' : 'mb-3'}`}>
              <h3 
                className={`font-bold flex-1 leading-tight ${isGridView ? 'text-sm' : 'text-base'} mr-1`}
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  textShadow: '0 1px 2px rgba(255,255,255,0.4)',
                  color: postItStyle.textColor
                }}
                title={list.title}
              >
                {list.title}
              </h3>
              <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0`} onClick={(e) => e.preventDefault()}>
                {!isGridView && (
                  <ColorPicker 
                    selectedColor={list.color}
                    onColorChange={handleColorChange}
                    className="w-6 h-6"
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
                  className="w-6 h-6 p-0 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    color: postItStyle.textColor,
                  }}
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
                  className="w-6 h-6 p-0 rounded-full transition-all duration-200 shadow-sm hover:shadow-md hover:bg-red-100"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    color: '#dc2626',
                  }}
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
                className="text-xs mb-2 line-clamp-2 leading-relaxed"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: postItStyle.textColor
                }}
              >
                {list.description}
              </p>
            )}
            
            <div className={`${isGridView ? 'flex-1 flex flex-col justify-end' : ''}`}>
              <div className={isGridView ? 'mb-2' : 'mb-3'} id={`list-progress-${list.id}`}>
                <div className={`flex justify-between text-xs font-medium ${isGridView ? 'mb-1' : 'mb-2'}`}>
                  <span 
                    className="font-medium"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      color: postItStyle.textColor
                    }}
                  >
                    {completedItems.length}/{list.items.length} {t('completed')}
                  </span>
                  <span 
                    className="font-medium"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      color: postItStyle.textColor
                    }}
                  >
                    {Math.round(progress)}%
                  </span>
                </div>
                <div 
                  className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 shadow-inner"
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progresso da lista: ${Math.round(progress)}% concluído`}
                >
                  <div 
                    className="bg-green-600 dark:bg-green-500 rounded-full h-1.5 transition-all shadow-sm" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Grid view color picker */}
              {isGridView && (
                <div className="flex justify-center pt-1" onClick={(e) => e.preventDefault()}>
                  <ColorPicker 
                    selectedColor={list.color}
                    onColorChange={handleColorChange}
                    className="w-8 h-8"
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
