
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLists } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Circle, ExternalLink, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { QuickListIcon } from '@/components/QuickListIcon';

interface ListWidgetProps {
  listId: string;
}

export const ListWidget: React.FC<ListWidgetProps> = ({ listId }) => {
  const { getListById } = useLists();
  const { t } = useLanguage();
  const [showCompleted, setShowCompleted] = useState(false);
  const list = getListById(listId);

  if (!list) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-6 text-center bg-gradient-notepad shadow-notepad">
          <QuickListIcon className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">{t('listNotFound')}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t('language') === 'pt' ? 'Esta lista pode ter sido removida ou o link está incorreto.' : 'This list may have been removed or the link is incorrect.'}
          </p>
          <Button onClick={() => window.location.href = '/'} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            {t('language') === 'pt' ? 'Criar Nova Lista' : 'Create New List'}
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
              <QuickListIcon className="w-5 h-5 flex-shrink-0" />
              <h1 className="font-bold text-base sm:text-lg truncate">{list.title}</h1>
              <span className="text-sm font-medium text-muted-foreground bg-secondary px-2 py-1 rounded flex-shrink-0">
                {completedItems.length}/{list.items.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={openFullApp}
              className="h-7 w-7 p-0 flex-shrink-0"
              title={t('openFullApp')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>

          {/* Pending Items */}
          {pendingItems.length > 0 && (
            <div className="mb-3">
              <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t('pending')} ({pendingItems.length})
              </h3>
              <div className="space-y-1">
                {pendingItems.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-start gap-2 text-sm">
                    <Circle className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{item.text}</span>
                  </div>
                ))}
                {pendingItems.length > 5 && (
                  <div className="text-xs text-muted-foreground italic">
                    +{pendingItems.length - 5} {t('language') === 'pt' ? 'mais itens...' : 'more items...'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Completed Items - Collapsible */}
          {completedItems.length > 0 && (
            <Collapsible open={showCompleted} onOpenChange={setShowCompleted}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-between p-1 h-auto text-xs font-medium text-muted-foreground hover:bg-transparent mb-1"
                >
                  <span>{t('completed')} ({completedItems.length})</span>
                  {showCompleted ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-0.5 mb-3">
                  {completedItems.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-2.5 h-2.5 text-primary flex-shrink-0" />
                      <span className="truncate line-through">{item.text}</span>
                    </div>
                  ))}
                  {completedItems.length > 3 && (
                    <div className="text-xs text-muted-foreground italic">
                      +{completedItems.length - 3} {t('language') === 'pt' ? 'concluídos' : 'completed'}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Empty State */}
          {list.items.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm mb-3">{t('emptyList')}</p>
              <Button 
                variant="outline"
                size="sm"
                onClick={openFullApp}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                {t('addItems')}
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-3 pt-2 border-t border-border/30">
            <Button 
              variant="ghost"
              size="sm"
              onClick={openFullApp}
              className="w-full text-xs h-7 text-muted-foreground hover:text-foreground"
            >
              {t('openFullApp')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
