
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';
import { pastelColors } from '@/contexts/ListsContext';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  className = ''
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`p-0 rounded-full transition-all duration-200 hover:scale-110 ${className}`}
          style={{
            backgroundColor: selectedColor,
            border: '2px solid rgba(0,0,0,0.1)',
            minWidth: '20px',
            minHeight: '20px'
          }}
          aria-label="Escolher cor"
        >
          <Palette className="w-2.5 h-2.5 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="grid grid-cols-4 gap-2">
          {pastelColors.map((color) => (
            <Button
              key={color.value}
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 rounded-full border-2 hover:scale-110 transition-transform"
              style={{
                backgroundColor: color.value,
                borderColor: selectedColor === color.value ? '#000' : 'transparent'
              }}
              onClick={() => {
                onColorChange(color.value);
                setOpen(false);
              }}
              title={color.name}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
