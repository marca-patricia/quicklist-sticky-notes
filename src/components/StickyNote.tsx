import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CategoryManager, Category } from '@/components/CategoryManager';
import { PostItFeedback } from '@/components/PostItFeedback';
import { NoteEditModal } from '@/components/NoteEditModal';
import { ListOverlay } from '@/components/ListOverlay';
import { Plus, X, Edit3, Check, Trash2, Tag, List, FileText, StickyNote as StickyNoteIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export type NoteType = 'title' | 'content' | 'list' | 'category';

export interface StickyNoteData {
  id: string;
  type: NoteType;
  title?: string;
  content?: string;
  items?: string[];
  category?: Category;
  color: string;
  position: { x: number; y: number };
  createdAt: Date;
}

interface StickyNoteProps {
  note?: StickyNoteData;
  isEditing?: boolean;
  onSave?: (note: Omit<StickyNoteData, 'id' | 'createdAt'>) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  isCreating?: boolean;
  noteType?: NoteType;
  categories?: Category[];
  onCategoryCreate?: (category: Omit<Category, 'id'>) => void;
  onCategoryDelete?: (categoryId: string) => void;
}

const noteTypeIcons = {
  title: FileText,
  content: StickyNoteIcon,
  list: List,
  category: Tag
};

const noteColors = [
  '#FFF59D', // Yellow
  '#90CAF9', // Blue  
  '#A5D6A7', // Green
  '#F8BBD9', // Pink
  '#FFCC80', // Orange
  '#CE93D8'  // Purple
];

export const StickyNote: React.FC<StickyNoteProps> = ({
  note,
  isEditing = false,
  onSave,
  onDelete,
  onEdit,
  onDragStart,
  onDragEnd,
  isCreating = false,
  noteType = 'content',
  categories = [],
  onCategoryCreate,
  onCategoryDelete
}) => {
  const { t } = useLanguage();
  const [editMode, setEditMode] = useState(isCreating || isEditing);
  const [currentType, setCurrentType] = useState(note?.type || noteType);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [items, setItems] = useState(note?.items || ['']);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(note?.category);
  const [selectedColor, setSelectedColor] = useState(note?.color || noteColors[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showListOverlay, setShowListOverlay] = useState(false);

  const TypeIcon = noteTypeIcons[currentType];

  const handleSave = () => {
    if (!title.trim() && !content.trim() && items.every(item => !item.trim())) return;

    const noteData = {
      type: currentType,
      title: title.trim() || undefined,
      content: content.trim() || undefined,
      items: currentType === 'list' ? items.filter(item => item.trim()) : undefined,
      category: currentType === 'category' ? selectedCategory : undefined,
      color: selectedColor,
      position: note?.position || { x: 0, y: 0 }
    };

    onSave?.(noteData);
    setEditMode(false);
    
    // Show feedback
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleAddListItem = () => {
    setItems([...items, '']);
  };

  const handleRemoveListItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateListItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!note?.id) return;
    setIsDragging(true);
    onDragStart?.(note.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  if (editMode) {
    return (
      <Card 
        className="w-56 h-64 p-3 border-2 border-primary/20 animate-scale-in shadow-postit hover:shadow-postit-hover transition-all duration-300 flex flex-col"
        style={{ 
          backgroundColor: selectedColor,
          boxShadow: 'var(--shadow-postit)',
          borderRadius: '2px' /* Cantos bem afiados como post-its reais */
        }}
      >
        {/* Type Selector */}
        <div className="flex gap-1 mb-2 flex-shrink-0">
          {Object.entries(noteTypeIcons).map(([type, Icon]) => (
            <Button
              key={type}
              variant={currentType === type ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentType(type as NoteType)}
              className="p-1 h-6 w-6"
            >
              <Icon className="w-3 h-3 text-black" />
            </Button>
          ))}
        </div>

        {/* Color Picker */}
        <div className="flex gap-1 mb-2 flex-shrink-0">
          {noteColors.map((color) => (
            <button
              key={color}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                selectedColor === color ? 'border-foreground scale-110' : 'border-border'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Content based on type */}
          {currentType === 'title' && (
            <Input
              placeholder={t('Digite o título...')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/80 border-none text-sm font-semibold h-8"
              autoFocus
            />
          )}

          {currentType === 'content' && (
            <div className="flex flex-col flex-1 min-h-0">
              <Input
                placeholder={t('Título (opcional)')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-2 bg-white/80 border-none font-medium text-sm h-8"
              />
              <Textarea
                placeholder={t('Escreva sua nota...')}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-white/80 border-none resize-none text-sm flex-1 min-h-[40px] max-h-[60px]"
                autoFocus={!title}
              />
            </div>
          )}

          {currentType === 'list' && (
            <div className="flex flex-col flex-1 min-h-0">
              <Input
                placeholder={t('Título da lista')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-2 bg-white/80 border-none font-medium text-sm h-8"
              />
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="space-y-1 flex-1 overflow-y-auto min-h-0">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-1">
                      <Input
                        placeholder={`${t('Item')} ${index + 1}`}
                        value={item}
                        onChange={(e) => updateListItem(index, e.target.value)}
                        className="bg-white/80 border-none text-xs h-7"
                      />
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveListItem(index)}
                          className="p-1 h-7 w-7 flex-shrink-0"
                        >
                          <X className="w-3 h-3 text-black" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddListItem}
                  className="w-full text-xs text-black h-7 mt-1 flex-shrink-0"
                >
                  <Plus className="w-3 h-3 mr-1 text-black" />
                  {t('Adicionar item')}
                </Button>
              </div>
            </div>
          )}

          {currentType === 'category' && (
            <div className="flex flex-col flex-1 min-h-0">
              <Input
                placeholder={t('Nome da categoria')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/80 border-none font-medium text-sm h-8 mb-2"
              />
              {categories.length > 0 && (
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <label className="text-xs font-medium block mb-1">{t('Ou escolha uma existente:')}</label>
                  <CategoryManager
                    categories={categories}
                    selectedCategories={selectedCategory ? [selectedCategory.id] : []}
                    onCategorySelect={(id) => {
                      const category = categories.find(c => c.id === id);
                      setSelectedCategory(category);
                      if (category) setTitle(category.name);
                    }}
                    onCategoryCreate={onCategoryCreate || (() => {})}
                    onCategoryDelete={onCategoryDelete || (() => {})}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2 flex-shrink-0">
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="flex-1 text-black text-xs h-7"
          >
            <Check className="w-3 h-3 mr-1 text-black" />
            {t('Salvar')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditMode(false);
              if (isCreating && onDelete) {
                onDelete('temp');
              }
            }}
            className="text-black h-7 w-7 p-0 flex-shrink-0"
          >
            <X className="w-3 h-3 text-black" />
          </Button>
        </div>
      </Card>
    );
  }

  if (!note) return null;

  const handleEditClick = () => {
    // Para mobile, sempre abrir modal de edição diretamente
    if (window.innerWidth <= 768) {
      setShowEditModal(true);
    } else {
      // Para desktop, comportamento normal
      if (note.type === 'list') {
        setShowListOverlay(true);
      } else {
        setShowEditModal(true);
      }
    }
  };

  const handleModalSave = (noteData: Partial<StickyNoteData>) => {
    onSave?.({
      type: note.type,
      color: note.color,
      position: note?.position || { x: 0, y: 0 },
      ...noteData
    });
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  return (
    <Card
      draggable={!!note.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleEditClick}
      className={`w-56 h-64 md:w-56 md:h-64 p-3 hover:shadow-postit-hover transition-all duration-300 group cursor-pointer mobile-touch-target ${
        isDragging ? 'opacity-50 rotate-2' : 'hover:scale-105'
      } sticky-note-mobile`}
      style={{ 
        backgroundColor: note.color,
        transform: isDragging ? 'rotate(5deg)' : undefined,
        boxShadow: 'var(--shadow-postit)',
        borderRadius: '2px' /* Cantos afiados como post-its reais */
      }}
    >
      {/* Header with type icon and actions */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <TypeIcon className="w-4 h-4 text-black dark:text-black" />
          {note.category && (
            <Badge 
              variant="secondary" 
              className={`text-xs ${note.category.color} text-white`}
            >
              {note.category.name}
            </Badge>
          )}
        </div>
        {/* Actions only visible on desktop hover, hidden on mobile for direct click */}
        <div className="hidden md:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick();
            }}
            className="p-1 h-auto hover:bg-white/20"
          >
            <Edit3 className="w-3 h-3 text-black dark:text-black" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(note.id);
            }}
            className="p-1 h-auto hover:bg-white/20 text-destructive"
          >
            <Trash2 className="w-3 h-3 text-black dark:text-black" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="text-black dark:text-black">
        {note.title && (
          <h3 className={`font-semibold mb-2 text-black dark:text-black ${
            note.type === 'title' ? 'text-lg' : 'text-sm'
          }`}>
            {note.title}
          </h3>
        )}

        {note.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-black dark:text-black sticky-note-content">
            {note.content}
          </p>
        )}

        {note.items && note.items.length > 0 && (
          <ul className="space-y-1">
            {note.items.map((item, index) => (
              <li key={index} className="text-sm flex items-start gap-2 text-black dark:text-black">
                <span className="text-xs mt-1 text-black dark:text-black">•</span>
                <span className="text-black dark:text-black">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <PostItFeedback 
        show={showFeedback} 
        message={t('Post-it salvo com sucesso!')} 
      />
      
      {/* Timestamp */}
      <div className="text-xs text-black/60 dark:text-black/60 mt-2 border-t border-black/10 dark:border-black/10 pt-2">
        {new Date(note.createdAt).toLocaleDateString()}
      </div>

      {/* Edit Modal */}
      <NoteEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        note={note}
        onSave={handleModalSave}
        onDelete={onDelete || (() => {})}
        categories={categories}
        onCategoryCreate={onCategoryCreate}
        onCategoryDelete={onCategoryDelete}
      />

      {/* List Overlay */}
      <ListOverlay
        isOpen={showListOverlay}
        onClose={() => setShowListOverlay(false)}
        note={note}
        onEdit={() => {
          setShowListOverlay(false);
          setShowEditModal(true);
        }}
      />
    </Card>
  );
};