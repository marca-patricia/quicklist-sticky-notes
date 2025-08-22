import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CategoryManager, Category } from '@/components/CategoryManager';
import { Plus, X, Check, Trash2, CheckCircle, Circle } from 'lucide-react';
import { StickyNoteData, NoteType } from '@/components/StickyNote';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
  
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

  // Update state when note prop changes
  useEffect(() => {
    setTitle(note.title || '');
    setContent(note.content || '');
    setSelectedCategory(note.category);
    setSelectedColor(note.color);
  }, [note]);

  const handleCloseModal = () => {
    console.log('Closing modal - handleCloseModal called');
    onClose();
  };

  const handleSave = () => {
    const noteData: Partial<StickyNoteData> = {
      title: title.trim() || undefined,
      content: content.trim() || undefined,
      category: selectedCategory,
      color: selectedColor
    };

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
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col p-4 sm:p-6 [&>button]:hidden"
        style={{
          backgroundColor: selectedColor ? `${selectedColor}40` : undefined,
        }}
        >
        <DialogHeader className="pb-4 flex-shrink-0 relative">
          <DialogTitle className="text-lg font-semibold pr-8">
            {note.type === 'list' ? 'Editar Lista' : t('notes.editNote')}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              console.log('X button clicked');
              e.preventDefault();
              e.stopPropagation();
              handleCloseModal();
            }}
            className="absolute right-0 top-0 h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full z-50"
            aria-label="Fechar modal"
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6">
          {/* Color Picker */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground dark:text-white">{t('notes.colorLabel')}</label>
            <div className="flex gap-2 flex-wrap">
              {noteColors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    selectedColor === color ? 'border-foreground scale-110 ring-2 ring-foreground/30' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Selecionar cor ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground dark:text-white">
              {note.type === 'list' ? 'Título da Lista:' : t('notes.titleLabel')}
            </label>
            <Input
              placeholder={note.type === 'list' ? 'Digite o título da lista...' : t('notes.titlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 border border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 [&::-webkit-search-cancel-button]:hidden [&::-webkit-clear-button]:hidden [&::-ms-clear]:hidden"
              autoFocus
              type="text"
            />
          </div>

          {/* Content/Description - SEMPRE mostrar para TODOS os tipos */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground dark:text-white">
              {note.type === 'list' ? 'Descrição da Lista:' : t('notes.contentLabel')}
            </label>
            <Textarea
              placeholder={note.type === 'list' ? 'Descrição opcional da lista...' : t('notes.contentPlaceholder')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-32 resize-none"
              rows={4}
            />
          </div>

          {/* List items */}
          {note.type === 'list' && (
            <div className="space-y-6">
              {/* Pending Items */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground dark:text-white">
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
                        className="p-1 h-auto"
                        aria-label="Marcar como concluído"
                      >
                        <Circle className="w-4 h-4" />
                      </Button>
                      <Input
                        placeholder={t('typeItem')}
                        value={item.text}
                        onChange={(e) => updateListItem(item.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveListItem(item.id)}
                        className="p-1 h-auto text-destructive"
                        aria-label="Remover item"
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
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              {/* Completed Items */}
              {completedItems.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2 text-foreground dark:text-white">
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
                          className="p-1 h-auto"
                          aria-label="Marcar como pendente"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                        <div className="flex-1 bg-muted border rounded-md px-3 py-2">
                          <span className="line-through text-muted-foreground">
                            {item.text}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveListItem(item.id)}
                          className="p-1 h-auto text-destructive"
                          aria-label="Remover item"
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
        <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-4 border-t shrink-0">
          <Button
            variant="outline"
            onClick={(e) => {
              console.log('Cancel button clicked');
              handleCloseModal();
            }}
            className="flex-1 order-1 sm:order-1"
            aria-label={t('notes.cancel')}
          >
            {t('notes.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(note.id);
              onClose();
            }}
            className="px-6 order-3 sm:order-2"
            aria-label={t('notes.delete')}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('notes.delete')}
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 order-2 sm:order-3"
            aria-label={t('notes.saveChanges')}
          >
            <Check className="w-4 h-4 mr-2" />
            {t('notes.saveChanges')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};