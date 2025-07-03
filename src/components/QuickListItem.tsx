import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, X, Trash2 } from 'lucide-react';

interface QuickListItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  color: string;
}

export const QuickListItem: React.FC<QuickListItemProps> = ({
  id,
  text,
  completed,
  onToggle,
  onDelete,
  color
}) => {
  const { t } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(id);
    }, 200);
  };

  return (
    <Card 
      className={`p-4 transition-all duration-300 hover:shadow-notepad border-l-4 ${color} ${
        isDeleting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      } ${completed ? 'opacity-70' : 'opacity-100'}`}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggle(id)}
          className={`h-8 w-8 p-0 rounded-full transition-all duration-200 ${
            completed 
              ? 'bg-primary text-primary-foreground hover:bg-primary/80' 
              : 'bg-muted hover:bg-primary hover:text-primary-foreground'
          }`}
          title={completed ? t('markIncomplete') : t('markComplete')}
        >
          <Check className="h-4 w-4" />
        </Button>
        
        <span 
          className={`flex-1 transition-all duration-200 ${
            completed ? 'line-through text-muted-foreground' : 'text-foreground'
          }`}
        >
          {text}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-8 w-8 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-full transition-all duration-200"
          title={t('deleteItem')}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};