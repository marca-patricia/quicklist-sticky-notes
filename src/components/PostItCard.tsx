
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Archive, Edit2, MoreVertical } from 'lucide-react';
import { TodoList, useLists } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface PostItCardProps {
  list: TodoList;
}

export const PostItCard: React.FC<PostItCardProps> = ({ list }) => {
  const navigate = useNavigate();
  const { deleteList, updateList } = useLists();
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const completedItems = list.items.filter(item => item.completed).length;
  const totalItems = list.items.length;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('confirmDeleteListDesc'))) {
      deleteList(list.id);
    }
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateList(list.id, { archived: !list.archived });
  };

  const handleCardClick = () => {
    navigate(`/list/${list.id}`);
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 relative group"
      style={{ backgroundColor: list.color }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-foreground truncate pr-2">
            {list.title}
          </h3>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${isHovered ? 'opacity-100' : ''}`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="h-4 w-4 mr-2" />
                {list.archived ? t('unarchive') : t('archiveList')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                {t('deleteList')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {list.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {list.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {totalItems > 0 && (
              <Badge variant="secondary" className="text-xs">
                {completedItems}/{totalItems} {t('completed')}
              </Badge>
            )}
            {list.archived && (
              <Badge variant="outline" className="text-xs">
                Arquivada
              </Badge>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            {new Date(list.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        {totalItems > 0 && (
          <div className="mt-2">
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${totalItems > 0 ? (completedItems / totalItems) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
