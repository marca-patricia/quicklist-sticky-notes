import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, BookOpen, Lightbulb, Target } from 'lucide-react';

interface EnhancedEmptyStateProps {
  type?: 'lists' | 'notes' | 'achievements' | 'statistics';
  onAction?: () => void;
  actionLabel?: string;
}

export const EnhancedEmptyState: React.FC<EnhancedEmptyStateProps> = ({ 
  type = 'lists', 
  onAction,
  actionLabel 
}) => {
  const { t } = useLanguage();

  const getEmptyStateConfig = (type: string) => {
    switch (type) {
      case 'notes':
        return {
          icon: BookOpen,
          title: t('emptyState.notes.title'),
          description: t('emptyState.notes.description'),
          actionText: t('emptyState.notes.action'),
          bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20'
        };
      case 'achievements':
        return {
          icon: Target,
          title: t('emptyState.achievements.title'),
          description: t('emptyState.achievements.description'),
          actionText: t('emptyState.achievements.action'),
          bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20'
        };
      case 'statistics':
        return {
          icon: Lightbulb,
          title: t('emptyState.statistics.title'),
          description: t('emptyState.statistics.description'),
          actionText: t('emptyState.statistics.action'),
          bgGradient: 'from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20'
        };
      default:
        return {
          icon: Plus,
          title: t('emptyState.lists.title'),
          description: t('emptyState.lists.description'),
          actionText: t('emptyState.lists.action'),
          bgGradient: 'from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20'
        };
    }
  };

  const config = getEmptyStateConfig(type);
  const IconComponent = config.icon;

  return (
    <div className="text-center py-16 px-4">
      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${config.bgGradient} mb-6 animate-fade-in`}>
        <IconComponent className="w-12 h-12 text-primary" />
      </div>
      
      <div className="max-w-md mx-auto space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h3 className="text-2xl font-semibold text-foreground">{config.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{config.description}</p>
        
        {onAction && (
          <Button 
            onClick={onAction}
            className="mt-6 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {actionLabel || config.actionText}
          </Button>
        )}
      </div>
    </div>
  );
};