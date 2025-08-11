import { useCallback } from 'react';
import { StickyNoteData } from '@/components/StickyNote';

export const useDuplicateNameCheck = (notes: StickyNoteData[]) => {
  const checkDuplicateName = useCallback((title: string, excludeId?: string): boolean => {
    if (!title.trim()) return false;
    
    return notes.some(note => 
      note.id !== excludeId && 
      note.title?.toLowerCase().trim() === title.toLowerCase().trim()
    );
  }, [notes]);

  const generateUniqueName = useCallback((baseName: string): string => {
    if (!checkDuplicateName(baseName)) return baseName;
    
    let counter = 1;
    let newName = `${baseName} (${counter})`;
    
    while (checkDuplicateName(newName)) {
      counter++;
      newName = `${baseName} (${counter})`;
    }
    
    return newName;
  }, [checkDuplicateName]);

  return {
    checkDuplicateName,
    generateUniqueName
  };
};