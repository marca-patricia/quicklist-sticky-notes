import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { HelpCircle, Keyboard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const HelpModal: React.FC = () => {
  const { language } = useLanguage();

  const shortcuts = [
    {
      keys: 'Ctrl/Cmd + N',
      action: language === 'pt' ? 'Criar nova nota' : 'Create new note'
    },
    {
      keys: 'Ctrl/Cmd + L',
      action: language === 'pt' ? 'Criar nova lista' : 'Create new list'
    },
    {
      keys: 'Ctrl/Cmd + T',
      action: language === 'pt' ? 'Criar título' : 'Create title'
    },
    {
      keys: 'Ctrl/Cmd + K',
      action: language === 'pt' ? 'Buscar notas' : 'Search notes'
    },
    {
      keys: 'Ctrl/Cmd + D',
      action: language === 'pt' ? 'Alternar tema escuro' : 'Toggle dark theme'
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-black hover:text-black dark:text-black dark:hover:text-black"
          aria-label={language === 'pt' ? 'Ajuda e atalhos' : 'Help and shortcuts'}
        >
          <HelpCircle className="w-4 h-4 text-black dark:text-black" />
          <span className="text-black dark:text-black">{language === 'pt' ? 'Ajuda' : 'Help'}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background border text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            {language === 'pt' ? 'Atalhos do Teclado' : 'Keyboard Shortcuts'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
              <span className="text-sm text-muted-foreground">{shortcut.action}</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-background border border-border rounded">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
          
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-2">
              {language === 'pt' ? 'Dicas' : 'Tips'}
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>
                • {language === 'pt' 
                  ? 'Clique em qualquer nota para editá-la'
                  : 'Click on any note to edit it'
                }
              </li>
              <li>
                • {language === 'pt' 
                  ? 'Arraste notas para reorganizar'
                  : 'Drag notes to reorganize'
                }
              </li>
              <li>
                • {language === 'pt' 
                  ? 'Use filtros para encontrar notas rapidamente'
                  : 'Use filters to find notes quickly'
                }
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};