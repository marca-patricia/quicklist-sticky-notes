
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLists, pastelColors } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { ColorPicker } from '@/components/ColorPicker';

export const AddListForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(pastelColors[0].value);
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
    <form onSubmit={handleSubmit} className="flex gap-2" role="form" aria-label="Criar nova lista">
      <Input
        type="text"
        placeholder={t('listPlaceholder')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 bg-gradient-primary border-none text-foreground dark:text-black placeholder:text-muted-foreground dark:placeholder:text-gray-600"
        aria-label="Nome da nova lista"
        aria-describedby="list-input-help"
      />
      <div id="list-input-help" className="sr-only dark:text-black">
        Digite o nome da sua nova lista e clique em adicionar
      </div>
      <ColorPicker 
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        className="flex-shrink-0"
        aria-label="Escolher cor da lista"
      />
      <Button 
        type="submit" 
        disabled={!title.trim()}
        className="bg-gradient-primary text-foreground dark:text-black hover:opacity-90 border-none font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={title.trim() ? `Criar lista "${title.trim()}"` : "Digite um nome para criar a lista"}
      >
        <Plus className="w-4 h-4 mr-2 dark:text-black" aria-hidden="true" />
        <span className="dark:text-black">{t('addList')}</span>
      </Button>
    </form>
  );
};
