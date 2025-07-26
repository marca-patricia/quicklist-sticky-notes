import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, Calendar, Clock, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Reminder {
  id: string;
  datetime: string;
  text: string;
}

interface NotificationSchedulerProps {
  itemId: string;
  itemText: string;
  reminders?: Reminder[];
  onAddReminder?: (reminder: Omit<Reminder, 'id'>) => void;
  onRemoveReminder?: (reminderId: string) => void;
}

export const NotificationScheduler: React.FC<NotificationSchedulerProps> = ({
  itemId,
  itemText,
  reminders = [],
  onAddReminder,
  onRemoveReminder
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderText, setReminderText] = useState(itemText);

  const scheduleNotification = async () => {
    if (!reminderDate || !reminderTime) {
      toast({
        title: t('error'),
        description: t('selectDateAndTime'),
        variant: 'destructive'
      });
      return;
    }

    const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
    const now = new Date();

    if (reminderDateTime <= now) {
      toast({
        title: t('error'),
        description: t('selectFutureDateTime'),
        variant: 'destructive'
      });
      return;
    }

    // Request notification permission if not granted
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast({
          title: t('error'),
          description: t('notificationPermissionDenied'),
          variant: 'destructive'
        });
        return;
      }
    }

    const newReminder: Omit<Reminder, 'id'> = {
      datetime: reminderDateTime.toISOString(),
      text: reminderText
    };

    onAddReminder?.(newReminder);

    // Schedule the notification
    const timeUntilReminder = reminderDateTime.getTime() - now.getTime();
    
    if (timeUntilReminder > 0) {
      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('QuickList - Lembrete', {
            body: reminderText,
            icon: '/src/assets/quicklist-icon.png',
            badge: '/src/assets/quicklist-icon.png',
            tag: `reminder-${itemId}-${Date.now()}`
          });
        }
      }, timeUntilReminder);
    }

    toast({
      title: t('reminderScheduled'),
      description: `${t('reminderFor')} ${reminderDateTime.toLocaleString()}`,
    });

    // Reset form
    setReminderDate('');
    setReminderTime('');
    setReminderText(itemText);
    setIsOpen(false);
  };

  const removeReminder = (reminderId: string) => {
    onRemoveReminder?.(reminderId);
    toast({
      title: t('reminderRemoved'),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-full transition-all duration-200"
        >
          <Bell className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {t('scheduleReminder')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Existing reminders */}
          {reminders.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">{t('activeReminders')}:</h4>
              <div className="space-y-2">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground">
                        {new Date(reminder.datetime).toLocaleString()}
                      </div>
                      <div className="text-sm truncate">{reminder.text}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeReminder(reminder.id)}
                      className="h-6 w-6 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add new reminder form */}
          <div className="space-y-3">
            <Input
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
              placeholder={t('reminderText')}
            />
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={scheduleNotification} className="flex-1">
                <Bell className="w-4 h-4 mr-2" />
                {t('scheduleReminder')}
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
