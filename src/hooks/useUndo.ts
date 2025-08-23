
import { useState, useCallback } from 'react';

interface UndoAction {
  id: string;
  action: () => void;
  message: string;
}

export const useUndo = () => {
  const [undoActions, setUndoActions] = useState<UndoAction[]>([]);

  const addUndoAction = useCallback((action: UndoAction) => {
    setUndoActions(prev => [...prev, action]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setUndoActions(prev => prev.filter(a => a.id !== action.id));
    }, 5000);
  }, []);

  const executeUndo = useCallback((id: string) => {
    const action = undoActions.find(a => a.id === id);
    if (action) {
      action.action();
      setUndoActions(prev => prev.filter(a => a.id !== id));
    }
  }, [undoActions]);

  return {
    undoActions,
    addUndoAction,
    executeUndo
  };
};
