import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface KeyboardShortcutsProps {
  onCreateNote?: (type: 'content' | 'list' | 'title') => void;
  onSearch?: () => void;
  onToggleTheme?: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onCreateNote,
  onSearch,
  onToggleTheme
}) => {
  const { language } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLElement && event.target.isContentEditable
      ) {
        return;
      }

      // Ctrl/Cmd + N: Create new note
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        onCreateNote?.('content');
      }

      // Ctrl/Cmd + L: Create new list
      if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
        event.preventDefault();
        onCreateNote?.('list');
      }

      // Ctrl/Cmd + T: Create title note
      if ((event.ctrlKey || event.metaKey) && event.key === 't') {
        event.preventDefault();
        onCreateNote?.('title');
      }

      // Ctrl/Cmd + K: Focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        onSearch?.();
      }

      // Ctrl/Cmd + D: Toggle dark mode
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        onToggleTheme?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCreateNote, onSearch, onToggleTheme]);

  return null; // This component doesn't render anything
};

// Hook for easier usage
export const useKeyboardShortcuts = (handlers: KeyboardShortcutsProps) => {
  return <KeyboardShortcuts {...handlers} />;
};