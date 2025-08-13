import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Data types
interface ListItem {
  id: string;
  text: string;
  completed: boolean;
  categories?: string[];
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface TodoList {
  id: string;
  title: string;
  description?: string;
  items: ListItem[];
  categories?: Category[];
  createdAt: Date;
  updatedAt: Date;
  archived?: boolean;
}

// Context type
interface ListsContextType {
  lists: TodoList[];
  loading: boolean;
  addList: (title: string, description?: string) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  updateList: (listId: string, updates: Partial<TodoList>) => Promise<void>;
  addItemToList: (listId: string, text: string, categories?: string[], dueDate?: Date, priority?: 'low' | 'medium' | 'high') => Promise<void>;
  toggleItemInList: (listId: string, itemId: string) => Promise<void>;
  deleteItemFromList: (listId: string, itemId: string) => Promise<void>;
  updateItemInList: (listId: string, itemId: string, updates: Partial<ListItem>) => Promise<void>;
  getListById: (listId: string) => TodoList | undefined;
  addCategoryToList: (listId: string, category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategoryFromList: (listId: string, categoryId: string) => Promise<void>;
  refreshLists: () => Promise<void>;
}

const ListsContext = createContext<ListsContextType | undefined>(undefined);

export function SupabaseListsProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load lists from Supabase
  const loadLists = async () => {
    if (!user) {
      setLists([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch lists
      const { data: listsData, error: listsError } = await supabase
        .from('todo_lists')
        .select(`
          id,
          title,
          description,
          created_at,
          updated_at,
          categories (
            id,
            name,
            color
          ),
          list_items (
            id,
            text,
            completed,
            due_date,
            priority,
            created_at,
            item_categories (
              category_id
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (listsError) throw listsError;

      // Transform data to match our interface
      const transformedLists: TodoList[] = (listsData || []).map(list => ({
        id: list.id,
        title: list.title,
        description: list.description || undefined,
        createdAt: new Date(list.created_at),
        updatedAt: new Date(list.updated_at),
        categories: Array.isArray(list.categories) ? list.categories : [],
        items: (list.list_items || []).map(item => ({
          id: item.id,
          text: item.text,
          completed: item.completed,
          dueDate: item.due_date ? new Date(item.due_date) : undefined,
          priority: item.priority as 'low' | 'medium' | 'high',
          createdAt: new Date(item.created_at),
          categories: item.item_categories?.map(ic => ic.category_id) || []
        }))
      }));

      setLists(transformedLists);
    } catch (error) {
      console.error('Error loading lists:', error);
      toast.error('Erro ao carregar listas');
    } finally {
      setLoading(false);
    }
  };

  // Load lists when user changes
  useEffect(() => {
    loadLists();
  }, [user]);

  const addList = async (title: string, description?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('todo_lists')
        .insert({
          title,
          description,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newList: TodoList = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        items: [],
        categories: [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setLists(prev => [newList, ...prev]);
      // Toast is handled in AddListForm
    } catch (error) {
      console.error('Error adding list:', error);
      toast.error('Erro ao criar lista');
    }
  };

  const deleteList = async (listId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('todo_lists')
        .delete()
        .eq('id', listId)
        .eq('user_id', user.id);

      if (error) throw error;

      setLists(prev => prev.filter(list => list.id !== listId));
      // Toast will be handled by calling component
    } catch (error) {
      console.error('Error deleting list:', error);
      toast.error('Erro ao deletar lista');
    }
  };

  const updateList = async (listId: string, updates: Partial<TodoList>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('todo_lists')
        .update({
          title: updates.title,
          description: updates.description
        })
        .eq('id', listId)
        .eq('user_id', user.id);

      if (error) throw error;

      setLists(prev => 
        prev.map(list => 
          list.id === listId 
            ? { ...list, ...updates, updatedAt: new Date() }
            : list
        )
      );
      // Toast will be handled by calling component
    } catch (error) {
      console.error('Error updating list:', error);
      toast.error('Erro ao atualizar lista');
    }
  };

  const addItemToList = async (
    listId: string, 
    text: string, 
    categories: string[] = [], 
    dueDate?: Date, 
    priority: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('list_items')
        .insert({
          text,
          due_date: dueDate?.toISOString(),
          priority,
          list_id: listId
        })
        .select()
        .single();

      if (error) throw error;

      const newItem: ListItem = {
        id: data.id,
        text: data.text,
        completed: data.completed,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        priority: data.priority as 'low' | 'medium' | 'high',
        createdAt: new Date(data.created_at),
        categories
      };

      setLists(prev =>
        prev.map(list =>
          list.id === listId
            ? { ...list, items: [...list.items, newItem] }
            : list
        )
      );
      // Toast will be handled by calling component
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Erro ao adicionar item');
    }
  };

  const toggleItemInList = async (listId: string, itemId: string) => {
    if (!user) return;

    try {
      const list = lists.find(l => l.id === listId);
      const item = list?.items.find(i => i.id === itemId);
      
      if (!item) return;

      const { error } = await supabase
        .from('list_items')
        .update({ completed: !item.completed })
        .eq('id', itemId);

      if (error) throw error;

      setLists(prev =>
        prev.map(list =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map(item =>
                  item.id === itemId
                    ? { ...item, completed: !item.completed }
                    : item
                )
              }
            : list
        )
      );
    } catch (error) {
      console.error('Error toggling item:', error);
      toast.error('Erro ao atualizar item');
    }
  };

  const deleteItemFromList = async (listId: string, itemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('list_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setLists(prev =>
        prev.map(list =>
          list.id === listId
            ? { ...list, items: list.items.filter(item => item.id !== itemId) }
            : list
        )
      );
      // Toast will be handled by calling component
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Erro ao remover item');
    }
  };

  const updateItemInList = async (listId: string, itemId: string, updates: Partial<ListItem>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('list_items')
        .update({
          text: updates.text,
          due_date: updates.dueDate?.toISOString(),
          priority: updates.priority
        })
        .eq('id', itemId);

      if (error) throw error;

      setLists(prev =>
        prev.map(list =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map(item =>
                  item.id === itemId ? { ...item, ...updates } : item
                )
              }
            : list
        )
      );
      // Toast will be handled by calling component
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Erro ao atualizar item');
    }
  };

  const addCategoryToList = async (listId: string, category: Omit<Category, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          color: category.color,
          list_id: listId
        })
        .select()
        .single();

      if (error) throw error;

      const newCategory: Category = {
        id: data.id,
        name: data.name,
        color: data.color
      };

      setLists(prev =>
        prev.map(list =>
          list.id === listId
            ? { ...list, categories: [...(list.categories || []), newCategory] }
            : list
        )
      );
      // Toast will be handled by calling component
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Erro ao adicionar categoria');
    }
  };

  const deleteCategoryFromList = async (listId: string, categoryId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      setLists(prev =>
        prev.map(list =>
          list.id === listId
            ? { 
                ...list, 
                categories: (list.categories || []).filter(cat => cat.id !== categoryId)
              }
            : list
        )
      );
      // Toast will be handled by calling component
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Erro ao remover categoria');
    }
  };

  const getListById = (listId: string) => {
    return lists.find(list => list.id === listId);
  };

  const refreshLists = async () => {
    await loadLists();
  };

  return (
    <ListsContext.Provider value={{
      lists,
      loading,
      addList,
      deleteList,
      updateList,
      addItemToList,
      toggleItemInList,
      deleteItemFromList,
      updateItemInList,
      getListById,
      addCategoryToList,
      deleteCategoryFromList,
      refreshLists
    }}>
      {children}
    </ListsContext.Provider>
  );
}

export function useLists() {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error('useLists must be used within a SupabaseListsProvider');
  }
  return context;
}