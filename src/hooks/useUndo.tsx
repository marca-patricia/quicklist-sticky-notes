import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface UndoAction {
  id: string;
  action: () => void;
  message: string;
}

export const useUndo = () => {
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  const addUndoAction = useCallback((action: UndoAction) => {
    setUndoStack(prev => [...prev.slice(-4), action]); // Keep only last 5 actions
    
    toast({
      title: action.message,
      description: t('clickToUndo'),
      action: (
        <button
          onClick={() => {
            action.action();
            setUndoStack(prev => prev.filter(a => a.id !== action.id));
            toast({
              title: t('undone'),
            });
          }}
          className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-medium hover:bg-primary/90"
        >
          {t('undo')}
        </button>
      ),
    });
  }, [toast, t]);

  return { addUndoAction };
};