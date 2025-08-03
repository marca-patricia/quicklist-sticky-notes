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
      {/* TOOLBAR ELEGANTE - Compacta e minimalista */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-3">
        {/* Linha principal - Busca e controles */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar notas..."
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-white hover:bg-white/20 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsGridView(!isGridView)}
              className="text-white hover:bg-white/20 flex items-center gap-2"
            >
              <Grid className="w-4 h-4" />
              {isGridView ? 'Grade' : 'Lista'}
            </Button>
          </div>
        </div>

        {/* Linha de criação de notas - sempre visível */}
        <div className="flex items-center gap-2">
          <span className="text-white/80 text-sm font-medium">Criar:</span>
          {Object.entries(noteTypeLabels).map(([type, label]) => {
            const Icon = noteTypeIcons[type as NoteType];
            return (
              <Button
                key={type}
                variant="ghost"
                size="sm"
                onClick={() => handleCreateNote(type as NoteType)}
                className="text-white hover:bg-white/20 flex items-center gap-1"
                disabled={creatingNote !== null}
              >
                <Icon className="w-3 h-3" />
                {label}
              </Button>
            );
          })}
        </div>

        {/* Filtros expansíveis */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-white/20 space-y-3">
            {/* Filtro por tipo */}
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-sm font-medium min-w-[60px]">Tipo:</span>
              <div className="flex gap-1 flex-wrap">
                <Button
                  variant={filterType === 'all' ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilterType('all')}
                  className="text-white hover:bg-white/20"
                >
                  Todos
                </Button>
                {Object.entries(noteTypeLabels).map(([type, label]) => {
                  const Icon = noteTypeIcons[type as NoteType];
                  return (
                    <Button
                      key={type}
                      variant={filterType === type ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setFilterType(type as NoteType)}
                      className="text-white hover:bg-white/20 flex items-center gap-1"
                    >
                      <Icon className="w-3 h-3" />
                      {label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Filtro por categoria */}
            {categories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm font-medium min-w-[60px]">Categoria:</span>
                <div className="flex gap-1 flex-wrap">
                  <Button
                    variant={filterCategory === 'all' ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setFilterCategory('all')}
                    className="text-white hover:bg-white/20"
                  >
                    Todas
                  </Button>
                  {categories.map(category => (
                    <Badge
                      key={category.id}
                      variant={filterCategory === category.id ? "default" : "outline"}
                      className={`cursor-pointer hover:opacity-80 ${
                        filterCategory === category.id 
                          ? 'bg-white/30 text-white border-white/50' 
                          : 'border-white/30 text-white/80 hover:bg-white/20'
                      }`}
                      onClick={() => setFilterCategory(
                        filterCategory === category.id ? 'all' : category.id
                      )}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notes Board - Grid organizado */}
      <div 
        ref={boardRef}
        className={gridClasses}
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
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md">
              <StickyNoteIcon className="w-16 h-16 text-white/50 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                  ? 'Nenhuma nota encontrada'
                  : 'Suas notas aparecerão aqui'
                }
              </h3>
              <p className="text-white/70 mb-6">
                {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                  ? 'Tente ajustar os filtros de busca acima'
                  : 'Comece criando sua primeira nota usando os botões acima'
                }
              </p>
              {!searchTerm && filterType === 'all' && filterCategory === 'all' && (
                <div className="flex gap-2 justify-center">
                  {Object.entries(noteTypeLabels).slice(0, 3).map(([type, label]) => {
                    const Icon = noteTypeIcons[type as NoteType];
                    return (
                      <Button
                        key={type}
                        variant="secondary"
                        onClick={() => handleCreateNote(type as NoteType)}
                        className="flex items-center gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar minimalista - só quando necessário */}
      {filteredNotes.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border-t border-white/10 px-6 py-2">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">
              {filteredNotes.length} {filteredNotes.length === 1 ? 'nota' : 'notas'}
              {searchTerm && ` para "${searchTerm}"`}
            </span>
            {(filterType !== 'all' || filterCategory !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterType('all');
                  setFilterCategory('all');
                  setSearchTerm('');
                }}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
