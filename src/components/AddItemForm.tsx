
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CategoryManager, Category } from '@/components/CategoryManager';
import { DatePicker } from '@/components/DatePicker';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, Flag, Settings2 } from 'lucide-react';

interface AddItemFormProps {
  onAdd: (text: string, categories?: string[], dueDate?: Date, priority?: 'low' | 'medium' | 'high') => void;
  categories?: Category[];
  onCategoryCreate?: (category: Omit<Category, 'id'>) => void;
  onCategoryDelete?: (categoryId: string) => void;
  listColor?: string;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ 
  onAdd, 
  categories = [],
  onCategoryCreate,
  onCategoryDelete,
  listColor
}) => {
  const [text, setText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), selectedCategories, dueDate, priority);
      setText('');
      setSelectedCategories([]);
      setDueDate(undefined);
      setPriority('medium');
      setShowAdvanced(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const priorityColors = {
    low: 'text-blue-600 hover:bg-blue-50',
    medium: 'text-orange-600 hover:bg-orange-50',
    high: 'text-red-600 hover:bg-red-50'
  };

  const priorityLabels = {
    low: t('language') === 'pt' ? 'Baixa' : 'Low',
    medium: t('language') === 'pt' ? 'Média' : 'Medium',
    high: t('language') === 'pt' ? 'Alta' : 'High'
  };

  // Function to create a darker shade of the list color
  const getDarkerColor = (color: string) => {
    if (!color) return 'rgba(255, 255, 255, 0.8)';
    
    // Extract HSL values from the color string
    const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (hslMatch) {
      const [, hue, saturation, lightness] = hslMatch;
      // Decrease lightness by 8% to make it slightly darker
      const newLightness = Math.max(parseInt(lightness) - 8, 5);
      return `hsl(${hue}, ${saturation}%, ${newLightness}%)`;
    }
    
    return color;
  };

  const cardStyle = listColor ? {
    backgroundColor: getDarkerColor(listColor),
    border: 'none'
  } : {};

  // Create button styles that match the list color theme
  const getButtonStyle = (isSubmit = false) => {
    if (!listColor) return {};
    
    // For submit button, use the same color as the list color but slightly darker
    if (isSubmit) {
      return {
        backgroundColor: getDarkerColor(listColor),
        borderColor: getDarkerColor(listColor),
        color: '#374151' // dark gray text for better readability
      };
    }
    
    // For settings button, use subtle styling
    return {
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      borderColor: getDarkerColor(listColor),
      color: '#374151'
    };
  };

  return (
    <Card 
      className="p-4 shadow-notepad transition-all duration-200" 
      style={cardStyle}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 bg-white/70 border-gray-300 focus:border-gray-500 transition-all duration-200 placeholder-gray-500"
          />
          <Button 
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 hover:bg-white/50"
            style={getButtonStyle()}
          >
            <Settings2 className="h-4 w-4" style={{ color: '#374151' }} />
          </Button>
          <Button 
            type="submit" 
            size="sm"
            className="px-4 hover:opacity-90"
            disabled={!text.trim()}
            style={getButtonStyle(true)}
          >
            <Plus className="h-4 w-4" style={{ color: '#374151' }} />
            <span className="hidden sm:inline">{t('addItem')}</span>
          </Button>
        </div>
        
        {showAdvanced && (
          <div className="space-y-3 pt-3 border-t border-border/20">
            <div className="flex flex-wrap gap-2">
              <DatePicker
                date={dueDate}
                onDateChange={setDueDate}
                placeholder={t('language') === 'pt' ? 'Data de vencimento' : 'Due date'}
              />
              
              <div className="flex gap-1 border rounded-md p-1">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPriority(p)}
                    className={`text-xs px-2 h-7 ${priority === p ? priorityColors[p] : 'text-muted-foreground'}`}
                  >
                    <Flag className="w-3 h-3 mr-1" />
                    {priorityLabels[p]}
                  </Button>
                ))}
              </div>
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
          </div>
        )}
      </form>
    </Card>
  );
};
