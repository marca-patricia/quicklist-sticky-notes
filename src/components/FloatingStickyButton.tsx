import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, StickyNote as StickyNoteIcon, FileText, List, Tag, X } from 'lucide-react';
import { NoteType } from '@/components/StickyNote';

interface FloatingStickyButtonProps {
  onCreateNote: (type: NoteType) => void;
  disabled?: boolean;
}

const noteTypes: { type: NoteType; icon: React.ComponentType<any>; label: string; color: string }[] = [
  { type: 'content', icon: StickyNoteIcon, label: 'Nota', color: 'bg-note-yellow' },
  { type: 'title', icon: FileText, label: 'Título', color: 'bg-note-blue' },
  { type: 'list', icon: List, label: 'Lista', color: 'bg-note-green' },
  { type: 'category', icon: Tag, label: 'Categoria', color: 'bg-note-pink' }
];

export const FloatingStickyButton: React.FC<FloatingStickyButtonProps> = ({
  onCreateNote,
  disabled = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCreateNote = (type: NoteType) => {
    onCreateNote(type);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Note Type Options */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-2 animate-scale-in">
          {noteTypes.map(({ type, icon: Icon, label, color }) => (
            <Button
              key={type}
              onClick={() => handleCreateNote(type)}
              className={`w-12 h-12 rounded-full shadow-notepad hover:scale-110 transition-all ${color} text-note-text border-2 border-white/20`}
              disabled={disabled}
              title={`Criar ${label}`}
            >
              <Icon className="w-5 h-5" />
            </Button>
          ))}
        </div>
      )}

      {/* Main Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full shadow-notepad hover:scale-110 transition-all bg-primary text-primary-foreground border-2 border-white/20 ${
          isExpanded ? 'rotate-45' : ''
        }`}
        disabled={disabled}
        title={isExpanded ? 'Fechar menu' : 'Criar nota'}
      >
        {isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </Button>

      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};