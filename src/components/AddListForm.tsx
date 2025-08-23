
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useLists, pastelColors } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Palette } from 'lucide-react';
import { ColorPicker } from '@/components/ColorPicker';
import { ListTemplates } from '@/components/ListTemplates';

export const AddListForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(pastelColors[0].value);
  const [showTemplates, setShowTemplates] = useState(false);
  const { addList } = useLists();
  const { t } = useLanguage();
  const { toast } = useToast();

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
    <div className="space-y-4">
      {/* Templates Section */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full h-12 border-dashed border-2 hover:bg-muted/50"
          >
            <Palette className="w-4 h-4 mr-2" />
            {t('templates')}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <ListTemplates onClose={() => setShowTemplates(false)} />
        </DialogContent>
      </Dialog>

      {/* Create List Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-card/50 dark:bg-card/80 backdrop-blur-sm rounded-lg shadow-sm border border-border dark:border-border/50" role="form" aria-label={t('createNewListForm')}>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder={t('listPlaceholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-16 text-xl px-4 bg-background dark:bg-input text-foreground dark:text-foreground border-border dark:border-border/50 placeholder:text-muted-foreground rounded-lg"
            aria-label={t('newListName')}
            aria-describedby="list-input-help"
          />
          <div id="list-input-help" className="sr-only">
            {t('pleaseEnterListName')}
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <ColorPicker 
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            className="flex-shrink-0"
            aria-label={t('chooseListColor')}
          />
          <Button 
            type="submit" 
            disabled={!title.trim()}
            className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground border-none font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={title.trim() ? `${t('createList')} "${title.trim()}"` : t('pleaseEnterListName')}
          >
            <Plus 
              className="w-5 h-5 mr-2" 
              aria-hidden="true"
            />
            <span>
              {t('addList')}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};
