import React, { useState, useRef, useCallback } from 'react';
import { StickyNote, StickyNoteData, NoteType } from '@/components/StickyNote';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/SearchInput';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/components/CategoryManager';
import { ClearAllNotesButton } from '@/components/ClearAllNotesButton';
import { DragDropIndicator } from '@/components/DragDropIndicator';
import { DuplicateNameWarning } from '@/components/DuplicateNameWarning';
import { useDuplicateNameCheck } from '@/hooks/useDuplicateNameCheck';
import { Plus, Grid, Search, Filter, StickyNote as StickyNoteIcon, FileText, List, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface StickyNotesBoardProps {
  notes: StickyNoteData[];
  onNoteSave: (note: Omit<StickyNoteData, 'id' | 'createdAt'>) => void;
  onNoteUpdate: (id: string, note: Partial<StickyNoteData>) => void;
  onNoteDelete: (id: string) => void;
  onClearAll?: () => void;
  categories?: Category[];
  onCategoryCreate?: (category: Omit<Category, 'id'>) => void;
  onCategoryDelete?: (categoryId: string) => void;
}

const noteTypeLabels: Record<'pt' | 'en', Record<string, string>> = {
  pt: {
    title: 'Título',
    content: 'Nota',
    list: 'Lista',
    category: 'Categoria'
  },
  en: {
    title: 'Title',
    content: 'Note',
    list: 'List',
    category: 'Category'
  }
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
  onClearAll,
  categories = [],
  onCategoryCreate,
  onCategoryDelete
}) => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<NoteType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');
  const [isGridView, setIsGridView] = useState(true);
  const [creatingNote, setCreatingNote] = useState<NoteType | null>(null);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<{ show: boolean; suggestedName?: string }>({ show: false });
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | undefined>();
  const boardRef = useRef<HTMLDivElement>(null);
  const { checkDuplicateName, generateUniqueName } = useDuplicateNameCheck(notes);

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
    // Check for duplicate note names
    const titleToCheck = noteData.title?.trim();
    if (titleToCheck && checkDuplicateName(titleToCheck)) {
      const suggestedName = generateUniqueName(titleToCheck);
      setDuplicateWarning({ show: true, suggestedName });
      return;
    }
    
    setDuplicateWarning({ show: false });
    onNoteSave(noteData);
    setCreatingNote(null);
  };

  const handleNoteUpdate = (id: string, noteData: Partial<StickyNoteData>) => {
    // Check for duplicate note names when updating title
    if (noteData.title && checkDuplicateName(noteData.title.trim(), id)) {
      const suggestedName = generateUniqueName(noteData.title.trim());
      setDuplicateWarning({ show: true, suggestedName });
      return;
    }
    
    setDuplicateWarning({ show: false });
    onNoteUpdate(id, noteData);
  };

  const handleNoteDelete = (id: string) => {
    if (id === 'temp') {
      setCreatingNote(null);
      return;
    }
    onNoteDelete(id);
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
    if (!boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - boardRect.left;
    const y = e.clientY - boardRect.top;
    setDragPosition({ x, y });
  }, []);

  const handleAcceptSuggestion = (suggestedName: string) => {
    setDuplicateWarning({ show: false });
    // Trigger the note creation/update with the suggested name
    // This would need to be implemented based on the specific context
  };

  return (
    <div className="h-full flex flex-col dark:bg-black">
      {/* Toolbar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-border p-2 sm:p-4 dark:bg-black dark:border-white/10">
        {/* Search and Actions Row */}
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          {/* Search with Filter */}
          <div className="flex-1 sm:max-w-md flex items-center">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('searchNotes')}
              className="flex-1 dark:bg-black dark:border-white/20 dark:text-white dark:placeholder:text-white/60 rounded-r-none border-r-0"
            />
            
            {/* Search Filter Popover */}
            <Popover open={showSearchFilter} onOpenChange={setShowSearchFilter}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-3 text-foreground hover:text-foreground hover:bg-accent/10 border-0 rounded-none dark:text-white dark:hover:text-white dark:hover:bg-white/10 flex items-center justify-center"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-background border text-foreground dark:bg-black dark:border-white/20 dark:text-white">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground dark:text-white">
                    {language === 'pt' ? 'Busca Avançada' : 'Advanced Search'}
                  </h4>
                  
                  {/* Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground dark:text-white/80">
                      {t('type')}
                    </label>
                    <div className="flex gap-1 flex-wrap">
                      <Button
                        variant={filterType === 'all' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType('all')}
                        className="text-foreground border-border dark:text-white dark:border-white/20"
                      >
                        {language === 'pt' ? 'Todos' : 'All'}
                      </Button>
                      {Object.entries(noteTypeLabels[language as 'pt' | 'en'] || noteTypeLabels.pt).map(([type, label]) => {
                        const Icon = noteTypeIcons[type as NoteType];
                        return (
                          <Button
                            key={type}
                            variant={filterType === type ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterType(type as NoteType)}
                            className="flex items-center gap-1 text-foreground border-border dark:text-white dark:border-white/20"
                          >
                            <Icon className="w-3 h-3" />
                            {label as string}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Filter */}
                  {categories.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground dark:text-white/80">
                        {t('category')}
                      </label>
                      <div className="flex gap-1 flex-wrap">
                        <Button
                          variant={filterCategory === 'all' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilterCategory('all')}
                          className="text-foreground border-border dark:text-white dark:border-white/20"
                        >
                          {language === 'pt' ? 'Todas' : 'All'}
                        </Button>
                        {categories.map(category => (
                          <Badge
                            key={category.id}
                            variant={filterCategory === category.id ? "default" : "outline"}
                            className={`cursor-pointer border-border dark:border-white/20 ${
                              filterCategory === category.id ? category.color + ' text-white' : 'text-foreground dark:text-white'
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

            {/* Create Menu Popover */}
            <Popover open={showCreateMenu} onOpenChange={setShowCreateMenu}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-3 text-foreground hover:text-foreground hover:bg-accent/10 border border-border rounded-l-none border-l-0 dark:text-white dark:hover:text-white dark:hover:bg-white/10 dark:border-white/20 flex items-center justify-center"
                  disabled={creatingNote !== null}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 bg-background border text-foreground dark:bg-black dark:border-white/20 dark:text-white">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground dark:text-white mb-3">
                    {language === 'pt' ? 'Criar Nova Nota' : 'Create New Note'}
                  </h4>
                  {Object.entries(noteTypeLabels[language as 'pt' | 'en'] || noteTypeLabels.pt).map(([type, label]) => {
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
                        className="w-full justify-start text-foreground hover:text-foreground hover:bg-accent/10 dark:text-white dark:hover:text-white dark:hover:bg-white/10"
                        disabled={creatingNote !== null}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {label as string}
                      </Button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Action Buttons Row */}
          <div className="flex gap-2 items-center">
            {/* View Toggle */}
            <Button
              variant={isGridView ? "default" : "outline"}
              size="sm"
              onClick={() => setIsGridView(!isGridView)}
              className="flex items-center gap-2 text-black bg-white border-white/20 hover:text-black hover:bg-white/90"
            >
              <Grid className="w-4 h-4 text-black" />
              <span className="hidden sm:inline">
                {isGridView 
                  ? (language === 'pt' ? 'Grade' : 'Grid')
                  : (language === 'pt' ? 'Lista' : 'List')
                }
              </span>
            </Button>
            
            {/* Clear All Button */}
            {notes.length > 0 && onClearAll && (
              <ClearAllNotesButton
                onClearAll={onClearAll}
                notesCount={notes.length}
              />
            )}
          </div>
        </div>
      </div>

      {/* Notes Board */}
      <div 
        ref={boardRef}
        className={`flex-1 overflow-auto p-2 sm:p-4 dark:bg-black ${
          isGridView 
            ? 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4 justify-items-center' 
            : 'space-y-2 sm:space-y-4'
        }`}
        onDrop={handleBoardDrop}
        onDragOver={handleBoardDragOver}
      >
        {/* Duplicate Name Warning */}
        {duplicateWarning.show && (
          <div className="col-span-full">
            <DuplicateNameWarning
              show={duplicateWarning.show}
              suggestedName={duplicateWarning.suggestedName}
              onAcceptSuggestion={handleAcceptSuggestion}
            />
          </div>
        )}

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
              onSave={(updatedNote) => handleNoteUpdate(note.id, updatedNote)}
              onDelete={handleNoteDelete}
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
            <StickyNoteIcon className="w-16 h-16 text-muted-foreground/50 dark:text-white/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground dark:text-white mb-2">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                ? (language === 'pt' ? 'Nenhuma nota encontrada' : 'No notes found')
                : (language === 'pt' ? 'Nenhuma nota ainda' : 'No notes yet')
              }
            </h3>
            <p className="text-muted-foreground dark:text-white/80 mb-4">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                ? (language === 'pt' ? 'Tente ajustar os filtros de busca' : 'Try adjusting search filters')
                : (language === 'pt' ? 'Comece criando sua primeira nota' : 'Start by creating your first note')
              }
            </p>
            {!searchTerm && filterType === 'all' && filterCategory === 'all' && (
              <div className="flex gap-2">
                {Object.entries(noteTypeLabels[language as 'pt' | 'en'] || noteTypeLabels.pt).slice(0, 3).map(([type, label]) => {
                  const Icon = noteTypeIcons[type as NoteType];
                  return (
                    <Button
                      key={type}
                      variant="outline"
                      onClick={() => handleCreateNote(type as NoteType)}
                      className="flex items-center gap-1 text-foreground border-border hover:text-foreground dark:text-white dark:border-white/20 dark:hover:text-white"
                    >
                      <Icon className="w-4 h-4" />
                      {label as string}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Drag and Drop Indicator */}
      <DragDropIndicator 
        isDragActive={!!draggedNote} 
        position={dragPosition}
      />

      {/* Results Counter */}
      {filteredNotes.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border-t border-border p-2 text-center dark:bg-black dark:border-white/10">
          <span className="text-sm text-muted-foreground dark:text-white/80">
            {filteredNotes.length} {
              language === 'pt' 
                ? (filteredNotes.length === 1 ? 'nota' : 'notas')
                : (filteredNotes.length === 1 ? 'note' : 'notes')
            }
            {searchTerm && (language === 'pt' ? ` para "${searchTerm}"` : ` for "${searchTerm}"`)}
          </span>
        </div>
      )}
    </div>
  );
};
