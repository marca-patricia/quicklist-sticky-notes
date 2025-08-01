import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, List } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface GridViewToggleProps {
  isGridView: boolean;
  onToggle: (isGrid: boolean) => void;
}

export const GridViewToggle: React.FC<GridViewToggleProps> = ({
  isGridView,
  onToggle
}) => {
  const { t } = useLanguage();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggle(!isGridView)}
          className="flex items-center gap-2"
        >
          {isGridView ? (
            <>
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">{t('listView')}</span>
            </>
          ) : (
            <>
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline">{t('gridView')}</span>
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isGridView ? t('switchToListView') : t('switchToGridView')}</p>
      </TooltipContent>
    </Tooltip>
  );
};