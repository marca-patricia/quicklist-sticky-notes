import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CategoryManager, Category } from '@/components/CategoryManager';
import { PostItFeedback } from '@/components/PostItFeedback';
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
  'hsl(var(--note-yellow))',
  'hsl(var(--note-blue))',
  'hsl(var(--note-green))',
  'hsl(var(--note-pink))',
  'hsl(var(--note-orange))',
  'hsl(var(--note-purple))'
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
  const [isMobile, setIsMobile] = useState(false);

  const TypeIcon = noteTypeIcons[currentType];

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Classes responsivas sem animações exageradas
  const noteClasses = `
    sticky-note
    ${isMobile ? 'sticky-note-mobile' : ''}
    ${isDragging ? 'opacity-50' : 'hover:scale-101'}
    cursor-grab active:cursor-grabbing transition-all duration-200 group
  `;

  if (editMode) {
    return (
      <Card 
        className={`p-3 border-2 border-primary/20 ${isMobile ? 'sticky-note-mobile' : 'sticky-note'}`}
        style={{ 
          backgroundColor: selectedColor
        }}
      >
        {/* Type Selector */}
        <div className="flex gap-1 mb-3">
          {Object.entries(noteTypeIcons).map(([type, Icon]) => (
            <Button
              key={type}
              variant={currentType === type ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentType(type as NoteType)}
              className="p-1 h-auto btn-touch"
            >
              <Icon className="w-3 h-3" />
            </Button>
          ))}
        </div>

        {/* Color Picker */}
        <div className="flex gap-1 mb-3">
          {noteColors.map((color) => (
            <button
              key={color}
              className={`w-4 h-4 rounded-full border-2 transition-all btn-touch ${
                selectedColor === color ? 'border-foreground scale-110' : 'border-border'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>

        {/* Content based on type */}
        {currentType === 'title' && (
          <Input
            placeholder="Digite o título..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-3 bg-white/80 border-none text-lg font-semibold"
            autoFocus
          />
        )}

        {currentType === 'content' && (
          <>
            <Input
              placeholder="Título (opcional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2 bg-white/80 border-none font-medium"
            />
            <Textarea
              placeholder="Escreva sua nota..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mb-3 bg-white/80 border-none resize-none min-h-[80px]"
              autoFocus={!title}
            />
          </>
        )}

        {currentType === 'list' && (
          <>
            <Input
              placeholder="Título da lista"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2 bg-white/80 border-none font-medium"
            />
            <div className="space-y-1 mb-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-1">
                  <Input
                    placeholder={`Item ${index + 1}`}
                    value={item}
                    onChange={(e) => updateListItem(index, e.target.value)}
                    className="bg-white/80 border-none text-sm"
                  />
                  {items.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveListItem(index)}
                      className="p-1 h-auto btn-touch"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddListItem}
              className="w-full text-xs btn-touch"
            >
              <Plus className="w-3 h-3 mr-1" />
              Adicionar item
            </Button>
          </>
        )}

        {currentType === 'category' && (
          <div className="space-y-3">
            <Input
              placeholder="Nome da categoria"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/80 border-none font-medium"
            />
            {categories.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-medium">Ou escolha uma existente:</label>
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

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="flex-1 btn-touch"
          >
            <Check className="w-3 h-3 mr-1" />
            Salvar
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
            className="btn-touch"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </Card>
    );
  }

  if (!note) return null;

  return (
    <Card
      draggable={!!note.id}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={noteClasses}
      style={{ 
        backgroundColor: note.color,
        transform: isDragging ? 'rotate(5deg)' : undefined
      }}
    >
      {/* Header with type icon and actions */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <TypeIcon className="w-4 h-4 text-note-text" />
          {note.category && (
            <Badge 
              variant="secondary" 
              className={`text-xs ${note.category.color} text-white`}
            >
              {note.category.name}
            </Badge>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(note.id)}
            className="p-1 h-auto hover:bg-white/20 btn-touch"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(note.id)}
            className="p-1 h-auto hover:bg-white/20 text-destructive btn-touch"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="text-note-text">
        {note.title && (
          <h3 className={`font-semibold mb-2 ${
            note.type === 'title' ? 'text-lg' : 'text-sm'
          }`}>
            {note.title}
          </h3>
        )}

        {note.content && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {note.content}
          </p>
        )}

        {note.items && note.items.length > 0 && (
          <ul className="space-y-1">
            {note.items.map((item, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-xs mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <PostItFeedback 
        show={showFeedback} 
        message="Post-it salvo com sucesso!" 
      />
      
      {/* Timestamp */}
      <div className="text-xs text-note-text/60 mt-2 border-t border-note-text/10 pt-2">
        {new Date(note.createdAt).toLocaleDateString()}
      </div>
    </Card>
  );
};