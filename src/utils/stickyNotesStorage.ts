import { StickyNoteData } from '@/components/StickyNote';
import { Category } from '@/components/CategoryManager';

const STORAGE_KEYS = {
  NOTES: 'quicklist-sticky-notes-v2',
  CATEGORIES: 'quicklist-sticky-categories-v2',
  BACKUP_NOTES: 'quicklist-sticky-notes-backup',
  BACKUP_CATEGORIES: 'quicklist-sticky-categories-backup',
  LAST_SAVE: 'quicklist-last-save-timestamp'
};

export class StickyNotesStorage {
  private static saveToStorage(key: string, data: any): boolean {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      localStorage.setItem(STORAGE_KEYS.LAST_SAVE, Date.now().toString());
      return true;
    } catch (error) {
      console.error(`Failed to save to ${key}:`, error);
      return false;
    }
  }

  private static loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue;
      
      const parsed = JSON.parse(stored);
      
      // Se são notas, converter as datas
      if (key.includes('notes') && Array.isArray(parsed)) {
        return parsed.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt)
        })) as T;
      }
      
      return parsed;
    } catch (error) {
      console.error(`Failed to load from ${key}:`, error);
      return defaultValue;
    }
  }

  private static createBackup(notes: StickyNoteData[], categories: Category[]): void {
    try {
      this.saveToStorage(STORAGE_KEYS.BACKUP_NOTES, notes);
      this.saveToStorage(STORAGE_KEYS.BACKUP_CATEGORIES, categories);
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  }

  private static restoreFromBackup(): { notes: StickyNoteData[], categories: Category[] } {
    const notes = this.loadFromStorage(STORAGE_KEYS.BACKUP_NOTES, []);
    const categories = this.loadFromStorage(STORAGE_KEYS.BACKUP_CATEGORIES, []);
    return { notes, categories };
  }

  static saveNotes(notes: StickyNoteData[]): boolean {
    const success = this.saveToStorage(STORAGE_KEYS.NOTES, notes);
    if (success && notes.length > 0) {
      // Criar backup apenas se há dados para salvar
      const categories = this.loadCategories();
      this.createBackup(notes, categories);
    }
    return success;
  }

  static loadNotes(): StickyNoteData[] {
    let notes = this.loadFromStorage<StickyNoteData[]>(STORAGE_KEYS.NOTES, []);
    
    // Se não encontrou notas, tentar carregar backup
    if (notes.length === 0) {
      const backup = this.restoreFromBackup();
      notes = backup.notes;
      
      if (notes.length > 0) {
        console.log('Restored notes from backup:', notes.length);
        // Salvar novamente para storage principal
        this.saveToStorage(STORAGE_KEYS.NOTES, notes);
      }
    }
    
    return notes;
  }

  static saveCategories(categories: Category[]): boolean {
    const success = this.saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    if (success) {
      // Criar backup
      const notes = this.loadNotes();
      this.createBackup(notes, categories);
    }
    return success;
  }

  static loadCategories(): Category[] {
    let categories = this.loadFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    
    // Se não encontrou categorias, tentar carregar backup
    if (categories.length === 0) {
      const backup = this.restoreFromBackup();
      categories = backup.categories;
      
      if (categories.length > 0) {
        console.log('Restored categories from backup:', categories.length);
        // Salvar novamente para storage principal
        this.saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
      }
    }
    
    return categories;
  }

  static exportData(): string {
    const notes = this.loadNotes();
    const categories = this.loadCategories();
    const exportData = {
      notes,
      categories,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    return JSON.stringify(exportData, null, 2);
  }

  static importData(jsonData: string): { success: boolean, message: string } {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.notes || !Array.isArray(importData.notes)) {
        return { success: false, message: 'Formato de dados inválido' };
      }

      // Converter datas nas notas importadas
      const notes = importData.notes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt || Date.now())
      }));

      const categories = importData.categories || [];

      // Salvar dados importados
      const notesSuccess = this.saveNotes(notes);
      const categoriesSuccess = this.saveCategories(categories);

      if (notesSuccess && categoriesSuccess) {
        return { 
          success: true, 
          message: `Importados ${notes.length} notas e ${categories.length} categorias com sucesso!` 
        };
      } else {
        return { success: false, message: 'Erro ao salvar dados importados' };
      }
    } catch (error) {
      console.error('Import error:', error);
      return { success: false, message: 'Erro ao processar arquivo de importação' };
    }
  }

  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static getStorageInfo(): { 
    notesCount: number, 
    categoriesCount: number, 
    lastSave: string | null,
    hasBackup: boolean 
  } {
    const notes = this.loadNotes();
    const categories = this.loadCategories();
    const lastSave = localStorage.getItem(STORAGE_KEYS.LAST_SAVE);
    const hasBackup = localStorage.getItem(STORAGE_KEYS.BACKUP_NOTES) !== null;
    
    return {
      notesCount: notes.length,
      categoriesCount: categories.length,
      lastSave: lastSave ? new Date(parseInt(lastSave)).toLocaleString() : null,
      hasBackup
    };
  }
}