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

export const StickyNotesPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<StickyNoteData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pendingNoteType, setPendingNoteType] = useState<NoteType | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('quicklist-sticky-notes');
    const savedCategories = localStorage.getItem('quicklist-sticky-categories');
    
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }

    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }
  }, []);

  // Save to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('quicklist-sticky-notes', JSON.stringify(notes));
  }, [notes]);

  // Save to localStorage whenever categories change
  useEffect(() => {
    localStorage.setItem('quicklist-sticky-categories', JSON.stringify(categories));
  }, [categories]);

  const handleNoteSave = (noteData: Omit<StickyNoteData, 'id' | 'createdAt'>) => {
    const newNote: StickyNoteData = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setNotes(prev => [...prev, newNote]);
  };

  const handleNoteUpdate = (id: string, updates: Partial<StickyNoteData>) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ));
  };

  const handleNoteDelete = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
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

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 shadow-lg border-b border-border backdrop-blur-md bg-gradient-header">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Left side controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-foreground hover:text-foreground/80"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <LanguageSwitch />
              <ThemeToggle />
              <OfflineStatus />
            </div>
            
            {/* Center - App Brand */}
            <div className="hidden sm:flex items-center gap-3">
              <QuickListLogo size="md" showText={true} className="text-foreground" />
              <span className="text-sm text-muted-foreground">Sticky Notes</span>
            </div>

            {/* Right side - Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{notes.length} notas</span>
              {categories.length > 0 && (
                <span>• {categories.length} categorias</span>
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
          categories={categories}
          onCategoryCreate={handleCategoryCreate}
          onCategoryDelete={handleCategoryDelete}
        />
      </div>

      {/* Floating Action Button */}
      <FloatingStickyButton
        onCreateNote={(type) => {
          // Trigger creation in the board component
          setPendingNoteType(type);
        }}
        disabled={false}
      />
    </div>
  );
};