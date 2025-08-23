import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const useFeedbackToast = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const showSuccess = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      className: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-100',
      action: (
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      ),
      duration: 4000, // 4 seconds for better visibility
    });
  };

  const showError = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      className: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-100',
      action: (
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
      ),
      duration: 6000, // Longer for errors
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      className: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100',
      action: (
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      ),
      duration: 4000,
    });
  };

  return { showSuccess, showError, showInfo };
};