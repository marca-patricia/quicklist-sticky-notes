
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists, TodoList } from '@/contexts/ListsContext';
import { Link } from 'react-router-dom';
import { Trash2, ExternalLink, CheckCircle, Circle, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ListCardProps {
  list: TodoList;
}

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
  const { t } = useLanguage();
  const { deleteList } = useLists();
  const { toast } = useToast();
  
  const totalItems = list.items.length;
  const completedItems = list.items.filter(item => item.completed).length;
  const pendingItems = totalItems - completedItems;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(t('deleteList') || 'Excluir esta lista?')) {
      deleteList(list.id);
      toast({
        description: t('language') === 'pt' ? "Lista excluída com sucesso!" : "List deleted successfully!",
        duration: 2000,
      });
    }
  };

  const handleAddToHome = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const widgetUrl = `${window.location.origin}/?list=${list.id}&widget=true`;
    
    try {
      if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        await navigator.share({
          title: `QuickList - ${list.title}`,
          text: `Minha lista: ${list.title}`,
          url: widgetUrl
        });
        toast({
          description: t('language') === 'pt' ? "Compartilhado! Adicione à tela inicial do seu dispositivo" : "Shared! Add to your device's home screen",
          duration: 4000,
        });
      } else {
        await navigator.clipboard.writeText(widgetUrl);
        toast({
          description: t('language') === 'pt' ? "Link copiado! Cole na barra de endereços e adicione à tela inicial" : "Link copied! Paste in address bar and add to home screen",
          duration: 5000,
        });
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(widgetUrl);
        toast({
          description: t('language') === 'pt' ? "Link copiado! Cole na barra de endereços e adicione à tela inicial" : "Link copied! Paste in address bar and add to home screen",
          duration: 5000,
        });
      } catch (clipboardError) {
        toast({
          description: `URL: ${widgetUrl}`,
          duration: 8000,
        });
      }
    }
  };

  return (
    <Link to={`/list/${list.id}`} className="block">
      <Card className={`p-4 hover:shadow-notepad transition-all duration-200 border-l-4 ${list.color} group bg-gradient-notepad`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate text-foreground group-hover:text-primary transition-colors flex-1">
                {list.title}
              </h3>
              {totalItems > 0 && (
                <Badge variant="secondary" className="text-sm font-medium">
                  {completedItems}/{totalItems}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-3">
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
              <div className="space-y-1">
                {list.items.filter(item => !item.completed).slice(0, 2).map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Circle className="w-3 h-3" />
                    <span className="truncate">{item.text}</span>
                  </div>
                ))}
                {pendingItems > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{pendingItems - 2} {t('language') === 'pt' ? 'mais pendentes' : 'more pending'}
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
              className="h-8 w-8 p-0 text-primary hover:bg-primary hover:text-primary-foreground"
              title={t('addToHome')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              title={t('deleteList')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};
