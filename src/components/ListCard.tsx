
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TodoList } from '@/contexts/ListsContext';
import { useLists } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ColorPicker } from '@/components/ColorPicker';
import { Trash2, ExternalLink } from 'lucide-react';

interface ListCardProps {
  list: TodoList;
}

export const ListCard: React.FC<ListCardProps> = ({ list }) => {
  const { deleteList, updateList } = useLists();
  const { t } = useLanguage();

  const completedItems = list.items.filter(item => item.completed);
  const progress = list.items.length > 0 ? (completedItems.length / list.items.length) * 100 : 0;

  return (
    <div 
      className="rounded-lg p-4 shadow-soft hover:shadow-notepad transition-all border border-gray-200"
      style={{ backgroundColor: list.color }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg truncate flex-1 text-gray-800">{list.title}</h3>
        <div className="flex items-center gap-2">
          <ColorPicker 
            selectedColor={list.color}
            onColorChange={(color) => updateList(list.id, { color })}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteList(list.id)}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{completedItems.length}/{list.items.length} {t('completed')}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2 transition-all" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Link to={`/list/${list.id}`} className="block">
        <Button variant="outline" className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          {list.title}
        </Button>
      </Link>
    </div>
  );
};
