
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarDays, Clock, AlertCircle, X } from 'lucide-react';
import { format, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  date,
  onDateChange,
  placeholder
}) => {
  const { t } = useLanguage();
  const locale = t('language') === 'pt' ? ptBR : enUS;

  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return t('language') === 'pt' ? 'Hoje' : 'Today';
    }
    if (isTomorrow(date)) {
      return t('language') === 'pt' ? 'Amanhã' : 'Tomorrow';
    }
    return format(date, 'dd/MM/yyyy', { locale });
  };

  const getDateVariant = (date: Date) => {
    if (isPast(date) && !isToday(date)) {
      return 'destructive';
    }
    if (isToday(date) || isTomorrow(date)) {
      return 'default';
    }
    return 'secondary';
  };

  const getDateIcon = (date: Date) => {
    if (isPast(date) && !isToday(date)) {
      return AlertCircle;
    }
    if (isToday(date)) {
      return Clock;
    }
    return CalendarDays;
  };

  const quickDates = [
    { 
      label: t('language') === 'pt' ? 'Hoje' : 'Today', 
      date: new Date() 
    },
    { 
      label: t('language') === 'pt' ? 'Amanhã' : 'Tomorrow', 
      date: new Date(Date.now() + 24 * 60 * 60 * 1000) 
    },
    { 
      label: t('language') === 'pt' ? 'Próxima semana' : 'Next week', 
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="text-left justify-start">
          {date ? (
            <>
              {React.createElement(getDateIcon(date), { className: "w-4 h-4 mr-2" })}
              {formatDate(date)}
            </>
          ) : (
            <>
              <CalendarDays className="w-4 h-4 mr-2" />
              {placeholder || (t('language') === 'pt' ? 'Adicionar data' : 'Add date')}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex flex-wrap gap-2">
            {quickDates.map((quickDate, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => onDateChange(quickDate.date)}
                className="text-xs"
              >
                {quickDate.label}
              </Button>
            ))}
            {date && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDateChange(undefined)}
                className="text-xs text-destructive hover:text-destructive"
              >
                <X className="w-3 h-3 mr-1" />
                {t('language') === 'pt' ? 'Remover' : 'Remove'}
              </Button>
            )}
          </div>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  );
};

export const DateBadge: React.FC<{ date: Date }> = ({ date }) => {
  const { t } = useLanguage();
  
  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return t('language') === 'pt' ? 'Hoje' : 'Today';
    }
    if (isTomorrow(date)) {
      return t('language') === 'pt' ? 'Amanhã' : 'Tomorrow';
    }
    
    const days = differenceInDays(date, new Date());
    if (days > 0 && days <= 7) {
      return `${days}d`;
    }
    
    return format(date, 'dd/MM');
  };

  const getVariant = (date: Date) => {
    if (isPast(date) && !isToday(date)) {
      return 'destructive';
    }
    if (isToday(date) || isTomorrow(date)) {
      return 'default';
    }
    return 'secondary';
  };

  const getIcon = (date: Date) => {
    if (isPast(date) && !isToday(date)) {
      return AlertCircle;
    }
    if (isToday(date)) {
      return Clock;
    }
    return CalendarDays;
  };

  const Icon = getIcon(date);

  return (
    <Badge variant={getVariant(date)} className="text-xs">
      <Icon className="w-3 h-3 mr-1" />
      {formatDate(date)}
    </Badge>
  );
};
