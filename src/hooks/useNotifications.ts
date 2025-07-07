
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: any;
}

export const useNotifications = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const sendNotification = (options: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        data: options.data
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    } else {
      // Fallback to toast notification
      toast({
        title: options.title,
        description: options.body,
        duration: 5000,
      });
    }
  };

  const scheduleReminder = (dueDate: Date, taskText: string, taskId: string) => {
    const now = new Date();
    const timeDiff = dueDate.getTime() - now.getTime();
    
    // Schedule notification 1 hour before due date
    const reminderTime = timeDiff - (60 * 60 * 1000);
    
    if (reminderTime > 0) {
      setTimeout(() => {
        sendNotification({
          title: 'Lembrete de Tarefa',
          body: `Sua tarefa "${taskText}" vence em 1 hora!`,
          tag: `reminder-${taskId}`,
          data: { taskId, type: 'reminder' }
        });
      }, reminderTime);
    }
    
    // Schedule notification at due date
    if (timeDiff > 0) {
      setTimeout(() => {
        sendNotification({
          title: 'Tarefa Vencida',
          body: `Sua tarefa "${taskText}" está vencendo agora!`,
          tag: `due-${taskId}`,
          data: { taskId, type: 'due' }
        });
      }, timeDiff);
    }
  };

  const sendAchievementNotification = (achievementTitle: string, achievementIcon: string) => {
    sendNotification({
      title: '🏆 Nova Conquista Desbloqueada!',
      body: `Parabéns! Você desbloqueou: ${achievementTitle}`,
      tag: 'achievement',
      data: { type: 'achievement' }
    });
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  return {
    sendNotification,
    scheduleReminder,
    sendAchievementNotification,
    requestPermission,
    isSupported: 'Notification' in window,
    hasPermission: 'Notification' in window && Notification.permission === 'granted'
  };
};
