
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, X, Hash, Briefcase, Home, Heart, Zap } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface CategoryManagerProps {
  categories: Category[];
  selectedCategories: string[];
  onCategorySelect: (categoryId: string) => void;
  onCategoryCreate: (category: Omit<Category, 'id'>) => void;
  onCategoryDelete: (categoryId: string) => void;
}

const defaultCategories: Omit<Category, 'id'>[] = [
  { name: 'Trabalho', color: 'bg-blue-500', icon: 'Briefcase' },
  { name: 'Pessoal', color: 'bg-green-500', icon: 'Home' },
  { name: 'Urgente', color: 'bg-red-500', icon: 'Zap' },
  { name: 'Importante', color: 'bg-foreground', icon: 'Heart' },
];

const iconMap = {
  Briefcase, Home, Heart, Zap, Hash
};

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  selectedCategories,
  onCategorySelect,
  onCategoryCreate,
  onCategoryDelete
}) => {
  const { t } = useLanguage();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-foreground', 'bg-orange-500', 'bg-pink-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      onCategoryCreate({
        name: newCategoryName.trim(),
        color: randomColor,
        icon: 'Hash'
      });
      
      setNewCategoryName('');
      setIsCreating(false);
    }
  };

  const createDefaultCategories = () => {
    defaultCategories.forEach(category => {
      if (!categories.some(c => c.name === category.name)) {
        onCategoryCreate(category);
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Hash;
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <Badge
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                isSelected ? `${category.color} text-white` : 'hover:bg-secondary'
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <IconComponent className="w-3 h-3 mr-1" />
              {category.name}
              {isSelected && (
                <X 
                  className="w-3 h-3 ml-1 hover:bg-black/20 rounded-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryDelete(category.id);
                  }}
                />
              )}
            </Badge>
          );
        })}
        
        <Popover>
          <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 px-2">
                <Plus className="w-3 h-3 mr-1" />
                {t('language') === 'pt' ? 'Nova Categoria' : 'New Category'}
              </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder={t('language') === 'pt' ? 'Nome da categoria' : 'Category name'}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
                />
                <Button size="sm" onClick={handleCreateCategory} disabled={!newCategoryName.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {categories.length === 0 && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('startWithDefaultCategories')}
                  </p>
                  <Button variant="outline" size="sm" onClick={createDefaultCategories}>
                    {t('language') === 'pt' ? 'Criar Categorias Padrão' : 'Create Default Categories'}
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
