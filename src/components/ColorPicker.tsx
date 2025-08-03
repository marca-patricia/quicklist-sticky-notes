
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette, Check } from 'lucide-react';
import { pastelColors } from '@/contexts/ListsContext';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange, className = "w-10 h-10" }) => {
  const handleColorSelect = (color: string) => {
    onColorChange(color);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`p-0 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 ${className}`}
          style={{ backgroundColor: selectedColor }}
          aria-label="Escolher cor"
        >
          <Palette className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700 drop-shadow-sm" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        <div className="grid grid-cols-4 gap-3">
          {pastelColors.map((color) => (
            <button
              key={color.name}
              className="w-14 h-14 rounded-xl border-3 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 transition-all relative shadow-sm hover:shadow-md transform hover:scale-105"
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorSelect(color.value)}
              title={color.name}
              aria-label={`Selecionar cor ${color.name}`}
            >
              {selectedColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Check className="w-5 h-5 text-gray-800 drop-shadow-lg" strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center font-medium">
          Escolha uma cor para sua lista
        </p>
      </PopoverContent>
    </Popover>
  );
};
