
import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { Category } from '@/components/CategoryManager';

export interface ListItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  categories?: string[];
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface TodoList {
  id: string;
  title: string;
  color: string;
  items: ListItem[];
  createdAt: Date;
  categories?: Category[];
  description?: string;
  archived?: boolean;
}

interface ListsContextType {
  lists: TodoList[];
  addList: (title: string, description?: string) => void;
  deleteList: (listId: string) => void;
  updateList: (listId: string, updates: Partial<TodoList>) => void;
  addItemToList: (listId: string, text: string, categories?: string[], dueDate?: Date, priority?: 'low' | 'medium' | 'high') => void;
  toggleItemInList: (listId: string, itemId: string) => void;
  deleteItemFromList: (listId: string, itemId: string) => void;
  updateItemInList: (listId: string, itemId: string, updates: Partial<ListItem>) => void;
  getListById: (listId: string) => TodoList | undefined;
  addCategoryToList: (listId: string, category: Omit<Category, 'id'>) => void;
  deleteCategoryFromList: (listId: string, categoryId: string) => void;
}

const ListsContext = createContext<ListsContextType | undefined>(undefined);

export const pastelColors = [
  { name: 'Rosa', value: 'hsl(340, 100%, 95%)', class: 'bg-[hsl(340,100%,95%)]' },
  { name: 'Azul', value: 'hsl(200, 100%, 95%)', class: 'bg-[hsl(200,100%,95%)]' },
  { name: 'Verde', value: 'hsl(120, 60%, 95%)', class: 'bg-[hsl(120,60%,95%)]' },
  { name: 'Amarelo', value: 'hsl(50, 100%, 95%)', class: 'bg-[hsl(50,100%,95%)]' },
  { name: 'Roxo', value: 'hsl(280, 60%, 95%)', class: 'bg-[hsl(280,60%,95%)]' },
  { name: 'Laranja', value: 'hsl(30, 100%, 95%)', class: 'bg-[hsl(30,100%,95%)]' },
  { name: 'Menta', value: 'hsl(160, 60%, 95%)', class: 'bg-[hsl(160,60%,95%)]' },
  { name: 'Pêssego', value: 'hsl(15, 100%, 95%)', class: 'bg-[hsl(15,100%,95%)]' }
];

export const ListsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<TodoList[]>([]);

  // Migrate old data and load lists
  useEffect(() => {
    const savedLists = localStorage.getItem('quicklist-lists');
    const oldItems = localStorage.getItem('quicklist-items');
    
    if (savedLists) {
      try {
        const parsed = JSON.parse(savedLists);
        setLists(parsed.map((list: any) => ({
          ...list,
          createdAt: new Date(list.createdAt),
          items: list.items.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            dueDate: item.dueDate ? new Date(item.dueDate) : undefined
          }))
        })));
      } catch (error) {
        // Error loading saved lists - silent in production
      }
    } else if (oldItems) {
      // Migrate old single list data
      try {
        const parsed = JSON.parse(oldItems);
        if (parsed.length > 0) {
          const migratedList: TodoList = {
            id: Date.now().toString(),
            title: 'Minha Lista',
            color: pastelColors[0].value,
            items: parsed.map((item: any) => ({
              ...item,
              createdAt: new Date(item.createdAt)
            })),
            createdAt: new Date()
          };
          setLists([migratedList]);
        }
      } catch (error) {
        // Error migrating old data - silent in production
      }
    }
  }, []);

  // Save lists to localStorage
  useEffect(() => {
    localStorage.setItem('quicklist-lists', JSON.stringify(lists));
  }, [lists]);

  const addList = (title: string, description?: string) => {
    const newList: TodoList = {
      id: Date.now().toString(),
      title,
      description,
      color: pastelColors[Math.floor(Math.random() * pastelColors.length)].value,
      items: [],
      categories: [],
      createdAt: new Date()
    };
    setLists(prev => [newList, ...prev]);
  };

  const deleteList = (listId: string) => {
    setLists(prev => prev.filter(list => list.id !== listId));
  };

  const updateList = (listId: string, updates: Partial<TodoList>) => {
    setLists(prev => prev.map(list => 
      list.id === listId ? { ...list, ...updates } : list
    ));
  };

  const addItemToList = (listId: string, text: string, categories: string[] = [], dueDate?: Date, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newItem: ListItem = {
      id: Date.now().toString(),
      text,
      completed: false,
      categories,
      dueDate,
      priority,
      createdAt: new Date()
    };
    
    setLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, items: [newItem, ...list.items] }
        : list
    ));
  };

  const toggleItemInList = (listId: string, itemId: string) => {
    setLists(prev => prev.map(list => 
      list.id === listId 
        ? {
            ...list,
            items: list.items.map(item => 
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          }
        : list
    ));
  };

  const deleteItemFromList = (listId: string, itemId: string) => {
    setLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, items: list.items.filter(item => item.id !== itemId) }
        : list
    ));
  };

  const updateItemInList = (listId: string, itemId: string, updates: Partial<ListItem>) => {
    setLists(prev => prev.map(list => 
      list.id === listId 
        ? {
            ...list,
            items: list.items.map(item => 
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        : list
    ));
  };

  const addCategoryToList = (listId: string, category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      ...category
    };
    
    setLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, categories: [...(list.categories || []), newCategory] }
        : list
    ));
  };

  const deleteCategoryFromList = (listId: string, categoryId: string) => {
    setLists(prev => prev.map(list => 
      list.id === listId 
        ? { 
            ...list, 
            categories: (list.categories || []).filter(cat => cat.id !== categoryId),
            items: list.items.map(item => ({
              ...item,
              categories: (item.categories || []).filter(catId => catId !== categoryId)
            }))
          }
        : list
    ));
  };

  const getListById = (listId: string) => {
    return lists.find(list => list.id === listId);
  };

  return (
    <ListsContext.Provider value={{
      lists,
      addList,
      deleteList,
      updateList,
      addItemToList,
      toggleItemInList,
      deleteItemFromList,
      updateItemInList,
      getListById,
      addCategoryToList,
      deleteCategoryFromList
    }}>
      {children}
    </ListsContext.Provider>
  );
};

export const useLists = () => {
  const context = useContext(ListsContext);
  if (context === undefined) {
    throw new Error('useLists must be used within a ListsProvider');
  }
  return context;
};
