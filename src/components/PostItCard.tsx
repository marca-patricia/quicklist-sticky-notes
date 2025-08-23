
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit3, Check, X, Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TodoList } from '@/contexts/ListsContext';
import { useLists } from '@/contexts/ListsContext';

interface PostItCardProps {
  list: TodoList;
  isGridView?: boolean;
}

const postItColors = [
  '#FFE066', // Yellow
  '#FFB3E6', // Pink
  '#B3E5FF', // Light Blue
  '#B3FFB3', // Light Green
  '#FFD700', // Gold
  '#DDA0DD', // Plum
  '#F0E68C', // Khaki
  '#FFB6C1'  // Light Pink
];

export const PostItCard: React.FC<PostItCardProps> = ({ list, isGridView = false }) => {
  const { t } = useLanguage();
  const { updateList, deleteList } = useLists();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [editDescription, setEditDescription] = useState(list.description || '');
  const [editColor, setEditColor] = useState(list.color);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSave = () => {
    updateList(list.id, {
      title: editTitle,
      description: editDescription,
      color: editColor
    });
    setIsEditing(false);
  };

  const toggleItem = (itemId: string) => {
    const updatedItems = list.items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateList(list.id, { items: updatedItems });
  };

  const getContrastColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  const textColor = getContrastColor(editColor);
  const pendingItems = list.items.filter(item => !item.completed);
  const completedItems = list.items.filter(item => item.completed);

  return (
    <Card 
      className="w-full max-w-xs h-80 p-4 relative transform rotate-1 hover:rotate-0 transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 m-2"
      style={{ 
        backgroundColor: editColor,
        color: textColor,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {/* Post-it shadow effect */}
      <div className="absolute inset-0 bg-black opacity-5 transform translate-x-1 translate-y-1 rounded-lg -z-10"></div>
      
      {/* Header with controls */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-sm font-bold bg-transparent border-none p-0 h-auto focus:ring-0"
              style={{ color: textColor }}
            />
          ) : (
            <h3 className="text-sm font-bold truncate" style={{ color: textColor }}>
              {list.title || t('title')}
            </h3>
          )}
        </div>
        
        <div className="flex gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="h-6 w-6 p-0 hover:bg-white/20"
          >
            <Palette className="w-3 h-3" style={{ color: textColor }} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-6 w-6 p-0 hover:bg-white/20"
          >
            <Edit3 className="w-3 h-3" style={{ color: textColor }} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteList(list.id)}
            className="h-6 w-6 p-0 hover:bg-red-500/20"
          >
            <Trash2 className="w-3 h-3" style={{ color: textColor }} />
          </Button>
        </div>
      </div>

      {/* Color picker */}
      {showColorPicker && (
        <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-10 border">
          <div className="grid grid-cols-4 gap-1 mb-2">
            {postItColors.map((postItColor) => (
              <button
                key={postItColor}
                className="w-6 h-6 rounded border-2 hover:scale-110 transition-transform"
                style={{ 
                  backgroundColor: postItColor,
                  borderColor: editColor === postItColor ? '#333' : '#ccc'
                }}
                onClick={() => {
                  setEditColor(postItColor);
                }}
              />
            ))}
          </div>
          <Button
            size="sm"
            onClick={() => setShowColorPicker(false)}
            className="w-full text-xs"
          >
            {t('save')}
          </Button>
        </div>
      )}

      {/* Content area - Show description if no items, otherwise show todo list */}
      <div className="flex-1 overflow-hidden">
        {list.items.length === 0 ? (
          // Show description for empty lists
          isEditing ? (
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full h-32 bg-transparent border-none resize-none text-xs p-0 focus:ring-0"
              style={{ color: textColor }}
              placeholder={t('description')}
            />
          ) : (
            <p className="text-xs leading-relaxed whitespace-pre-wrap overflow-y-auto h-32" style={{ color: textColor }}>
              {list.description || t('description')}
            </p>
          )
        ) : (
          // Show todo list
          <div className="space-y-2 h-48 overflow-y-auto">
            {/* Pending items */}
            <div>
              <h4 className="text-xs font-semibold mb-1" style={{ color: textColor }}>
                {t('pending')} ({pendingItems.length})
              </h4>
              {pendingItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-4 h-4 rounded-full border-2 hover:bg-white/20 transition-colors"
                    style={{ borderColor: textColor }}
                  />
                  <span className="text-xs flex-1" style={{ color: textColor }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Completed items */}
            {completedItems.length > 0 && (
              <div className="border-t pt-2" style={{ borderColor: `${textColor}40` }}>
                <h4 className="text-xs font-semibold mb-1" style={{ color: textColor }}>
                  {t('completed')} ({completedItems.length})
                </h4>
                {completedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 mb-1 opacity-60">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-4 h-4 rounded-full border-2 bg-green-500 flex items-center justify-center"
                      style={{ borderColor: textColor }}
                    >
                      <Check className="w-2 h-2 text-white" />
                    </button>
                    <span className="text-xs flex-1 line-through" style={{ color: textColor }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save/Cancel buttons when editing */}
      {isEditing && (
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            onClick={handleSave}
            className="flex-1 text-xs bg-green-500 hover:bg-green-600 text-white"
          >
            <Check className="w-3 h-3 mr-1" />
            {t('save')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
            className="flex-1 text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            {t('cancel')}
          </Button>
        </div>
      )}
    </Card>
  );
};
