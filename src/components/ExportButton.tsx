import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFeedbackToast } from '@/components/FeedbackToast';
import { Download, FileText, File, Code } from 'lucide-react';
import { TodoList } from '@/contexts/ListsContext';

interface ExportButtonProps {
  list: TodoList;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ list }) => {
  const { t } = useLanguage();
  const { showSuccess } = useFeedbackToast();

  const exportAsTxt = () => {
    const content = `${list.title}\n${'='.repeat(list.title.length)}\n\n${
      list.description ? `${list.description}\n\n` : ''
    }${list.items.map(item => 
      `${item.completed ? '✅' : '⭕'} ${item.text}${item.notes ? ` (${item.notes})` : ''}`
    ).join('\n')}`;
    
    downloadFile(content, `${list.title}.txt`, 'text/plain');
  };

  const exportAsJson = () => {
    const content = JSON.stringify(list, null, 2);
    downloadFile(content, `${list.title}.json`, 'application/json');
  };

  const exportAsMarkdown = () => {
    const content = `# ${list.title}\n\n${
      list.description ? `${list.description}\n\n` : ''
    }${list.items.map(item => 
      `- [${item.completed ? 'x' : ' '}] ${item.text}${item.notes ? ` _(${item.notes})_` : ''}`
    ).join('\n')}`;
    
    downloadFile(content, `${list.title}.md`, 'text/markdown');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showSuccess(t('exported'));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="text-foreground dark:text-white border-border dark:border-white/20 text-[10px] px-2 py-1 h-6 flex-shrink-0 whitespace-nowrap"
        >
          <Download className="w-2 h-2 mr-1 flex-shrink-0" />
          <span className="text-[10px] font-medium">{t('export')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background dark:bg-background border-border dark:border-white/20">
        <DropdownMenuItem 
          onClick={exportAsTxt}
          className="text-foreground dark:text-white hover:bg-accent/20 dark:hover:bg-white/10"
        >
          <FileText className="w-4 h-4 mr-2" />
          {t('exportTxt')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportAsMarkdown}
          className="text-foreground dark:text-white hover:bg-accent/20 dark:hover:bg-white/10"
        >
          <File className="w-4 h-4 mr-2" />
          Export Markdown
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportAsJson}
          className="text-foreground dark:text-white hover:bg-accent/20 dark:hover:bg-white/10"
        >
          <Code className="w-4 h-4 mr-2" />
          {t('exportJson')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};