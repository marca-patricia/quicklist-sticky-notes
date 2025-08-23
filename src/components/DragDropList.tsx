import React, { useState, useRef } from 'react';
import { ListItem } from '@/contexts/ListsContext';
import { QuickListItem } from '@/components/QuickListItem';

interface DragDropListProps {
  items: ListItem[];
  listId: string;
  listColor: string;
  onToggleItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onReorderItems?: (dragIndex: number, hoverIndex: number) => void;
}

export const DragDropList: React.FC<DragDropListProps> = ({
  items,
  listId,
  listColor,
  onToggleItem,
  onDeleteItem,
  onReorderItems
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the container, not just moving between children
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex && onReorderItems) {
      onReorderItems(draggedIndex, dropIndex);
    }
    
    // Reset drag state
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`transition-all duration-200 ${
            dragOverIndex === index && draggedIndex !== index
              ? 'transform translate-y-1 scale-105'
              : ''
          } ${
            draggedIndex === index 
              ? 'opacity-50' 
              : ''
          }`}
        >
          <QuickListItem
            id={item.id}
            text={item.text}
            completed={item.completed}
            categories={item.categories}
            listId={listId}
            color={listColor}
            onToggle={onToggleItem}
            onDelete={onDeleteItem}
          />
        </div>
      ))}
    </div>
  );
};