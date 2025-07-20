
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
    items: ['Beber água', 'Exercitar-se', 'Ler livro', 'Meditar', 'Ligar para família']
  },
  {
    id: 'work',
    icon: Briefcase,
    key: 'workTemplate',
    descKey: 'workDesc',
    items: ['Verificar emails', 'Reunião equipe', 'Relatório mensal', 'Revisar projeto', 'Planejar semana']
  },
  {
    id: 'shopping',
    icon: ShoppingCart,
    key: 'shoppingTemplate',
    descKey: 'shoppingDesc',
    items: ['Pão', 'Leite', 'Ovos', 'Frutas', 'Verduras', 'Carne', 'Arroz']
  },
  {
    id: 'travel',
    icon: Plane,
    key: 'travelTemplate',
    descKey: 'travelDesc',
    items: ['Documentos', 'Passagem', 'Hotel', 'Seguro viagem', 'Medicamentos', 'Roupas']
  },
  {
    id: 'study',
    icon: BookOpen,
    key: 'studyTemplate',
    descKey: 'studyDesc',
    items: ['Ler capítulo 1', 'Fazer exercícios', 'Revisar anotações', 'Preparar apresentação']
  },
  {
    id: 'event',
    icon: Calendar,
    key: 'eventTemplate',
    descKey: 'eventDesc',
    items: ['Local', 'Convidados', 'Decoração', 'Comida', 'Bebidas', 'Música', 'Lembranças']
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
    
    // Add items to the list after a short delay to ensure the list is created
    setTimeout(() => {
      template.items.forEach((item, index) => {
        setTimeout(() => {
          addItemToList(listId, item);
        }, index * 50); // Stagger the item creation
      });
    }, 200);
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <h3 className="font-medium">{t(template.key)}</h3>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="ml-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {t('useTemplate')}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{t(template.descKey)}</p>
                <div className="text-xs text-muted-foreground">
                  {template.items.slice(0, 3).join(', ')}
                  {template.items.length > 3 && '...'}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
