
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Archive, 
  ArchiveRestore,
  CheckCircle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { TodoList } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';

interface PostItCardProps {
  list: TodoList;
  isGridView?: boolean;
}

export const PostItCard: React.FC<PostItCardProps> = ({
  list,
  isGridView = false
}) => {
  const { t } = useLanguage();
  const { deleteList, updateList } = useLists();
  
  const completedItems = list.items.filter(item => item.completed).length;
  const totalItems = list.items.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger onClick if clicking on dropdown menu
    if ((e.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return;
    }
    // Navigate to list detail view
    window.location.href = `/list/${list.id}`;
  };

  const handleEdit = () => {
    // Navigate to edit view
    window.location.href = `/list/${list.id}/edit`;
  };

  const handleDelete = () => {
    if (window.confirm(t('confirmDelete'))) {
      deleteList(list.id);
    }
  };

  const handleArchive = () => {
    updateList(list.id, { ...list, archived: !list.archived });
  };

  return (
    <Card 
      className="relative cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 border-none shadow-md"
      style={{ backgroundColor: list.color }}
      onClick={handleCardClick}
    >
      <CardContent className="p-4 h-40 flex flex-col">
        {/* Header with title and dropdown */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 flex-1 pr-2">
            {list.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild data-dropdown-trigger>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-white/50"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(); }}>
                <Edit className="mr-2 h-4 w-4" />
                {t('edit')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); handleArchive(); }}
                className="text-orange-600"
              >
                {list.archived ? (
                  <>
                    <ArchiveRestore className="mr-2 h-4 w-4" />
                    {t('unarchive')}
                  </>
                ) : (
                  <>
                    <Archive className="mr-2 h-4 w-4" />
                    {t('archive')}
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {list.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {list.description}
          </p>
        )}

        {/* Progress Section */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>{completedItems}/{totalItems} {t('completed')}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2 bg-white/30"
          />

          {/* Action Icons Row - Below Progress */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              {totalItems > 0 && (
                <Badge variant="secondary" className="bg-white/20 text-gray-700 border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {totalItems}
                </Badge>
              )}
            </div>
            
            <div className="text-xs text-gray-600">
              {new Date(list.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
