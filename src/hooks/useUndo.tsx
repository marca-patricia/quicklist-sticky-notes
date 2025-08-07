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
      className: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-100',
      action: (
        <button
          onClick={() => {
            action.action();
            setUndoStack(prev => prev.filter(a => a.id !== action.id));
            toast({
              title: t('undone'),
              className: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100',
            });
          }}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
        >
          {t('undo')}
        </button>
      ),
    });
  }, [toast, t]);

  return { addUndoAction };
};