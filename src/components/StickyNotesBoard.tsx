import React, { useState, useRef, useCallback } from 'react';
import { StickyNote, StickyNoteData, NoteType } from '@/components/StickyNote';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/SearchInput';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/components/CategoryManager';
import { Plus, Grid, Search, Filter, StickyNote as StickyNoteIcon, FileText, List, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
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
    <div className="h-full flex flex-col bg-black">
      {/* Toolbar */}
      <div className="bg-black border-b border-white/10 p-4">
        {/* Search and Actions Row */}
        <div className="flex gap-4 items-center">
          {/* Search with Filter */}
          <div className="flex-1 max-w-md flex gap-2">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar notas..."
              className="flex-1 bg-black border-white/20 text-white placeholder:text-white/60"
            />
            
            {/* Search Filter Popover */}
            <Popover open={showSearchFilter} onOpenChange={setShowSearchFilter}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-white/10 border border-white/20"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-black border-white/20 text-white">
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Busca Avançada</h4>
                  
                  {/* Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Tipo:</label>
                    <div className="flex gap-1 flex-wrap">
                      <Button
                        variant={filterType === 'all' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType('all')}
                        className="text-white border-white/20"
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
                            className="flex items-center gap-1 text-white border-white/20"
                          >
                            <Icon className="w-3 h-3" />
                            {label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Filter */}
                  {categories.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm text-white/80">Categoria:</label>
                      <div className="flex gap-1 flex-wrap">
                        <Button
                          variant={filterCategory === 'all' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilterCategory('all')}
                          className="text-white border-white/20"
                        >
                          Todas
                        </Button>
                        {categories.map(category => (
                          <Badge
                            key={category.id}
                            variant={filterCategory === category.id ? "default" : "outline"}
                            className={`cursor-pointer border-white/20 ${
                              filterCategory === category.id ? category.color + ' text-white' : 'text-white'
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
              </PopoverContent>
            </Popover>
          </div>

          {/* Create Menu Popover */}
          <Popover open={showCreateMenu} onOpenChange={setShowCreateMenu}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/10 border border-white/20"
                disabled={creatingNote !== null}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 bg-black border-white/20 text-white">
              <div className="space-y-2">
                <h4 className="font-medium text-white mb-3">Criar Nova Nota</h4>
                {Object.entries(noteTypeLabels).map(([type, label]) => {
                  const Icon = noteTypeIcons[type as NoteType];
                  return (
                    <Button
                      key={type}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleCreateNote(type as NoteType);
                        setShowCreateMenu(false);
                      }}
                      className="w-full justify-start text-white hover:text-white hover:bg-white/10"
                      disabled={creatingNote !== null}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </Button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* View Toggle */}
          <Button
            variant={isGridView ? "default" : "outline"}
            size="sm"
            onClick={() => setIsGridView(!isGridView)}
            className="flex items-center gap-2 text-black bg-white border-white/20 hover:text-black hover:bg-white/90"
          >
            <Grid className="w-4 h-4 text-black" />
            {isGridView ? 'Grade' : 'Lista'}
          </Button>
        </div>
      </div>

      {/* Notes Board */}
      <div 
        ref={boardRef}
        className={`flex-1 overflow-auto p-4 bg-black ${
          isGridView 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 justify-items-center' 
            : 'space-y-4'
        }`}
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
            <StickyNoteIcon className="w-16 h-16 text-white/50 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                ? 'Nenhuma nota encontrada'
                : 'Nenhuma nota ainda'
              }
            </h3>
            <p className="text-white/80 mb-4">
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
                      className="flex items-center gap-1 text-white border-white/20 hover:text-white"
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
        <div className="bg-black border-t border-white/10 p-2 text-center">
          <span className="text-sm text-white/80">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'nota' : 'notas'}
            {searchTerm && ` para "${searchTerm}"`}
          </span>
        </div>
      )}
    </div>
  );
};
