
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AddListForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const { t } = useLanguage();
  const { addList } = useLists();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addList(title.trim());
      setTitle('');
      toast({
        description: t('listCreated'),
        duration: 2000,
      });

      // Disparar evento para mostrar anúncio
      window.dispatchEvent(new CustomEvent('listCreated'));
    }
  };

  return (
    <Card className="p-4 bg-gradient-notepad shadow-notepad border-0">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('listPlaceholder')}
          className="flex-1 bg-background/80 border-border/50 focus:border-primary transition-all duration-200"
        />
        <Button 
          type="submit" 
          variant="notepad"
          size="sm"
          className="px-4"
          disabled={!title.trim()}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">{t('newList')}</span>
        </Button>
      </form>
    </Card>
  );
};
