
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette, Check } from 'lucide-react';
import { pastelColors } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange, className = "w-10 h-10" }) => {
  const { t } = useLanguage();
  
  const handleColorSelect = (color: string) => {
    console.log('ColorPicker: Selecting color', color);
    onColorChange(color);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`p-0 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 shadow-sm hover:shadow-md transition-all ${className}`}
          style={{ 
            backgroundColor: selectedColor,
            minWidth: className.includes('w-') ? undefined : '40px',
            minHeight: className.includes('h-') ? undefined : '40px'
          }}
          aria-label={t('chooseColor')}
        >
          <Palette className="w-3 h-3 text-gray-800 drop-shadow-sm" strokeWidth={2.5} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        <div className="grid grid-cols-4 gap-3">
          {pastelColors.map((color) => (
            <button
              key={color.name}
              className="w-14 h-14 rounded-xl border-3 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400 transition-all relative shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorSelect(color.value)}
              title={color.name}
              aria-label={`Selecionar cor ${color.name}`}
            >
              {selectedColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="bg-white/90 rounded-full p-1 shadow-lg"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                  >
                    <Check className="w-4 h-4 text-gray-800" strokeWidth={3} />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center font-medium">
          {t('chooseListColor')}
        </p>
      </PopoverContent>
    </Popover>
  );
};
