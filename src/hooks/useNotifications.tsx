
import React from 'react';

export const useNotifications = () => {
  const [hasPermission, setHasPermission] = React.useState(
    'Notification' in window && Notification.permission === 'granted'
  );

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === 'granted');
      return permission === 'granted';
    }
    return false;
  };

  return {
    hasPermission,
    requestPermission
  };
};
