
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TodoList } from '@/contexts/ListsContext';
import { useLists } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Archive, ArchiveRestore, Trash2 } from 'lucide-react';

interface PostItCardProps {
  list: TodoList;
  isGridView?: boolean;
}

export const PostItCard: React.FC<PostItCardProps> = ({ list, isGridView = false }) => {
  const { deleteList, updateList } = useLists();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const completedItems = list.items.filter(item => item.completed).length;
  const totalItems = list.items.length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const handleCardClick = () => {
    navigate(`/list/${list.id}`);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateList(list.id, { archived: !list.archived });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('confirmDeleteList'))) {
      deleteList(list.id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative rounded-lg p-4 shadow-soft border border-gray-200 dark:border-white/20 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 min-h-[180px] flex flex-col"
      style={{ backgroundColor: list.color }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
      aria-label={`${t('openList')} ${list.title}`}
    >
      {/* Header with title and menu */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-900 line-clamp-2 flex-1 pr-2">
          {list.title}
        </h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-600 hover:text-gray-800 hover:bg-white/50"
              onClick={(e) => e.stopPropagation()}
              aria-label={t('moreOptions')}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/list/${list.id}/edit`); }}>
              <Edit className="w-4 h-4 mr-2" />
              {t('edit')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleArchive}>
              {list.archived ? (
                <>
                  <ArchiveRestore className="w-4 h-4 mr-2" />
                  {t('unarchive')}
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4 mr-2" />
                  {t('archive')}
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              {t('delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Progress section */}
      <div className="mb-4 flex-1">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-700 mb-1">
          <span>{completedItems}/{totalItems} {t('completed')}</span>
          <span>{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Action buttons - Now below progress */}
      <div className="flex gap-2 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-gray-600 hover:text-gray-800 hover:bg-white/50"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/list/${list.id}/edit`);
          }}
          aria-label={t('editList')}
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-gray-600 hover:text-gray-800 hover:bg-white/50"
          onClick={handleArchive}
          aria-label={list.archived ? t('unarchive') : t('archive')}
        >
          {list.archived ? (
            <ArchiveRestore className="h-4 w-4" />
          ) : (
            <Archive className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-white/50"
          onClick={handleDelete}
          aria-label={t('deleteList')}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
