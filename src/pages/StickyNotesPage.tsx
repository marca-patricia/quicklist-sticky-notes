import React, { useState, useEffect } from 'react';
import { StickyNotesBoard } from '@/components/StickyNotesBoard';
import { StickyNoteData, NoteType } from '@/components/StickyNote';
import { FloatingStickyButton } from '@/components/FloatingStickyButton';
import { Category } from '@/components/CategoryManager';
import { LanguageSwitch } from '@/components/LanguageSwitch';
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
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setNotes(prev => [...prev, newNote]);
  };

  const handleNoteUpdate = (id: string, updatedNote: Partial<StickyNoteData>) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updatedNote } : note
    ));
  };

  const handleNoteDelete = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleCategoryCreate = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: crypto.randomUUID()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleCategoryDelete = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    // Remove category from notes
    setNotes(prev => prev.map(note => 
      note.category?.id === categoryId ? { ...note, category: undefined } : note
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header amarelo claro */}
      <header className="top-bar-yellow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-700 hover:bg-yellow-200/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <QuickListLogo size="sm" />
            <h1 className="text-xl font-bold text-gray-800">Sticky Notes</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-700 text-sm">{notes.length} notas</span>
            <LanguageSwitch />
            <OfflineStatus />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <StickyNotesBoard
          notes={notes}
          onNoteSave={handleNoteSave}
          onNoteUpdate={handleNoteUpdate}
          onNoteDelete={handleNoteDelete}
          categories={categories}
          onCategoryCreate={handleCategoryCreate}
          onCategoryDelete={handleCategoryDelete}
        />
      </main>

      {/* Floating Button */}
      <FloatingStickyButton 
        onCreateNote={setPendingNoteType}
      />
    </div>
  );
};