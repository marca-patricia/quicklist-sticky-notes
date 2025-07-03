
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ListItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoList {
  id: string;
  title: string;
  color: string;
  items: ListItem[];
  createdAt: Date;
}

interface ListsContextType {
  lists: TodoList[];
  addList: (title: string) => void;
  deleteList: (listId: string) => void;
  updateList: (listId: string, updates: Partial<TodoList>) => void;
  addItemToList: (listId: string, text: string) => void;
  toggleItemInList: (listId: string, itemId: string) => void;
  deleteItemFromList: (listId: string, itemId: string) => void;
  getListById: (listId: string) => TodoList | undefined;
}

const ListsContext = createContext<ListsContextType | undefined>(undefined);

const notepadColors = [
  'border-l-notepad-yellow',
  'border-l-notepad-pink', 
  'border-l-notepad-blue',
  'border-l-notepad-green',
  'border-l-notepad-purple'
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
            createdAt: new Date(item.createdAt)
          }))
        })));
      } catch (error) {
        console.error('Error loading saved lists:', error);
      }
    } else if (oldItems) {
      // Migrate old single list data
      try {
        const parsed = JSON.parse(oldItems);
        if (parsed.length > 0) {
          const migratedList: TodoList = {
            id: Date.now().toString(),
            title: 'Minha Lista',
            color: notepadColors[0],
            items: parsed.map((item: any) => ({
              ...item,
              createdAt: new Date(item.createdAt)
            })),
            createdAt: new Date()
          };
          setLists([migratedList]);
        }
      } catch (error) {
        console.error('Error migrating old data:', error);
      }
    }
  }, []);

  // Save lists to localStorage
  useEffect(() => {
    localStorage.setItem('quicklist-lists', JSON.stringify(lists));
  }, [lists]);

  const addList = (title: string) => {
    const newList: TodoList = {
      id: Date.now().toString(),
      title,
      color: notepadColors[Math.floor(Math.random() * notepadColors.length)],
      items: [],
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

  const addItemToList = (listId: string, text: string) => {
    const newItem: ListItem = {
      id: Date.now().toString(),
      text,
      completed: false,
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
      getListById
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
