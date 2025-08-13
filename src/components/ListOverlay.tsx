import React from 'react';
import { StickyNoteData } from '@/components/StickyNote';
import { X, CheckCircle, Circle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ListOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  note: StickyNoteData;
  onEdit: () => void;
}

export const ListOverlay: React.FC<ListOverlayProps> = ({
  isOpen,
  onClose,
  note,
  onEdit
}) => {
  const { t } = useLanguage();
  
  if (!isOpen || note.type !== 'list') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        className="relative max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden rounded-lg shadow-xl border-2 border-white/20"
        style={{
          backgroundColor: `${note.color}90`, // 90% opacity for transparency
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h2 className="text-xl font-bold text-gray-900">
            {note.title || 'Lista sem título'}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="p-2 hover:bg-white/20 text-gray-900"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-white/20 text-gray-900"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Description */}
          {note.content && (
            <div className="mb-4 p-3 bg-white/20 rounded-lg">
              <p className="text-sm font-medium text-gray-800 mb-1">Descrição:</p>
              <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
            </div>
          )}

          {/* List Items */}
          {note.items && note.items.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Circle className="w-4 h-4" />
                Itens da Lista ({note.items.length}):
              </p>
              {note.items.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Circle className="w-4 h-4 mt-0.5 text-gray-700 flex-shrink-0" />
                  <span className="text-gray-900 flex-1">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Circle className="w-12 h-12 mx-auto text-gray-600 mb-3 opacity-50" />
              <p className="text-gray-700">{t('noItemsYet')}</p>
              <Button
                variant="ghost"
                onClick={onEdit}
                className="mt-3 hover:bg-white/20 text-gray-900"
              >
                <Edit className="w-4 h-4 mr-2" />
                Adicionar itens
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 bg-white/10">
          <div className="flex justify-between items-center text-sm text-gray-800">
            <span>Criado em {new Date(note.createdAt).toLocaleDateString()}</span>
            {note.category && (
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: note.category.color }}
              >
                {note.category.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};