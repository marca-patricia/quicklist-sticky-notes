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

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange, className }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`w-10 h-10 p-0 border-2 ${className}`}
          style={{ backgroundColor: selectedColor }}
        >
          <Palette className="w-4 h-4 text-gray-600" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="grid grid-cols-4 gap-2">
          {pastelColors.map((color) => (
            <button
              key={color.name}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-all relative"
              style={{ backgroundColor: color.value }}
              onClick={() => onColorChange(color.value)}
              title={color.name}
            >
              {selectedColor === color.value && (
                <Check className="w-4 h-4 text-gray-700 absolute inset-0 m-auto" />
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Escolha uma cor para sua lista
        </p>
      </PopoverContent>
    </Popover>
  );
};