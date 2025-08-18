
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
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!title.trim()) {
      toast({
        description: t('pleaseEnterListName'),
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    try {
      console.log('Creating list with title:', title.trim(), 'color:', selectedColor);
      addList(title.trim(), undefined, selectedColor);
      setTitle('');
      toast({
        description: t('listCreated'),
        duration: 2000,
      });
    } catch (error) {
      console.error('Error creating list:', error);
      toast({
        description: t('errorCreatingList'),
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2" role="form" aria-label={t('createNewListForm')}>
      <Input
        type="text"
        placeholder={t('listPlaceholder')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 bg-gradient-primary border-none"
        style={{
          color: isDark ? '#000000' : undefined,
        }}
        aria-label={t('newListName')}
        aria-describedby="list-input-help"
      />
      <div id="list-input-help" className="sr-only">
        Digite o nome da sua nova lista e clique em adicionar
      </div>
      <ColorPicker 
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        className="flex-shrink-0"
        aria-label={t('chooseListColor')}
      />
      <Button 
        type="submit" 
        disabled={!title.trim()}
        className="bg-gradient-primary hover:opacity-90 border-none font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          color: isDark ? '#000000' : undefined,
        }}
        aria-label={title.trim() ? `Criar lista "${title.trim()}"` : "Digite um nome para criar a lista"}
      >
        <Plus 
          className="w-4 h-4 mr-2" 
          aria-hidden="true" 
          style={{ color: isDark ? '#000000' : undefined }}
        />
        <span style={{ color: isDark ? '#000000' : undefined }}>
          {t('addList')}
        </span>
      </Button>
    </form>
  );
};
