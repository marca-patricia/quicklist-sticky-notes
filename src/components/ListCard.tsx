
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists, TodoList } from '@/contexts/ListsContext';
import { Link } from 'react-router-dom';
import { Trash2, ExternalLink, CheckCircle, Circle } from 'lucide-react';

interface ListCardProps {
  list: TodoList;
}

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
  const { t } = useLanguage();
  const { deleteList } = useLists();
  
  const totalItems = list.items.length;
  const completedItems = list.items.filter(item => item.completed).length;
  const pendingItems = totalItems - completedItems;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(t('deleteList') || 'Excluir esta lista?')) {
      deleteList(list.id);
    }
  };

  const handleAddToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const widgetUrl = `${window.location.origin}/?list=${list.id}&widget=true`;
    
    if (navigator.share) {
      navigator.share({
        title: `QuickList - ${list.title}`,
        url: widgetUrl
      });
    } else {
      navigator.clipboard.writeText(widgetUrl);
      alert('Link copiado! Cole na barra de endereços e adicione à tela inicial');
    }
  };

  return (
    <Link to={`/list/${list.id}`} className="block">
      <Card className={`p-4 hover:shadow-notepad transition-all duration-200 border-l-4 ${list.color} group`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate text-foreground group-hover:text-primary transition-colors">
              {list.title}
            </h3>
            
            <div className="flex items-center gap-2 mt-2">
              {pendingItems > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <Circle className="w-3 h-3 mr-1" />
                  {pendingItems}
                </Badge>
              )}
              {completedItems > 0 && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {completedItems}
                </Badge>
              )}
            </div>
            
            {list.items.length > 0 && (
              <div className="mt-3 space-y-1">
                {list.items.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    {item.completed ? (
                      <CheckCircle className="w-3 h-3 text-primary" />
                    ) : (
                      <Circle className="w-3 h-3" />
                    )}
                    <span className={`truncate ${item.completed ? 'line-through' : ''}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
                {list.items.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{list.items.length - 3} mais itens
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddToHome}
              className="h-8 w-8 p-0"
              title="Adicionar à tela inicial"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              title="Excluir lista"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};
