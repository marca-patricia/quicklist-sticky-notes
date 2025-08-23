
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
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90 text-primary-foreground border-none"
      aria-label={t('addNewList')}
    >
      <Plus className="h-6 w-6" strokeWidth={2.5} />
    </Button>
  );
};
