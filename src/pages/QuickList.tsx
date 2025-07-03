import React, { useState, useEffect } from 'react';
import { AddItemForm } from '@/components/AddItemForm';
import { QuickListItem } from '@/components/QuickListItem';
import { QuickListStats } from '@/components/QuickListStats';
import { EmptyState } from '@/components/EmptyState';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import quicklistIcon from '@/assets/quicklist-icon.png';

interface ListItem {
  id: string;
  text: string;
  completed: boolean;
  color: string;
  createdAt: Date;
}

const notepadColors = [
  'border-l-notepad-yellow',
  'border-l-notepad-pink', 
  'border-l-notepad-blue',
  'border-l-notepad-green',
  'border-l-notepad-purple'
];

export const QuickList: React.FC = () => {
  const [items, setItems] = useState<ListItem[]>([]);
  const { t } = useLanguage();
  const { toast } = useToast();

  // Load items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('quicklist-items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        })));
      } catch (error) {
        console.error('Error loading saved items:', error);
      }
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('quicklist-items', JSON.stringify(items));
  }, [items]);

  const addItem = (text: string) => {
    const newItem: ListItem = {
      id: Date.now().toString(),
      text,
      completed: false,
      color: notepadColors[Math.floor(Math.random() * notepadColors.length)],
      createdAt: new Date()
    };
    setItems(prev => [newItem, ...prev]);
    
    toast({
      description: "Item adicionado à lista!",
      duration: 2000,
    });
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      description: "Item removido da lista!",
      duration: 2000,
    });
  };

  const shareList = async () => {
    const listText = items.map(item => 
      `${item.completed ? t('completedItem') : t('pendingItem')} ${item.text}`
    ).join('\n');
    
    const shareText = t('sharedText') + listText;
    
    if (navigator.share && navigator.canShare({ text: shareText })) {
      try {
        await navigator.share({ text: shareText });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        toast({
          description: "Lista copiada para área de transferência!",
          duration: 3000,
        });
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText);
      toast({
        description: "Lista copiada para área de transferência!",
        duration: 3000,
      });
    }
  };

  const clearCompleted = () => {
    const completedCount = items.filter(item => item.completed).length;
    setItems(prev => prev.filter(item => !item.completed));
    
    toast({
      description: `${completedCount} itens concluídos removidos!`,
      duration: 2000,
    });
  };

  const completedItems = items.filter(item => item.completed).length;

  return (
    <div className="min-h-screen bg-background">
      <LanguageSwitch />
      
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src={quicklistIcon} 
              alt="QuickList" 
              className="w-12 h-12" 
            />
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {t('appTitle')}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Sua lista de tarefas simples e eficiente
          </p>
        </div>

        {/* Add Item Form */}
        <div className="mb-6">
          <AddItemForm onAdd={addItem} />
        </div>

        {/* Stats */}
        <div className="mb-6">
          <QuickListStats
            totalItems={items.length}
            completedItems={completedItems}
            onShare={shareList}
            onClearCompleted={clearCompleted}
          />
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {items.length === 0 ? (
            <EmptyState />
          ) : (
            items.map(item => (
              <QuickListItem
                key={item.id}
                id={item.id}
                text={item.text}
                completed={item.completed}
                color={item.color}
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