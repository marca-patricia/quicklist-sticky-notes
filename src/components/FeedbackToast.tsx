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
      className: 'border-green-200 bg-green-50 text-green-800',
      action: (
        <CheckCircle className="h-5 w-5 text-green-600" />
      ),
    });
  };

  const showError = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      className: 'border-red-200 bg-red-50 text-red-800',
      action: (
        <AlertCircle className="h-5 w-5 text-red-600" />
      ),
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      className: 'border-blue-200 bg-blue-50 text-blue-800',
      action: (
        <Info className="h-5 w-5 text-blue-600" />
      ),
    });
  };

  return { showSuccess, showError, showInfo };
};