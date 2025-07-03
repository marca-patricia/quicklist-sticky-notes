
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLists } from '@/contexts/ListsContext';
import { CheckCircle, Circle, ExternalLink, Plus } from 'lucide-react';
import quicklistIcon from '@/assets/quicklist-icon.png';

interface ListWidgetProps {
  listId: string;
}

export const ListWidget: React.FC<ListWidgetProps> = ({ listId }) => {
  const { getListById } = useLists();
  const list = getListById(listId);

  if (!list) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-6 text-center bg-gradient-notepad shadow-notepad">
          <img src={quicklistIcon} alt="QuickList" className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Lista não encontrada</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Esta lista pode ter sido removida ou o link está incorreto.
          </p>
          <Button onClick={() => window.location.href = '/'} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Criar Nova Lista
          </Button>
        </Card>
      </div>
    );
  }

  const pendingItems = list.items.filter(item => !item.completed);
  const completedItems = list.items.filter(item => item.completed);

  const openFullApp = () => {
    window.location.href = `/list/${listId}`;
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <Card className={`max-w-sm mx-auto bg-gradient-notepad shadow-notepad border-l-4 ${list.color} animate-in fade-in-50 duration-300`}>
        <div className="p-3 sm:p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <img src={quicklistIcon} alt="QuickList" className="w-5 h-5 flex-shrink-0" />
              <h1 className="font-bold text-base sm:text-lg truncate">{list.title}</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={openFullApp}
              className="h-7 w-7 p-0 flex-shrink-0"
              title="Abrir app completo"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>

          {/* Stats resumidas */}
          {list.items.length > 0 && (
            <div className="flex gap-2 mb-3 text-xs">
              {pendingItems.length > 0 && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  {pendingItems.length} pendentes
                </span>
              )}
              {completedItems.length > 0 && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {completedItems.length} ok
                </span>
              )}
            </div>
          )}

          {/* Pending Items - Mais destaque */}
          {pendingItems.length > 0 && (
            <div className="mb-3">
              <h3 className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                Para Fazer
              </h3>
              <div className="space-y-1">
                {pendingItems.slice(0, 6).map(item => (
                  <div key={item.id} className="flex items-start gap-2 text-sm">
                    <Circle className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{item.text}</span>
                  </div>
                ))}
                {pendingItems.length > 6 && (
                  <div className="text-xs text-muted-foreground italic">
                    +{pendingItems.length - 6} mais itens...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Completed Items - Compacto */}
          {completedItems.length > 0 && (
            <div className="mb-3">
              <h3 className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                Concluídos
              </h3>
              <div className="space-y-0.5">
                {completedItems.slice(0, 2).map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="w-2.5 h-2.5 text-primary flex-shrink-0" />
                    <span className="truncate line-through">{item.text}</span>
                  </div>
                ))}
                {completedItems.length > 2 && (
                  <div className="text-xs text-muted-foreground italic">
                    +{completedItems.length - 2} concluídos
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {list.items.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm mb-3">Lista vazia</p>
              <Button 
                variant="outline"
                size="sm"
                onClick={openFullApp}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Adicionar itens
              </Button>
            </div>
          )}

          {/* Footer compacto */}
          <div className="mt-3 pt-2 border-t border-border/30">
            <Button 
              variant="ghost"
              size="sm"
              onClick={openFullApp}
              className="w-full text-xs h-7 text-muted-foreground hover:text-foreground"
            >
              Abrir QuickList completo
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
