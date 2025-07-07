
import React, { useState, useEffect } from 'react';
import { AddItemForm } from '@/components/AddItemForm';
import { QuickListItem } from '@/components/QuickListItem';
import { QuickListStats } from '@/components/QuickListStats';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface Item {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  categories?: string[];
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
}

export const QuickList: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetical' | 'completed'>('recent');

  // Load items from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('quicklist-items');
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems);
        setItems(parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          dueDate: item.dueDate ? new Date(item.dueDate) : undefined
        })));
      } catch (error) {
        console.error('Error loading saved items:', error);
      }
    }
  }, []);

  // Save items to localStorage
  useEffect(() => {
    localStorage.setItem('quicklist-items', JSON.stringify(items));
  }, [items]);

  const addItem = (text: string, categories?: string[], dueDate?: Date, priority?: 'low' | 'medium' | 'high') => {
    const newItem: Item = {
      id: Date.now().toString(),
      text,
      completed: false,
      categories,
      dueDate,
      priority,
      createdAt: new Date()
    };
    setItems(prev => [newItem, ...prev]);
    toast({
      description: t('itemAdded'),
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
      description: t('itemRemoved'),
      duration: 2000,
    });
  };

  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompletedFilter = showCompleted || !item.completed;
    return matchesSearch && matchesCompletedFilter;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.text.localeCompare(b.text);
      case 'completed':
        return Number(a.completed) - Number(b.completed);
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const shareList = async () => {
    const listText = items.map(item => 
      `${item.completed ? t('completedItem') : t('pendingItem')} ${item.text}`
    ).join('\n');
    
    const shareText = `QuickList:\n\n${listText}`;
    
    if (navigator.share && navigator.canShare({ text: shareText })) {
      try {
        await navigator.share({ text: shareText });
      } catch (error) {
        await navigator.clipboard.writeText(shareText);
        toast({
          description: t('listCopied'),
          duration: 3000,
        });
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        description: t('listCopied'),
        duration: 3000,
      });
    }
  };

  const clearCompleted = () => {
    const completedItems = items.filter(item => item.completed);
    setItems(prev => prev.filter(item => !item.completed));
    
    toast({
      description: `${completedItems.length} ${t('completedItemsRemoved')}`,
      duration: 2000,
    });
  };

  const completedItems = items.filter(item => item.completed);

  return (
    <div className="min-h-screen bg-background">
      <LanguageSwitch />
      
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-primary bg-clip-text text-transparent">
          QuickList
        </h1>

        <div className="mb-6">
          <AddItemForm onAdd={addItem} />
        </div>

        <div className="mb-6">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            showCompleted={showCompleted}
            onShowCompletedChange={setShowCompleted}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        <div className="mb-6">
          <QuickListStats
            totalItems={items.length}
            completedItems={completedItems.length}
            onShare={shareList}
            onClearCompleted={clearCompleted}
          />
        </div>

        <div className="space-y-3">
          {sortedItems.map(item => (
            <QuickListItem
              key={item.id}
              id={item.id}
              text={item.text}
              completed={item.completed}
              categories={item.categories}
              listId="default"
              color="border-l-notepad-yellow"
              onToggle={toggleItem}
              onDelete={deleteItem}
            />
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t('noItems')}</p>
            <p>{t('addItemHere')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
