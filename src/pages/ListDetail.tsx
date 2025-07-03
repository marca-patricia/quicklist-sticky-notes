
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AddItemForm } from '@/components/AddItemForm';
import { QuickListItem } from '@/components/QuickListItem';
import { QuickListStats } from '@/components/QuickListStats';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import quicklistIcon from '@/assets/quicklist-icon.png';

export const ListDetail: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const { t } = useLanguage();
  const { getListById, addItemToList, toggleItemInList, deleteItemFromList } = useLists();
  const { toast } = useToast();

  const list = listId ? getListById(listId) : undefined;

  if (!list) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lista não encontrada</h2>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar às listas
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const addItem = (text: string) => {
    addItemToList(list.id, text);
    toast({
      description: "Item adicionado à lista!",
      duration: 2000,
    });
  };

  const toggleItem = (itemId: string) => {
    toggleItemInList(list.id, itemId);
  };

  const deleteItem = (itemId: string) => {
    deleteItemFromList(list.id, itemId);
    toast({
      description: "Item removido da lista!",
      duration: 2000,
    });
  };

  const shareList = async () => {
    const listText = list.items.map(item => 
      `${item.completed ? t('completedItem') : t('pendingItem')} ${item.text}`
    ).join('\n');
    
    const shareText = `${list.title}:\n\n${listText}`;
    
    if (navigator.share && navigator.canShare({ text: shareText })) {
      try {
        await navigator.share({ text: shareText });
      } catch (error) {
        await navigator.clipboard.writeText(shareText);
        toast({
          description: "Lista copiada para área de transferência!",
          duration: 3000,
        });
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        description: "Lista copiada para área de transferência!",
        duration: 3000,
      });
    }
  };

  const clearCompleted = () => {
    const completedItems = list.items.filter(item => item.completed);
    completedItems.forEach(item => deleteItemFromList(list.id, item.id));
    
    toast({
      description: `${completedItems.length} itens concluídos removidos!`,
      duration: 2000,
    });
  };

  const addToHomeScreen = () => {
    const widgetUrl = `${window.location.origin}/?list=${list.id}&widget=true`;
    
    if (navigator.share) {
      navigator.share({
        title: `QuickList - ${list.title}`,
        url: widgetUrl
      });
    } else {
      navigator.clipboard.writeText(widgetUrl);
      toast({
        description: "Link copiado! Cole na barra de endereços e adicione à tela inicial",
        duration: 4000,
      });
    }
  };

  const completedItems = list.items.filter(item => item.completed).length;

  return (
    <div className="min-h-screen bg-background">
      <LanguageSwitch />
      
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Todas as listas
            </Button>
          </Link>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={quicklistIcon} 
                alt="QuickList" 
                className="w-8 h-8" 
              />
              <h1 className={`text-2xl font-bold border-l-4 ${list.color} pl-3`}>
                {list.title}
              </h1>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={addToHomeScreen}
              className="text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Tela inicial</span>
            </Button>
          </div>
        </div>

        {/* Add Item Form */}
        <div className="mb-6">
          <AddItemForm onAdd={addItem} />
        </div>

        {/* Stats */}
        <div className="mb-6">
          <QuickListStats
            totalItems={list.items.length}
            completedItems={completedItems}
            onShare={shareList}
            onClearCompleted={clearCompleted}
          />
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {list.items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Esta lista ainda não tem itens.</p>
              <p>Adicione alguns itens acima para começar!</p>
            </div>
          ) : (
            list.items.map(item => (
              <QuickListItem
                key={item.id}
                id={item.id}
                text={item.text}
                completed={item.completed}
                color={list.color}
                onToggle={toggleItem}
                onDelete={deleteItem}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
