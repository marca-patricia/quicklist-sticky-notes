import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ClearAllNotesButtonProps {
  onClearAll: () => void;
  notesCount: number;
}

export const ClearAllNotesButton: React.FC<ClearAllNotesButtonProps> = ({
  onClearAll,
  notesCount
}) => {
  const { language, t } = useLanguage();

  const handleClearAll = () => {
    onClearAll();
    toast({
      title: language === 'pt' ? "Notas excluídas" : "Notes deleted",
      description: language === 'pt' 
        ? `${notesCount} notas foram removidas` 
        : `${notesCount} notes were removed`,
      duration: 3000,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
          disabled={notesCount === 0}
        >
          <Trash2 className="w-4 h-4" />
          {language === 'pt' ? 'Limpar Tudo' : 'Clear All'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-background border text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('deleteAllNotes')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === 'pt' 
              ? `Esta ação não pode ser desfeita. Todas as ${notesCount} notas serão removidas permanentemente.`
              : `This action cannot be undone. All ${notesCount} notes will be permanently deleted.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {language === 'pt' ? 'Cancelar' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleClearAll}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {language === 'pt' ? 'Excluir Tudo' : 'Delete All'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};