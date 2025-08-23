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
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          {t('export')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportAsTxt}>
          <FileText className="w-4 h-4 mr-2" />
          {t('exportTxt')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsMarkdown}>
          <File className="w-4 h-4 mr-2" />
          Export Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsJson}>
          <Code className="w-4 h-4 mr-2" />
          {t('exportJson')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};