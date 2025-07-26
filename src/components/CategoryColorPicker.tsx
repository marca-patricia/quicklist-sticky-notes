import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const categoryColors = [
  { name: 'Vermelho', value: '#ef4444', class: 'bg-red-500' },
  { name: 'Laranja', value: '#f97316', class: 'bg-orange-500' },
  { name: 'Amarelo', value: '#eab308', class: 'bg-yellow-500' },
  { name: 'Verde', value: '#22c55e', class: 'bg-green-500' },
  { name: 'Azul', value: '#3b82f6', class: 'bg-blue-500' },
  { name: 'Índigo', value: '#6366f1', class: 'bg-indigo-500' },
  { name: 'Roxo', value: '#a855f7', class: 'bg-purple-500' },
  { name: 'Rosa', value: '#ec4899', class: 'bg-pink-500' },
  { name: 'Cinza', value: '#6b7280', class: 'bg-gray-500' },
  { name: 'Marrom', value: '#a3720e', class: 'bg-yellow-700' },
  { name: 'Ciano', value: '#06b6d4', class: 'bg-cyan-500' },
  { name: 'Lima', value: '#84cc16', class: 'bg-lime-500' },
];

interface CategoryColorPickerProps {
  selectedColor?: string;
  onColorSelect: (color: string) => void;
  children?: React.ReactNode;
}

export const CategoryColorPicker: React.FC<CategoryColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  children
}) => {
  const { t } = useLanguage();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="w-10 h-10 p-0">
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: selectedColor || '#6b7280' }}
            />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="grid grid-cols-6 gap-2">
          {categoryColors.map((color) => (
            <Button
              key={color.value}
              variant="ghost"
              size="sm"
              onClick={() => onColorSelect(color.value)}
              className="w-10 h-10 p-0 hover:scale-110 transition-transform"
              title={color.name}
            >
              <div 
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedColor === color.value 
                    ? 'border-foreground scale-110' 
                    : 'border-white'
                } shadow-sm transition-all`}
                style={{ backgroundColor: color.value }}
              />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};