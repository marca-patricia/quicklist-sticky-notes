import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onClick }) => {
  const { t } = useLanguage();

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 floating-button-mobile focus-visible:ring-4 focus-visible:ring-primary/50"
      style={{
        background: 'hsl(var(--floating-button))',
        color: 'hsl(var(--floating-button-text))',
      }}
      aria-label={t('addNewList')}
    >
      <Plus className="h-7 w-7 font-bold" strokeWidth={3} />
    </Button>
  );
};