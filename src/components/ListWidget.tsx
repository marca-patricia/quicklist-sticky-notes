
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLists } from '@/contexts/ListsContext';
import { CheckCircle, Circle, ExternalLink } from 'lucide-react';
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
        <Card className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Lista não encontrada</h2>
          <Button onClick={() => window.location.href = '/'}>
            Ir para QuickList
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
    <div className="min-h-screen bg-background p-4">
      <Card className={`max-w-sm mx-auto shadow-notepad border-l-4 ${list.color}`}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src={quicklistIcon} alt="QuickList" className="w-6 h-6" />
              <h1 className="font-bold text-lg truncate">{list.title}</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={openFullApp}
              className="h-8 w-8 p-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          {/* Pending Items */}
          {pendingItems.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Pendentes ({pendingItems.length})
              </h3>
              <div className="space-y-2">
                {pendingItems.slice(0, 8).map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    <Circle className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{item.text}</span>
                  </div>
                ))}
                {pendingItems.length > 8 && (
                  <div className="text-xs text-muted-foreground">
                    +{pendingItems.length - 8} mais itens
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Completed Items */}
          {completedItems.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Concluídos ({completedItems.length})
              </h3>
              <div className="space-y-1">
                {completedItems.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                    <span className="truncate line-through">{item.text}</span>
                  </div>
                ))}
                {completedItems.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{completedItems.length - 3} concluídos
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {list.items.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">Lista vazia</p>
              <Button 
                variant="outline"
                size="sm"
                onClick={openFullApp}
                className="mt-2"
              >
                Adicionar itens
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <Button 
              variant="ghost"
              size="sm"
              onClick={openFullApp}
              className="w-full text-xs"
            >
              Abrir no QuickList
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
