
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Filter, X, Calendar, Clock, CheckCircle, Circle } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showCompleted: boolean;
  onShowCompletedChange: (show: boolean) => void;
  sortBy: 'recent' | 'alphabetical' | 'completed';
  onSortChange: (sort: 'recent' | 'alphabetical' | 'completed') => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  showCompleted,
  onShowCompletedChange,
  sortBy,
  onSortChange
}) => {
  const { t } = useLanguage();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFiltersCount = (showCompleted ? 0 : 1) + (sortBy !== 'recent' ? 1 : 0);

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t('language') === 'pt' ? 'Buscar tarefas...' : 'Search tasks...'}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => onSearchChange('')}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Filter className="w-4 h-4 mr-1" />
            {t('language') === 'pt' ? 'Filtros' : 'Filters'}
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">
                {t('language') === 'pt' ? 'Exibir' : 'Show'}
              </h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={showCompleted ? "default" : "outline"}
                  size="sm"
                  onClick={() => onShowCompletedChange(!showCompleted)}
                  className="text-xs"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {t('language') === 'pt' ? 'Concluídas' : 'Completed'}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                {t('language') === 'pt' ? 'Ordenar por' : 'Sort by'}
              </h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={sortBy === 'recent' ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSortChange('recent')}
                  className="text-xs"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {t('language') === 'pt' ? 'Recentes' : 'Recent'}
                </Button>
                <Button
                  variant={sortBy === 'alphabetical' ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSortChange('alphabetical')}
                  className="text-xs"
                >
                  A-Z
                </Button>
                <Button
                  variant={sortBy === 'completed' ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSortChange('completed')}
                  className="text-xs"
                >
                  <Circle className="w-3 h-3 mr-1" />
                  {t('language') === 'pt' ? 'Status' : 'Status'}
                </Button>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onShowCompletedChange(false);
                  onSortChange('recent');
                  setIsFilterOpen(false);
                }}
                className="w-full"
              >
                <X className="w-3 h-3 mr-1" />
                {t('language') === 'pt' ? 'Limpar Filtros' : 'Clear Filters'}
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
