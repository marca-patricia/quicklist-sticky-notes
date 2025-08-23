
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { 
  User, 
  Briefcase, 
  ShoppingCart, 
  Plane, 
  BookOpen, 
  Calendar 
} from 'lucide-react';

interface Template {
  id: string;
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  itemsKey: string;
  color: string;
}

const templates: Template[] = [
  {
    id: 'personal',
    icon: <User className="w-5 h-5" />,
    titleKey: 'personalTemplate',
    descKey: 'personalDesc', 
    itemsKey: 'personalItems',
    color: '#fef3c7'
  },
  {
    id: 'work',
    icon: <Briefcase className="w-5 h-5" />,
    titleKey: 'workTemplate',
    descKey: 'workDesc',
    itemsKey: 'workItems', 
    color: '#e0e7ff'
  },
  {
    id: 'shopping',
    icon: <ShoppingCart className="w-5 h-5" />,
    titleKey: 'shoppingTemplate',
    descKey: 'shoppingDesc',
    itemsKey: 'shoppingItems',
    color: '#dcfce7'
  },
  {
    id: 'travel',
    icon: <Plane className="w-5 h-5" />,
    titleKey: 'travelTemplate', 
    descKey: 'travelDesc',
    itemsKey: 'travelItems',
    color: '#fce7f3'
  },
  {
    id: 'study',
    icon: <BookOpen className="w-5 h-5" />,
    titleKey: 'studyTemplate',
    descKey: 'studyDesc', 
    itemsKey: 'studyItems',
    color: '#fed7d7'
  },
  {
    id: 'event',
    icon: <Calendar className="w-5 h-5" />,
    titleKey: 'eventTemplate',
    descKey: 'eventDesc',
    itemsKey: 'eventItems', 
    color: '#f3e8ff'
  }
];

interface ListTemplatesProps {
  onClose: () => void;
}

export const ListTemplates: React.FC<ListTemplatesProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { addList } = useLists();

  const handleUseTemplate = (template: Template) => {
    const title = t(template.titleKey);
    const items = t(template.itemsKey).split(', ');
    
    addList(title, t(template.descKey), template.color);
    onClose();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('templates')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                {template.icon}
                <CardTitle className="text-base">{t(template.titleKey)}</CardTitle>
              </div>
              <CardDescription className="text-sm">
                {t(template.descKey)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                onClick={() => handleUseTemplate(template)}
                className="w-full"
                size="sm"
              >
                {t('useTemplate')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
