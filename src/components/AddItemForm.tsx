
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CategoryManager, Category } from '@/components/CategoryManager';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus } from 'lucide-react';

interface AddItemFormProps {
  onAdd: (text: string, categories?: string[]) => void;
  categories?: Category[];
  onCategoryCreate?: (category: Omit<Category, 'id'>) => void;
  onCategoryDelete?: (categoryId: string) => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ 
  onAdd, 
  categories = [],
  onCategoryCreate,
  onCategoryDelete
}) => {
  const [text, setText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), selectedCategories);
      setText('');
      setSelectedCategories([]);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <Card className="p-4 bg-gradient-notepad shadow-notepad border-0">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 bg-background/80 border-border/50 focus:border-primary transition-all duration-200"
          />
          <Button 
            type="submit" 
            variant="notepad"
            size="sm"
            className="px-4"
            disabled={!text.trim()}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('addItem')}</span>
          </Button>
        </div>
        
        {(categories.length > 0 || onCategoryCreate) && (
          <CategoryManager
            categories={categories}
            selectedCategories={selectedCategories}
            onCategorySelect={handleCategorySelect}
            onCategoryCreate={onCategoryCreate || (() => {})}
            onCategoryDelete={onCategoryDelete || (() => {})}
          />
        )}
      </form>
    </Card>
  );
};
