
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Plus, User, Briefcase, ShoppingCart, Plane, BookOpen, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';

const templates = [
  {
    id: 'personal',
    icon: User,
    key: 'personalTemplate',
    descKey: 'personalDesc',
    itemsKey: 'personalItems'
  },
  {
    id: 'work',
    icon: Briefcase,
    key: 'workTemplate',
    descKey: 'workDesc',
    itemsKey: 'workItems'
  },
  {
    id: 'shopping',
    icon: ShoppingCart,
    key: 'shoppingTemplate',
    descKey: 'shoppingDesc',
    itemsKey: 'shoppingItems'
  },
  {
    id: 'travel',
    icon: Plane,
    key: 'travelTemplate',
    descKey: 'travelDesc',
    itemsKey: 'travelItems'
  },
  {
    id: 'study',
    icon: BookOpen,
    key: 'studyTemplate',
    descKey: 'studyDesc',
    itemsKey: 'studyItems'
  },
  {
    id: 'event',
    icon: Calendar,
    key: 'eventTemplate',
    descKey: 'eventDesc',
    itemsKey: 'eventItems'
  }
];

export const ListTemplates: React.FC = () => {
  const { t } = useLanguage();
  const { addList, addItemToList } = useLists();
  const [open, setOpen] = useState(false);

  const handleUseTemplate = (template: typeof templates[0]) => {
    // Create the list first
    const listId = Date.now().toString();
    addList(t(template.key));
    
    // Get translated items and convert to array
    const translatedItems = t(template.itemsKey).split(', ');
    
    // Add items to the list after a short delay to ensure the list is created
    setTimeout(() => {
      translatedItems.forEach((item, index) => {
        setTimeout(() => {
          addItemToList(listId, item.trim());
        }, index * 50); // Stagger the item creation
      });
    }, 200);
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-foreground"
        >
          <FileText className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{t('templates')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {t('templates')}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <h3 className="font-medium text-sm">{t(template.key)}</h3>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="h-8 px-3 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {t('useTemplate')}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{t(template.descKey)}</p>
                <div className="text-xs text-muted-foreground/70 italic">
                  {t(template.itemsKey).split(', ').slice(0, 3).join(', ')}
                  {t(template.itemsKey).split(', ').length > 3 && '...'}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
