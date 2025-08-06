import React, { useState, useEffect } from 'react';
import { StickyNotesBoard } from '@/components/StickyNotesBoard';
import { StickyNoteData, NoteType } from '@/components/StickyNote';
import { FloatingStickyButton } from '@/components/FloatingStickyButton';
import { Category } from '@/components/CategoryManager';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { QuickListLogo } from '@/components/QuickListLogo';
import { OfflineStatus } from '@/components/OfflineStatus';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { StickyNotesStorage } from '@/utils/stickyNotesStorage';
import { toast } from '@/hooks/use-toast';
import { useAutoSave } from '@/hooks/useAutoSave';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { HelpModal } from '@/components/HelpModal';
import { useTheme } from '@/hooks/useTheme';

export const StickyNotesPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const [notes, setNotes] = useState<StickyNoteData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pendingNoteType, setPendingNoteType] = useState<NoteType | null>(null);
  
  // Auto-save hook para garantir persistência
  useAutoSave(notes, categories);

  // Load data from robust storage on mount
  useEffect(() => {
    try {
      const savedNotes = StickyNotesStorage.loadNotes();
      const savedCategories = StickyNotesStorage.loadCategories();
      
      setNotes(savedNotes);
      setCategories(savedCategories);
      
          if (savedNotes.length > 0 || savedCategories.length > 0) {
            toast({
              title: language === 'pt' ? "Bem-vindo de volta!" : "Welcome back!",
              description: language === 'pt' 
                ? `${savedNotes.length} notas e ${savedCategories.length} categorias carregadas`
                : `${savedNotes.length} notes and ${savedCategories.length} categories loaded`,
              duration: 2000,
            });
          }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: language === 'pt' ? "Erro ao carregar dados" : "Error loading data",
        description: language === 'pt' 
          ? "Alguns dados podem não ter sido carregados corretamente"
          : "Some data may not have been loaded correctly",
        variant: "destructive"
      });
    }
  }, []);

  // Save to storage with error handling
  useEffect(() => {
    if (notes.length === 0) return; // Don't save empty state on initial load
    
    const success = StickyNotesStorage.saveNotes(notes);
    if (!success) {
      toast({
        title: language === 'pt' ? "Erro ao salvar" : "Save error",
        description: language === 'pt' 
          ? "Não foi possível salvar as notas"
          : "Could not save notes",
        variant: "destructive"
      });
    }
  }, [notes]);

  useEffect(() => {
    if (categories.length === 0) return; // Don't save empty state on initial load
    
    const success = StickyNotesStorage.saveCategories(categories);
    if (!success) {
      toast({
        title: language === 'pt' ? "Erro ao salvar" : "Save error",
        description: language === 'pt' 
          ? "Não foi possível salvar as categorias"
          : "Could not save categories",
        variant: "destructive"
      });
    }
  }, [categories]);

  const handleNoteSave = (noteData: Omit<StickyNoteData, 'id' | 'createdAt'>) => {
    const newNote: StickyNoteData = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setNotes(prev => {
      const updated = [...prev, newNote];
      toast({
        title: language === 'pt' ? "Nota salva" : "Note saved",
        description: language === 'pt' 
          ? `${noteData.type === 'list' ? 'Lista' : 'Nota'} criada com sucesso!`
          : `${noteData.type === 'list' ? 'List' : 'Note'} created successfully!`,
      });
      return updated;
    });
  };

  const handleNoteUpdate = (id: string, updates: Partial<StickyNoteData>) => {
    setNotes(prev => {
      const updated = prev.map(note => 
        note.id === id ? { ...note, ...updates } : note
      );
      toast({
        title: language === 'pt' ? "Nota atualizada" : "Note updated",
        description: language === 'pt' 
          ? "Alterações salvas com sucesso!"
          : "Changes saved successfully!",
      });
      return updated;
    });
  };

  const handleNoteDelete = (id: string) => {
    setNotes(prev => {
      const updated = prev.filter(note => note.id !== id);
      toast({
        title: language === 'pt' ? "Nota excluída" : "Note deleted",
        description: language === 'pt' 
          ? "Nota removida com sucesso!"
          : "Note removed successfully!",
        duration: 3000,
      });
      return updated;
    });
  };

  const handleClearAll = () => {
    setNotes([]);
    setCategories([]);
    StickyNotesStorage.clearAll();
  };

  const handleCategoryCreate = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleCategoryDelete = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    // Remove category from notes
    setNotes(prev => prev.map(note => 
      note.category?.id === categoryId 
        ? { ...note, category: undefined }
        : note
    ));
  };

  const handleCreateNoteShortcut = (type: NoteType) => {
    const newNote: StickyNoteData = {
      id: Date.now().toString(),
      type,
      title: '',
      content: '',
      items: type === 'list' ? [''] : undefined,
      color: '#FFF59D',
      position: { x: 100, y: 100 },
      createdAt: new Date()
    };
    setNotes(prev => [...prev, newNote]);
          toast({
            title: language === 'pt' ? "Nova nota criada" : "New note created",
            description: language === 'pt' 
              ? `${type === 'list' ? 'Lista' : 'Nota'} criada! Clique nela para editar.`
              : `${type === 'list' ? 'List' : 'Note'} created! Click it to edit.`,
            duration: 2500,
          });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onCreateNote={handleCreateNoteShortcut}
        onToggleTheme={toggleTheme}
        onSearch={() => {
          // Focus search input if available
          const searchInput = document.querySelector('input[placeholder*="earch"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }}
      />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 shadow-lg border-b border-border backdrop-blur-md bg-gradient-header">
        <div className="container max-w-6xl mx-auto px-2 py-2 min-h-[56px]">
          <div className="flex justify-between items-center">
            {/* Left side controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-foreground hover:text-foreground/80 dark:text-black dark:hover:text-black"
              >
                <ArrowLeft className="w-4 h-4 dark:text-black" />
                <span className="dark:text-black">{language === 'pt' ? 'Voltar' : 'Back'}</span>
              </Button>
              <LanguageSwitch />
              <ThemeToggle />
              <HelpModal />
              <OfflineStatus />
            </div>
            
            {/* Center - App Brand */}
            <div className="hidden sm:flex items-center gap-3">
              <QuickListLogo size="md" showText={true} className="text-foreground" />
              <span className="text-sm text-muted-foreground dark:text-black">
                {language === 'pt' ? 'Notas Adesivas' : 'Sticky Notes'}
              </span>
            </div>

            {/* Right side - Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-black">
              <span>
                {notes.length} {language === 'pt' ? 'notas' : 'notes'}
              </span>
              {categories.length > 0 && (
                <span>
                  • {categories.length} {language === 'pt' ? 'categorias' : 'categories'}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <StickyNotesBoard
          notes={notes}
          onNoteSave={handleNoteSave}
          onNoteUpdate={handleNoteUpdate}
          onNoteDelete={handleNoteDelete}
          onClearAll={handleClearAll}
          categories={categories}
          onCategoryCreate={handleCategoryCreate}
          onCategoryDelete={handleCategoryDelete}
        />
      </div>

      {/* Floating Action Button */}
      <FloatingStickyButton
        onCreateNote={(type) => {
          // Create note directly without navigation
          const newNote: StickyNoteData = {
            id: Date.now().toString(),
            type,
            title: '',
            content: '',
            items: type === 'list' ? [''] : undefined,
            color: '#FFF59D', // Default yellow
            position: { x: 100, y: 100 },
            createdAt: new Date()
          };
          setNotes(prev => [...prev, newNote]);
          toast({
            title: language === 'pt' ? "Nova nota criada" : "New note created",
            description: language === 'pt' 
              ? `${type === 'list' ? 'Lista' : 'Nota'} adicionada! Clique nela para editar.`
              : `${type === 'list' ? 'List' : 'Note'} added! Click it to edit.`,
            duration: 2500,
          });
        }}
        disabled={false}
      />
    </div>
  );
};