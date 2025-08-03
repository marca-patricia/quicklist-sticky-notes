
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

  // Improved color system with better contrast
  const getPostItColors = (color: string) => {
    const colorMap = {
      '#fef3c7': {
        background: '#fef3c7',
        backgroundDark: '#451a03',
        textColor: '#1f2937',
        textColorDark: '#fef3c7',
        iconBg: 'rgba(255, 255, 255, 0.95)',
        iconBgDark: 'rgba(0, 0, 0, 0.1)',
        iconColor: '#1f2937',
        iconColorDark: '#fef3c7',
        shadow: '0 4px 12px rgba(251, 191, 36, 0.25)'
      },
      '#dcfce7': {
        background: '#dcfce7',
        backgroundDark: '#14532d',
        textColor: '#1f2937',
        textColorDark: '#dcfce7',
        iconBg: 'rgba(255, 255, 255, 0.95)',
        iconBgDark: 'rgba(0, 0, 0, 0.1)',
        iconColor: '#1f2937',
        iconColorDark: '#dcfce7',
        shadow: '0 4px 12px rgba(34, 197, 94, 0.25)'
      },
      '#fce7f3': {
        background: '#fce7f3',
        backgroundDark: '#831843',
        textColor: '#1f2937',
        textColorDark: '#fce7f3',
        iconBg: 'rgba(255, 255, 255, 0.95)',
        iconBgDark: 'rgba(0, 0, 0, 0.1)',
        iconColor: '#1f2937',
        iconColorDark: '#fce7f3',
        shadow: '0 4px 12px rgba(236, 72, 153, 0.25)'
      },
      '#e0e7ff': {
        background: '#e0e7ff',
        backgroundDark: '#312e81',
        textColor: '#1f2937',
        textColorDark: '#e0e7ff',
        iconBg: 'rgba(255, 255, 255, 0.95)',
        iconBgDark: 'rgba(0, 0, 0, 0.1)',
        iconColor: '#1f2937',
        iconColorDark: '#e0e7ff',
        shadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
      },
      '#fed7d7': {
        background: '#fed7d7',
        backgroundDark: '#7c2d12',
        textColor: '#1f2937',
        textColorDark: '#fed7d7',
        iconBg: 'rgba(255, 255, 255, 0.95)',
        iconBgDark: 'rgba(0, 0, 0, 0.1)',
        iconColor: '#1f2937',
        iconColorDark: '#fed7d7',
        shadow: '0 4px 12px rgba(249, 115, 22, 0.25)'
      },
      '#f3e8ff': {
        background: '#f3e8ff',
        backgroundDark: '#581c87',
        textColor: '#1f2937',
        textColorDark: '#f3e8ff',
        iconBg: 'rgba(255, 255, 255, 0.95)',
        iconBgDark: 'rgba(0, 0, 0, 0.1)',
        iconColor: '#1f2937',
        iconColorDark: '#f3e8ff',
        shadow: '0 4px 12px rgba(168, 85, 247, 0.25)'
      },
      '#f1f5f9': {
        background: '#f1f5f9',
        backgroundDark: '#334155',
        textColor: '#1f2937',
        textColorDark: '#f1f5f9',
        iconBg: 'rgba(255, 255, 255, 0.95)',
        iconBgDark: 'rgba(0, 0, 0, 0.1)',
        iconColor: '#1f2937',
        iconColorDark: '#f1f5f9',
        shadow: '0 4px 12px rgba(100, 116, 139, 0.25)'
      },
      '#ecfdf5': {
        background: '#ecfdf5',
        backgroundDark: '#064e3b',
        textColor: '#1f2937',
        textColorDark: '#ecfdf5',
        iconBg: 'rgba(255, 255, 255, 0.95)',
        iconBgDark: 'rgba(0, 0, 0, 0.1)',
        iconColor: '#1f2937',
        iconColorDark: '#ecfdf5',
        shadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
      }
    };

    return colorMap[color] || colorMap['#fef3c7'];
  };

  const colors = getPostItColors(list.color);
  const isDark = document.documentElement.classList.contains('dark');

  const cardStyle = {
    backgroundColor: isDark ? colors.backgroundDark : colors.background,
    color: isDark ? colors.textColorDark : colors.textColor,
    boxShadow: colors.shadow,
    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
  };

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
            ${isGridView ? 'min-h-[120px] p-2 m-1 rotate-1 hover:rotate-0' : 'min-h-[100px] p-2 m-1 rotate-2 hover:rotate-1'}
            rounded-lg
          `}
          style={cardStyle}
          role="article"
          aria-describedby={`list-progress-${list.id}`}
        >
          {/* Enhanced shadow for better depth */}
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              boxShadow: isDark 
                ? 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)'
                : 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.05)'
            }}
          />

          {/* Post-it corner fold */}
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 opacity-30 rounded-bl-lg pointer-events-none"
            style={{
              background: isDark
                ? `linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 60%)`
                : `linear-gradient(135deg, transparent 45%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.08) 55%, transparent 60%)`,
              clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            <div className={`flex justify-between items-start ${isGridView ? 'mb-1' : 'mb-2'}`}>
              <h3 
                className={`font-bold flex-1 leading-tight ${isGridView ? 'text-xs' : 'text-sm'} mr-1`}
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  textShadow: isDark ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(255,255,255,0.4)',
                  color: isDark ? colors.textColorDark : colors.textColor
                }}
                title={list.title}
              >
                {list.title}
              </h3>
              <div 
                className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0`} 
                onClick={(e) => e.preventDefault()}
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
                    e.preventDefault();
                    handleArchiveToggle();
                  }}
                  className="w-5 h-5 p-0 rounded-full transition-all duration-200 shadow-sm hover:shadow-md border border-gray-300/50 dark:border-gray-600/50"
                  style={{
                    backgroundColor: isDark ? colors.iconBgDark : colors.iconBg,
                    color: isDark ? colors.iconColorDark : colors.iconColor,
                  }}
                  aria-label={list.archived ? t('unarchive') : t('archiveList')}
                  title={list.archived ? t('unarchive') : t('archiveList')}
                >
                  {list.archived ? (
                    <ArchiveRestore 
                      className="w-2.5 h-2.5" 
                      strokeWidth={2.5}
                      style={{ color: isDark ? colors.iconColorDark : colors.iconColor }}
                    />
                  ) : (
                    <Archive 
                      className="w-2.5 h-2.5" 
                      strokeWidth={2.5}
                      style={{ color: isDark ? colors.iconColorDark : colors.iconColor }}
                    />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDeleteConfirm(true);
                  }}
                  className="w-5 h-5 p-0 rounded-full transition-all duration-200 shadow-sm hover:shadow-md border border-gray-300/50 dark:border-gray-600/50"
                  style={{
                    backgroundColor: isDark ? colors.iconBgDark : colors.iconBg,
                  }}
                  aria-label={t('confirmDeleteList')}
                  title={t('deleteList')}
                >
                  <Trash2 
                    className="w-2.5 h-2.5" 
                    strokeWidth={2.5} 
                    style={{ color: '#dc2626' }} 
                  />
                </Button>
              </div>
            </div>
            
            {/* Description for grid view */}
            {isGridView && list.description && (
              <p 
                className="text-xs mb-1 line-clamp-2 leading-relaxed opacity-80"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  color: isDark ? colors.textColorDark : colors.textColor
                }}
              >
                {list.description}
              </p>
            )}
            
            <div className={`${isGridView ? 'flex-1 flex flex-col justify-end' : ''}`}>
              <div className={isGridView ? 'mb-1' : 'mb-2'} id={`list-progress-${list.id}`}>
                <div className={`flex justify-between text-xs font-medium ${isGridView ? 'mb-0.5' : 'mb-1'}`}>
                  <span 
                    className="font-medium"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      color: isDark ? colors.textColorDark : colors.textColor
                    }}
                  >
                    {completedItems.length}/{list.items.length} {t('completed')}
                  </span>
                  <span 
                    className="font-medium"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      color: isDark ? colors.textColorDark : colors.textColor
                    }}
                  >
                    {Math.round(progress)}%
                  </span>
                </div>
                <div 
                  className="w-full bg-black/10 dark:bg-white/20 rounded-full h-1 shadow-inner"
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progresso da lista: ${Math.round(progress)}% concluído`}
                >
                  <div 
                    className="bg-green-600 dark:bg-green-400 rounded-full h-1 transition-all shadow-sm" 
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
      </Link>
    </div>
  );
};
