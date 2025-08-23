import { useState } from 'react';

interface UndoAction {
  id: string;
  action: () => void;
  message: string;
}

export function useUndo() {
  const [undoActions, setUndoActions] = useState<UndoAction[]>([]);

  const addUndoAction = (action: UndoAction) => {
    setUndoActions(prev => [...prev, action]);
  };

  const executeUndo = (id: string) => {
    const action = undoActions.find(a => a.id === id);
    if (action) {
      action.action();
      setUndoActions(prev => prev.filter(a => a.id !== id));
    }
  };

  return { addUndoAction, executeUndo, undoActions };
}