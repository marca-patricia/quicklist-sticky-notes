import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Circle, Target, Star } from 'lucide-react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  title: string;
  description?: string;
  type?: 'achievements' | 'tasks' | 'default';
  showDetails?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  title,
  description,
  type = 'default',
  showDetails = true
}) => {
  const { t } = useLanguage();
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const getIcon = () => {
    switch (type) {
      case 'achievements':
        return Target;
      case 'tasks':
        return CheckCircle;
      default:
        return Circle;
    }
  };

  const getColorClass = () => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 25) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-muted-foreground';
  };

  const IconComponent = getIcon();

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-full bg-muted ${getColorClass()}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">{title}</h4>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${getColorClass()}`}>
              {percentage}%
            </div>
            {showDetails && (
              <div className="text-xs text-muted-foreground">
                {current}/{total}
              </div>
            )}
          </div>
        </div>
        
        <Progress value={percentage} className="h-2" />
        
        {showDetails && percentage > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <Star className="w-3 h-3 text-yellow-500" />
            <span className="text-xs text-muted-foreground">
              {percentage >= 100 
                ? t('progress.completed') 
                : `${percentage}% ${t('progress.inProgress')}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};