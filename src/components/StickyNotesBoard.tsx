import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Classes responsivas para o grid
  const gridClasses = `
    flex-1 overflow-auto p-6
    ${isGridView 
      ? `notes-grid ${isMobile ? 'notes-grid-mobile' : ''}` 
      : 'space-y-4'
    }
  `;

  return (
    <div className="h-full flex flex-col">
      {/* TOOLBAR ESTILO POST-IT PROFISSIONAL */}
      <div className="toolbar-postit px-6 py-4">
        {/* Busca aprimorada */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar notas..."
              className="search-input w-full"
            />
          </div>
          
          <Button
            variant={isGridView ? "default" : "outline"}
            size="sm"
            onClick={() => setIsGridView(!isGridView)}
            className="button-enhanced flex items-center gap-2 bg-white/90 hover:bg-white border-amber-300"
          >
            <Grid className="w-4 h-4" />
            Grade
          </Button>
        </div>

        {/* Botões de criar nota - estilo post-it */}
        <div className="flex gap-3 flex-wrap">
          {Object.entries(noteTypeLabels).map(([type, label]) => {
            const Icon = noteTypeIcons[type as NoteType];
            return (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => handleCreateNote(type as NoteType)}
                className="button-enhanced flex items-center gap-2 bg-white/90 hover:bg-white border-amber-400 hover:border-amber-500 transition-all duration-200"
                disabled={creatingNote !== null}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Notes Board - Fundo de cortiça visível */}
      <div 
        ref={boardRef}
        className={gridClasses}
        onDrop={handleBoardDrop}
        onDragOver={handleBoardDragOver}
        style={{ backgroundColor: 'transparent' }}
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

        {/* Empty State Simples */}
        {filteredNotes.length === 0 && !creatingNote && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <StickyNoteIcon className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                ? 'Nenhuma nota encontrada'
                : 'Nenhuma nota ainda'
              }
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando sua primeira nota'
              }
            </p>
          </div>
        )}
      </div>

      {/* Status simples - removido */}
    </div>
  );
};
