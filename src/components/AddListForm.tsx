
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLists } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

export const AddListForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const { addList } = useLists();
  const { t } = useLanguage();
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder={t('listPlaceholder')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 bg-gradient-primary border-none text-gray-800 placeholder:text-gray-600"
      />
      <Button 
        type="submit" 
        disabled={!title.trim()}
        className="bg-gradient-primary text-gray-800 hover:opacity-90 border-none font-semibold"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('addList')}
      </Button>
    </form>
  );
};
