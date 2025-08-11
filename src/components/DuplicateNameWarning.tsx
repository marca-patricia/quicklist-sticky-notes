import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DuplicateNameWarningProps {
  show: boolean;
  suggestedName?: string;
  onAcceptSuggestion?: (name: string) => void;
}

export const DuplicateNameWarning: React.FC<DuplicateNameWarningProps> = ({
  show,
  suggestedName,
  onAcceptSuggestion
}) => {
  const { language } = useLanguage();

  if (!show) return null;

  return (
    <Alert className="mb-2 border-amber-500 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-700">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        <div className="space-y-2">
          <p className="text-sm">
            {language === 'pt' 
              ? 'Já existe uma nota com este nome.'
              : 'A note with this name already exists.'
            }
          </p>
          {suggestedName && onAcceptSuggestion && (
            <div className="flex gap-2 items-center">
              <span className="text-xs">
                {language === 'pt' ? 'Sugestão:' : 'Suggestion:'}
              </span>
              <button
                onClick={() => onAcceptSuggestion(suggestedName)}
                className="text-xs bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors"
              >
                {suggestedName}
              </button>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};