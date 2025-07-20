
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AddItemForm } from '@/components/AddItemForm';
import { QuickListItem } from '@/components/QuickListItem';
import { QuickListStats } from '@/components/QuickListStats';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ExternalLink, ChevronDown, ChevronRight, Calendar, Clock } from 'lucide-react';
import { QuickListIcon } from '@/components/QuickListIcon';

export const ListDetail: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const { t } = useLanguage();
  const { getListById, addItemToList, toggleItemInList, deleteItemFromList, addCategoryToList, deleteCategoryFromList } = useLists();
  const { toast } = useToast();
  const [showCompleted, setShowCompleted] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showCompletedFilter, setShowCompletedFilter] = React.useState(true);
  const [sortBy, setSortBy] = React.useState<'recent' | 'alphabetical' | 'completed'>('recent');

  const list = listId ? getListById(listId) : undefined;

  if (!list) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('listNotFound')}</h2>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToLists')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const addItem = (text: string, categories?: string[]) => {
    addItemToList(list.id, text, categories);
    toast({
      description: t('itemAdded'),
      duration: 2000,
    });
  };

  const toggleItem = (itemId: string) => {
    toggleItemInList(list.id, itemId);
  };

  const deleteItem = (itemId: string) => {
    deleteItemFromList(list.id, itemId);
    toast({
      description: t('itemRemoved'),
      duration: 2000,
    });
  };

  // Filter and sort items
  const filteredItems = list.items.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompletedFilter = showCompletedFilter || !item.completed;
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
    const completedItems = list.items.filter(item => item.completed);
    completedItems.forEach(item => deleteItemFromList(list.id, item.id));
    
    toast({
      description: `${completedItems.length} ${t('completedItemsRemoved')}`,
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
        description: t('linkCopied'),
        duration: 4000,
      });
    }
  };

  const handleCategoryCreate = (category: Omit<import('@/components/CategoryManager').Category, 'id'>) => {
    addCategoryToList(list.id, category);
  };

  const handleCategoryDelete = (categoryId: string) => {
    deleteCategoryFromList(list.id, categoryId);
  };

  const pendingItems = sortedItems.filter(item => !item.completed);
  const completedItems = sortedItems.filter(item => item.completed);

  return (
    <div className="min-h-screen" style={{ background: '#F8F8FC' }}>
      <LanguageSwitch />
      
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('allLists')}
            </Button>
          </Link>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <QuickListIcon className="w-8 h-8 flex-shrink-0" />
              <h1 className={`text-2xl font-bold border-l-4 ${list.color} pl-3 truncate`}>
                {list.title}
              </h1>
              <span className="text-lg font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
                {completedItems.length}/{list.items.length}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={addToHomeScreen}
              className="text-primary hover:bg-primary hover:text-primary-foreground flex-shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">{t('homeScreen')}</span>
            </Button>
          </div>
        </div>

        {/* Main List Container - Com cor da lista */}
        <div 
          className="rounded-xl p-6 shadow-soft border border-gray-200"
          style={{ backgroundColor: list.color }}
        >

        {/* Add Item Form */}
        <div className="mb-6">
          <AddItemForm 
            onAdd={addItem} 
            categories={list.categories} 
            onCategoryCreate={handleCategoryCreate}
            onCategoryDelete={handleCategoryDelete}
          />
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            showCompleted={showCompletedFilter}
            onShowCompletedChange={setShowCompletedFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Stats */}
        <div className="mb-6">
          <QuickListStats
            totalItems={list.items.length}
            completedItems={list.items.filter(item => item.completed).length}
            onShare={shareList}
            onClearCompleted={clearCompleted}
          />
        </div>

        {/* Pending Items */}
        {pendingItems.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t('pending')} ({pendingItems.length})
            </h3>
            <div className="space-y-3">
              {pendingItems.map(item => (
                <QuickListItem
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  completed={item.completed}
                  categories={item.categories}
                  listId={list.id}
                  color={list.color}
                  onToggle={toggleItem}
                  onDelete={deleteItem}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Items - Collapsible */}
        {completedItems.length > 0 && (
          <Collapsible open={showCompleted} onOpenChange={setShowCompleted}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-0 h-auto text-lg font-semibold mb-3 hover:bg-transparent"
              >
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t('completed')} ({completedItems.length})
                </span>
                {showCompleted ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3">
              {completedItems.map(item => (
                <QuickListItem
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  completed={item.completed}
                  categories={item.categories}
                  listId={list.id}
                  color={list.color}
                  onToggle={toggleItem}
                  onDelete={deleteItem}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Empty State */}
        {list.items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t('noItems')}</p>
            <p>{t('addItemHere')}</p>
          </div>
        )}
        </div>
        {/* Fim do Main List Container */}
      </div>
    </div>
  );
};
