import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AutoSaveOptions {
  data: any;
  key: string;
  delay?: number;
}

export const useAutoSave = ({ data, key, delay = 2000 }: AutoSaveOptions) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setHasUnsavedChanges(true);
    
    const timer = setTimeout(() => {
      setIsSaving(true);
      
      try {
        localStorage.setItem(key, JSON.stringify(data));
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        
        // Show subtle save confirmation
        toast({
          title: "Salvo automaticamente",
          description: "Suas alterações foram salvas",
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as alterações",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [data, key, delay, toast]);

  return {
    lastSaved,
    hasUnsavedChanges,
    isSaving,
  };
};