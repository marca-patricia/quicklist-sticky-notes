import { useEffect, useRef } from 'react';
import { StickyNoteData } from '@/components/StickyNote';
import { Category } from '@/components/CategoryManager';
import { StickyNotesStorage } from '@/utils/stickyNotesStorage';

export const useAutoSave = (notes: StickyNoteData[], categories: Category[]) => {
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastSaveRef = useRef<{ notes: string, categories: string }>({
    notes: '',
    categories: ''
  });

  useEffect(() => {
    // Auto-save every 30 seconds
    intervalRef.current = setInterval(() => {
      const notesString = JSON.stringify(notes);
      const categoriesString = JSON.stringify(categories);
      
      // Only save if data has changed
      if (notesString !== lastSaveRef.current.notes) {
        StickyNotesStorage.saveNotes(notes);
        lastSaveRef.current.notes = notesString;
      }
      
      if (categoriesString !== lastSaveRef.current.categories) {
        StickyNotesStorage.saveCategories(categories);
        lastSaveRef.current.categories = categoriesString;
      }
    }, 30000); // 30 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [notes, categories]);

  // Save immediately when component unmounts
  useEffect(() => {
    const handleBeforeUnload = () => {
      StickyNotesStorage.saveNotes(notes);
      StickyNotesStorage.saveCategories(categories);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload(); // Save on cleanup
    };
  }, [notes, categories]);
};