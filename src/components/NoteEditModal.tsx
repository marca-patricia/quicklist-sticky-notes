import React, { useState, useEffect } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CategoryManager, Category } from '@/components/CategoryManager';
import { Plus, X, Check, Trash2, CheckCircle, Circle } from 'lucide-react';
import { StickyNoteData, NoteType } from '@/components/StickyNote';
import { cn } from "@/lib/utils";

interface ListItem {
  id: string;
  text: string;
  completed: boolean;
}

interface NoteEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: StickyNoteData;
  onSave: (noteData: Partial<StickyNoteData>) => void;
  onDelete: (id: string) => void;
  categories?: Category[];
  onCategoryCreate?: (category: Omit<Category, 'id'>) => void;
  onCategoryDelete?: (categoryId: string) => void;
}

const noteColors = [
  '#FFF59D', // Yellow
  '#90CAF9', // Blue  
  '#A5D6A7', // Green
  '#F8BBD9', // Pink
  '#FFCC80', // Orange
  '#CE93D8'  // Purple
];

export const NoteEditModal: React.FC<NoteEditModalProps> = ({
  isOpen,
  onClose,
  note,
  onSave,
  onDelete,
  categories = [],
  onCategoryCreate,
  onCategoryDelete
}) => {
  console.log('NoteEditModal rendering, isOpen:', isOpen, 'note:', note);

  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(note.category);
  const [selectedColor, setSelectedColor] = useState(note.color);

  useEffect(() => {
    if (note.items && note.type === 'list') {
      setListItems(note.items.map((item, index) => ({
        id: `item-${index}`,
        text: item,
        completed: false
      })));
    }
  }, [note.items, note.type]);

  const handleSave = () => {
    const noteData: Partial<StickyNoteData> = {
      title: title.trim() || undefined,
      content: content.trim() || undefined,
      category: selectedCategory,
      color: selectedColor
    };

    // Para listas, salvar apenas os itens não concluídos
    if (note.type === 'list') {
      noteData.items = listItems
        .filter(item => !item.completed && item.text.trim())
        .map(item => item.text);
    }

    onSave(noteData);
    onClose();
  };

  const handleAddListItem = () => {
    setListItems([...listItems, {
      id: `item-${Date.now()}`,
      text: '',
      completed: false
    }]);
  };

  const handleRemoveListItem = (id: string) => {
    setListItems(listItems.filter(item => item.id !== id));
  };

  const updateListItem = (id: string, text: string) => {
    setListItems(listItems.map(item => 
      item.id === id ? { ...item, text } : item
    ));
  };

  const toggleListItemCompletion = (id: string) => {
    setListItems(listItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const completedItems = listItems.filter(item => item.completed);
  const pendingItems = listItems.filter(item => !item.completed);

  if (!isOpen) return null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content 
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            "max-h-[90vh] overflow-hidden flex flex-col dark:bg-gray-900 border-gray-200 dark:border-gray-700 relative"
          )}
          style={{
            backgroundColor: selectedColor ? `${selectedColor}40` : undefined,
          }}
        >
          {/* Botão X customizado e bem posicionado */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 shadow-md transition-all border border-gray-200"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col space-y-1.5 text-left pb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {note.type === 'list' ? 'Editar Lista' : 'Editar Nota'}
            </h2>
          </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Color Picker */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cor:</label>
            <div className="flex gap-3 pl-1">
              {noteColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    selectedColor === color ? 'border-gray-800 scale-110 ring-2 ring-gray-400' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {note.type === 'list' ? 'Título da Lista:' : 'Título:'}
            </label>
            <Input
              placeholder={note.type === 'list' ? 'Digite o título da lista...' : 'Digite o título...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-12"
            />
          </div>

          {/* Content - SEMPRE mostrar área de conteúdo para notas */}
          {(note.type === 'content' || note.type === 'title') && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Conteúdo:</label>
              <Textarea
                placeholder="Escreva sua nota..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-32 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none"
                rows={6}
              />
            </div>
          )}

          {/* List items */}
          {note.type === 'list' && (
            <div className="space-y-6">
              {/* Pending Items */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Circle className="w-4 h-4" />
                  Itens Pendentes:
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="flex gap-2 items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleListItemCompletion(item.id)}
                        className="p-1 h-auto hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Circle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </Button>
                      <Input
                        placeholder="Digite o item..."
                        value={item.text}
                        onChange={(e) => updateListItem(item.id, e.target.value)}
                        className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveListItem(item.id)}
                        className="p-1 h-auto hover:bg-red-100 text-red-600 dark:hover:bg-red-900 dark:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddListItem}
                  className="w-full text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              {/* Completed Items */}
              {completedItems.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Itens Concluídos:
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {completedItems.map((item) => (
                      <div key={item.id} className="flex gap-2 items-center opacity-70">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleListItemCompletion(item.id)}
                          className="p-1 h-auto hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-2">
                          <span className="line-through text-gray-600 dark:text-gray-400">
                            {item.text}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveListItem(item.id)}
                          className="p-1 h-auto hover:bg-red-100 text-red-600 dark:hover:bg-red-900 dark:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Category */}
          {categories && categories.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoria:</label>
              <CategoryManager
                categories={categories}
                selectedCategories={selectedCategory ? [selectedCategory.id] : []}
                onCategorySelect={(id) => {
                  const category = categories.find(c => c.id === id);
                  setSelectedCategory(category);
                }}
                onCategoryCreate={onCategoryCreate || (() => {})}
                onCategoryDelete={onCategoryDelete || (() => {})}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 mt-4 border-t border-gray-200 dark:border-gray-700 pb-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(note.id);
              onClose();
            }}
            className="px-6"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
  );
};