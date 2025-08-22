
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useUndo } from '@/hooks/useUndo';
import { useFeedbackToast } from '@/components/FeedbackToast';
import { Check, X, Trash2, Edit3, Tag, GripVertical } from 'lucide-react';
import { NotificationScheduler } from '@/components/NotificationScheduler';

interface QuickListItemProps {
  id: string;
  text: string;
  completed: boolean;
  categories?: string[];
  listId: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  color: string;
}

export const QuickListItem: React.FC<QuickListItemProps> = ({
  id,
  text,
  completed,
  categories = [],
  listId,
  onToggle,
  onDelete,
  color
}) => {
  const { t } = useLanguage();
  const { getListById, updateItemInList } = useLists();
  const { addUndoAction } = useUndo();
  const { showSuccess } = useFeedbackToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const touchStartX = useRef(0);
  const itemRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const list = getListById(listId);
  const itemCategories = categories.map(catId => 
    list?.categories?.find(cat => cat.id === catId)
  ).filter(Boolean);

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = currentX - touchStartX.current;
    
    // Improved mobile drag detection
    if (Math.abs(diffX) > 10) {
      e.preventDefault(); // Prevent scrolling
      
      // Only allow left swipe for delete action
      if (diffX < 0) {
        setSwipeOffset(Math.max(diffX, -100));
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (swipeOffset < -50) {
      // Trigger delete action
      handleDelete();
    } else {
      // Snap back
      setSwipeOffset(0);
    }
  };

  // Mouse handlers for desktop swipe simulation
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    setIsDragging(true);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging) return;
      
      const diffX = moveEvent.clientX - touchStartX.current;
      if (diffX < 0) {
        setSwipeOffset(Math.max(diffX, -100));
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      
      if (swipeOffset < -50) {
        handleDelete();
      } else {
        setSwipeOffset(0);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const itemCopy = { id, text, completed, categories };
    setIsDeleting(true);
    
    setTimeout(() => {
      onDelete(id);
      addUndoAction({
        id: `delete-item-${id}`,
        action: () => showSuccess(t('itemRestored')),
        message: t('itemDeleted')
      });
    }, 200);
    
    setShowDeleteConfirm(false);
  };

  const handleToggle = () => {
    onToggle(id);
    showSuccess(completed ? t('markIncomplete') : t('markComplete'));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(text);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText.trim() !== text) {
      updateItemInList(listId, id, { text: editText.trim() });
      showSuccess(t('itemSaved'));
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Animate swipe offset
  useEffect(() => {
    if (!isDragging && swipeOffset !== 0) {
      const timer = setTimeout(() => {
        setSwipeOffset(0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isDragging, swipeOffset]);

  return (
      <div className="relative overflow-hidden">
        {/* Delete background */}
        <div 
          className={`absolute inset-y-0 right-0 w-20 bg-destructive flex items-center justify-center transition-opacity duration-200 ${
            swipeOffset < -10 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Trash2 className="h-5 w-5 text-destructive-foreground" />
        </div>

        <Card 
          ref={itemRef}
          className={`p-4 transition-smooth hover:shadow-notepad border-l-4 cursor-pointer select-none group animate-slide-in-left ${
            isDeleting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          } ${completed ? 'opacity-70' : 'opacity-100'}`}
          style={{
            borderLeftColor: color,
            transform: `translateX(${swipeOffset}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          {/* Mobile-optimized layout */}
          <div className="space-y-3">
            {/* Top row: Drag handle, Checkbox, and Text */}
            <div className="flex items-start gap-3">
              {/* Drag handle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('dragToReorder')}</p>
                </TooltipContent>
              </Tooltip>

              {/* Checkbox */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle();
                    }}
                    className={`h-8 w-8 p-0 rounded-full transition-all duration-200 flex-shrink-0 ${
                      completed 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/80 scale-110' 
                        : 'bg-muted hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    <Check className={`h-4 w-4 transition-transform duration-200 ${completed ? 'scale-110' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{completed ? t('markIncomplete') : t('markComplete')}</p>
                </TooltipContent>
              </Tooltip>
              
              {/* Text content - takes full available width */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <Input
                    ref={inputRef}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSaveEdit}
                    className="border-primary focus:border-primary text-sm w-full"
                  />
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span 
                        className={`block transition-all duration-200 cursor-pointer text-sm sm:text-base leading-tight break-words ${
                          completed ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}
                        onClick={() => !completed && handleEdit()}
                      >
                        {text}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{!completed ? t('clickToEdit') : ''}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Categories row */}
            {itemCategories && itemCategories.length > 0 && (
              <div className="flex flex-wrap gap-1 ml-14">
                {itemCategories.map(category => (
                  <Badge
                    key={category?.id}
                    variant="secondary"
                    className={`text-xs ${category?.color} text-white`}
                  >
                    <Tag className="w-2 h-2 mr-1" />
                    {category?.name}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Action buttons row - positioned below text on mobile */}
            <div className="flex justify-end gap-2 ml-14">
              {isEditing ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEdit();
                        }}
                        className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700 rounded-full transition-all duration-200"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('save')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelEdit();
                        }}
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('cancel')}</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit();
                        }}
                        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-full transition-all duration-200"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('edit')}</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  {!completed && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div onClick={(e) => e.stopPropagation()}>
                          <NotificationScheduler
                            itemId={id}
                            itemText={text}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('scheduleReminder')}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-full transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('deleteItem')}</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </div>
        </Card>

        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title={t('confirmDeleteItem')}
          description={t('confirmDeleteItemDesc')}
          onConfirm={confirmDelete}
          confirmText={t('deleteItem')}
          variant="destructive"
        />
      </div>
  );
};
