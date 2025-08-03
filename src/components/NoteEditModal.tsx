import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CategoryManager, Category } from '@/components/CategoryManager';
import { Plus, X, Check, Trash2, CheckCircle, Circle } from 'lucide-react';
import { StickyNoteData, NoteType } from '@/components/StickyNote';

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
  'hsl(var(--note-yellow))',
  'hsl(var(--note-blue))',
  'hsl(var(--note-green))',
  'hsl(var(--note-pink))',
  'hsl(var(--note-orange))',
  'hsl(var(--note-purple))'
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col dark:bg-black dark:border-white/20"
        style={{
          backgroundColor: `light-dark(${selectedColor}, hsl(var(--background)))`,
        }}
      >
        {/* Overlay do post-it no modo escuro */}
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none"
          style={{ backgroundColor: selectedColor }}
        />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-lg font-semibold text-foreground dark:text-white">
            {note.type === 'list' ? 'Editar Lista' : 'Editar Nota'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 relative z-10">
          {/* Color Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white">Cor:</label>
            <div className="flex gap-2">
              {noteColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    selectedColor === color ? 'border-foreground scale-110 ring-2 ring-foreground/30' : 'border-border dark:border-white/20'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white">
              {note.type === 'list' ? 'Título da Lista:' : 'Título:'}
            </label>
            <Input
              placeholder={note.type === 'list' ? 'Digite o título da lista...' : 'Digite o título...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/90 dark:bg-white/10 border-border dark:border-white/20 text-foreground dark:text-white"
            />
          </div>

          {/* Content for notes */}
          {note.type === 'content' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground dark:text-white">Conteúdo:</label>
              <Textarea
                placeholder="Escreva sua nota..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-32 bg-white/90 dark:bg-white/10 border-border dark:border-white/20 text-foreground dark:text-white resize-none"
                rows={8}
              />
            </div>
          )}

          {/* List items */}
          {note.type === 'list' && (
            <div className="space-y-4">
              {/* Pending Items */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-2">
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
                        className="p-1 h-auto hover:bg-white/20 dark:hover:bg-white/10"
                      >
                        <Circle className="w-4 h-4 text-foreground dark:text-white" />
                      </Button>
                      <Input
                        placeholder="Digite o item..."
                        value={item.text}
                        onChange={(e) => updateListItem(item.id, e.target.value)}
                        className="flex-1 bg-white/90 dark:bg-white/10 border-border dark:border-white/20 text-foreground dark:text-white"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveListItem(item.id)}
                        className="p-1 h-auto hover:bg-destructive/20 text-destructive"
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
                  className="w-full text-foreground dark:text-white border-border dark:border-white/20 hover:bg-white/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              {/* Completed Items */}
              {completedItems.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground dark:text-white flex items-center gap-2">
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
                          className="p-1 h-auto hover:bg-white/20 dark:hover:bg-white/10"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                        <div className="flex-1 bg-white/50 dark:bg-white/5 border border-border dark:border-white/10 rounded-md px-3 py-2">
                          <span className="line-through text-foreground/70 dark:text-white/70">
                            {item.text}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveListItem(item.id)}
                          className="p-1 h-auto hover:bg-destructive/20 text-destructive"
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
          {categories.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground dark:text-white">Categoria:</label>
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
        <div className="flex gap-3 pt-4 border-t border-border dark:border-white/20 relative z-10">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 text-foreground dark:text-white border-border dark:border-white/20 hover:bg-white/10"
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
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Check className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};