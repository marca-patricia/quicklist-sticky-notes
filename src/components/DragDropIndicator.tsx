import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DragDropIndicatorProps {
  isDragActive: boolean;
  position?: { x: number; y: number };
}

export const DragDropIndicator: React.FC<DragDropIndicatorProps> = ({
  isDragActive,
  position
}) => {
  const { language } = useLanguage();

  if (!isDragActive) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 pointer-events-none">
      <div className="flex items-center justify-center h-full">
        <div className="bg-white dark:bg-black border-2 border-dashed border-primary rounded-lg p-4 text-center shadow-lg">
          <p className="text-primary font-medium">
            {language === 'pt' ? 'Solte aqui para posicionar' : 'Drop here to position'}
          </p>
        </div>
      </div>
      
      {position && (
        <div
          className="absolute w-4 h-4 bg-primary rounded-full shadow-lg pointer-events-none"
          style={{
            left: position.x - 8,
            top: position.y - 8,
            transition: 'all 0.1s ease-out'
          }}
        />
      )}
    </div>
  );
};