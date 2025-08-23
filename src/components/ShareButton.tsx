import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFeedbackToast } from '@/components/FeedbackToast';
import { Share2 } from 'lucide-react';
import { TodoList } from '@/contexts/ListsContext';

interface ShareButtonProps {
  list: TodoList;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ list }) => {
  const { t } = useLanguage();
  const { showSuccess } = useFeedbackToast();

  const shareList = async () => {
    try {
      const listText = list.items.map(item => 
        `${item.completed ? '✅' : '⭕'} ${item.text}${item.notes ? ` (${item.notes})` : ''}`
      ).join('\n');
      
      const shareText = `${list.title}:\n\n${listText}`;

      if (navigator.share && navigator.canShare({ text: shareText })) {
        await navigator.share({ text: shareText });
        showSuccess(t('listShared'));
      } else {
        await navigator.clipboard.writeText(shareText);
        showSuccess(t('listShared'));
      }
    } catch (error) {
      console.error('Error sharing list:', error);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={shareList}
      className="text-foreground dark:text-black border-border dark:border-white/20 text-[10px] px-2 py-1 h-6 flex-shrink-0 whitespace-nowrap"
    >
      <Share2 className="w-2 h-2 mr-1 flex-shrink-0" />
      <span className="text-[10px] font-medium">{t('share')}</span>
    </Button>
  );
};