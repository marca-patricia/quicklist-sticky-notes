import React, { useState, useRef, useCallback } from 'react';
import { StickyNote, StickyNoteData, NoteType } from '@/components/StickyNote';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/SearchInput';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/components/CategoryManager';
import { Plus, Grid, Search, Filter, StickyNote as StickyNoteIcon, FileText, List, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StickyNotesBoardProps {
  notes: StickyNoteData[];
  onNoteSave: (note: Omit<StickyNoteData, 'id' | 'createdAt'>) => void;
  onNoteUpdate: (id: string, note: Partial<StickyNoteData>) => void;
  onNoteDelete: (id: string) => void;
  categories?: Category[];
  onCategoryCreate?: (category: Omit<Category, 'id'>) => void;
  onCategoryDelete?: (categoryId: string) => void;
}

const noteTypeLabels = {
  title: 'Título',
  content: 'Nota',
  list: 'Lista',
  category: 'Categoria'
};

const noteTypeIcons = {
  title: FileText,
  content: StickyNoteIcon,
  list: List,
  category: Tag
};

export const StickyNotesBoard: React.FC<StickyNotesBoardProps> = ({
  notes,
  onNoteSave,
  onNoteUpdate,
  onNoteDelete,
  categories = [],
  onCategoryCreate,
  onCategoryDelete
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<NoteType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');
  const [isGridView, setIsGridView] = useState(true);
  const [creatingNote, setCreatingNote] = useState<NoteType | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Filter notes based on search and filters
  const filteredNotes = notes.filter(note => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.items?.some(item => item.toLowerCase().includes(searchTerm.toLowerCase())) ||
      note.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    const matchesType = filterType === 'all' || note.type === filterType;

    // Category filter
    const matchesCategory = filterCategory === 'all' || 
      (note.category && note.category.id === filterCategory);

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleCreateNote = (type: NoteType) => {
    setCreatingNote(type);
  };

  const handleNoteSave = (noteData: Omit<StickyNoteData, 'id' | 'createdAt'>) => {
    onNoteSave(noteData);
    setCreatingNote(null);
    setEditingNote(null);
  };

  const handleNoteEdit = (id: string) => {
    setEditingNote(id);
  };

  const handleNoteDelete = (id: string) => {
    if (id === 'temp') {
      setCreatingNote(null);
      return;
    }
    onNoteDelete(id);
    setEditingNote(null);
  };

  const handleDragStart = useCallback((id: string) => {
    setDraggedNote(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedNote(null);
  }, []);

  const handleBoardDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNote || !boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - boardRect.left;
    const y = e.clientY - boardRect.top;

    onNoteUpdate(draggedNote, {
      position: { x, y }
    });
  }, [draggedNote, onNoteUpdate]);

  const handleBoardDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-border p-4 space-y-4">
        {/* Search and View Toggle */}
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar notas..."
              className="w-full"
            />
          </div>
          
          <Button
            variant={isGridView ? "default" : "outline"}
            size="sm"
            onClick={() => setIsGridView(!isGridView)}
            className="flex items-center gap-2"
          >
            <Grid className="w-4 h-4" />
            {isGridView ? 'Grade' : 'Lista'}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center flex-wrap">
          {/* Type Filter */}
          <div className="flex gap-1">
            <Button
              variant={filterType === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              Todos
            </Button>
            {Object.entries(noteTypeLabels).map(([type, label]) => {
              const Icon = noteTypeIcons[type as NoteType];
              return (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type as NoteType)}
                  className="flex items-center gap-1"
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </Button>
              );
            })}
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex gap-1 items-center">
              <span className="text-sm text-muted-foreground">Categoria:</span>
              <Button
                variant={filterCategory === 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterCategory('all')}
              >
                Todas
              </Button>
              {categories.map(category => (
                <Badge
                  key={category.id}
                  variant={filterCategory === category.id ? "default" : "outline"}
                  className={`cursor-pointer ${
                    filterCategory === category.id ? category.color + ' text-white' : ''
                  }`}
                  onClick={() => setFilterCategory(
                    filterCategory === category.id ? 'all' : category.id
                  )}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Create Note Buttons */}
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium text-muted-foreground">Criar:</span>
          {Object.entries(noteTypeLabels).map(([type, label]) => {
            const Icon = noteTypeIcons[type as NoteType];
            return (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => handleCreateNote(type as NoteType)}
                className="flex items-center gap-1"
                disabled={creatingNote !== null}
              >
                <Icon className="w-3 h-3" />
                {label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Notes Board - Grid organizado conforme análise */}
      <div 
        ref={boardRef}
        className={`flex-1 overflow-auto p-4 ${
          isGridView 
            ? 'grid gap-4 justify-items-start items-start' 
            : 'space-y-4'
        }`}
        style={{
          gridTemplateColumns: isGridView ? 'repeat(auto-fill, minmax(160px, 1fr))' : undefined,
          gridAutoRows: isGridView ? '160px' : undefined
        }}
        onDrop={handleBoardDrop}
        onDragOver={handleBoardDragOver}
      >
        {/* Creating Note */}
        {creatingNote && (
          <div className={isGridView ? '' : 'flex justify-center'}>
            <StickyNote
              isCreating
              noteType={creatingNote}
              onSave={handleNoteSave}
              onDelete={handleNoteDelete}
              categories={categories}
              onCategoryCreate={onCategoryCreate}
              onCategoryDelete={onCategoryDelete}
            />
          </div>
        )}

        {/* Existing Notes */}
        {filteredNotes.map(note => (
          <div key={note.id} className={isGridView ? '' : 'flex justify-center'}>
            <StickyNote
              note={note}
              isEditing={editingNote === note.id}
              onSave={(updatedNote) => {
                onNoteUpdate(note.id, updatedNote);
                setEditingNote(null);
              }}
              onDelete={handleNoteDelete}
              onEdit={handleNoteEdit}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              categories={categories}
              onCategoryCreate={onCategoryCreate}
              onCategoryDelete={onCategoryDelete}
            />
          </div>
        ))}

        {/* Empty State */}
        {filteredNotes.length === 0 && !creatingNote && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <StickyNoteIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                ? 'Nenhuma nota encontrada'
                : 'Nenhuma nota ainda'
              }
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando sua primeira nota'
              }
            </p>
            {!searchTerm && filterType === 'all' && filterCategory === 'all' && (
              <div className="flex gap-2">
                {Object.entries(noteTypeLabels).slice(0, 3).map(([type, label]) => {
                  const Icon = noteTypeIcons[type as NoteType];
                  return (
                    <Button
                      key={type}
                      variant="outline"
                      onClick={() => handleCreateNote(type as NoteType)}
                      className="flex items-center gap-1"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Counter */}
      {filteredNotes.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border-t border-border p-2 text-center">
          <span className="text-sm text-muted-foreground">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'nota' : 'notas'}
            {searchTerm && ` para "${searchTerm}"`}
          </span>
        </div>
      )}
    </div>
  );
};
