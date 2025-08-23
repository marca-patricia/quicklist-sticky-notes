import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Filter, SortAsc } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showCompleted: boolean;
  onShowCompletedChange: (value: boolean) => void;
  sortBy: 'recent' | 'alphabetical' | 'completed';
  onSortChange: (value: 'recent' | 'alphabetical' | 'completed') => void;
  exportButton?: React.ReactNode;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  showCompleted,
  onShowCompletedChange,
  sortBy,
  onSortChange,
  exportButton,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-white/60 h-4 w-4" />
        <Input
          type="text"
          placeholder={t('searchTasks')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background/80 dark:bg-background/80 border-border dark:border-white/20 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/60"
        />
      </div>

      {/* Compact Filter and Sort Controls - Single Row */}
      <div className="flex gap-1 items-center justify-between w-full overflow-hidden">
        <div className="flex gap-1 items-center flex-shrink-0">
          {/* Show/Hide Completed Toggle - Mais compacto */}
          <Button
            variant={showCompleted ? "default" : "outline"}
            size="sm"
            onClick={() => onShowCompletedChange(!showCompleted)}
            className="text-foreground dark:text-white border-border dark:border-white/20 text-xs px-1.5 py-0.5 h-6 flex-shrink-0 min-w-0"
          >
            <Filter className="w-2.5 h-2.5 mr-0.5" />
            <span className="truncate text-xs">{showCompleted ? 'Ocultar' : 'Mostrar'}</span>
          </Button>

          {/* Sort Dropdown - Mais compacto */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="text-foreground dark:text-white border-border dark:border-white/20 text-xs px-1.5 py-0.5 h-6 flex-shrink-0 min-w-0"
              >
                <SortAsc className="w-2.5 h-2.5 mr-0.5" />
                <span className="truncate text-xs">{t(sortBy)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background dark:bg-background border-border dark:border-white/20">
              <DropdownMenuItem 
                onClick={() => onSortChange('recent')}
                className="text-foreground dark:text-white hover:bg-accent/20 dark:hover:bg-white/10"
              >
                {t('recent')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onSortChange('alphabetical')}
                className="text-foreground dark:text-white hover:bg-accent/20 dark:hover:bg-white/10"
              >
                {t('alphabetical')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onSortChange('completed')}
                className="text-foreground dark:text-white hover:bg-accent/20 dark:hover:bg-white/10"
              >
                {t('completedSort')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Export Button - Integrado na linha */}
          {exportButton && (
            <div className="ml-1">
              {exportButton}
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {(searchTerm || !showCompleted) && (
          <div className="flex gap-1 items-center">
            {searchTerm && (
              <Badge variant="secondary" className="bg-secondary/50 dark:bg-white/10 text-foreground dark:text-white text-xs px-2 py-0.5">
                {t('search')}: "{searchTerm}"
              </Badge>
            )}
            {!showCompleted && (
              <Badge variant="secondary" className="bg-secondary/50 dark:bg-white/10 text-foreground dark:text-white text-xs px-2 py-0.5">
                {t('hideCompleted')}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};