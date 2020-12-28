import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { NotificationDetails } from '../interfaces/notification';
import { WrapperComponent } from '../interfaces/wrapper';
import NotificationService from '../services/NotificationService';
import PushService from '../services/PushService';
import { useAuth } from './AuthProvider';
import { useProfile } from './ProfileProvider';

interface contextType {
  isLoading: boolean,
  failedToLoad: any,
  notifications: Array<NotificationDetails>,
  pushPermission: NotificationPermission,
  getNotifications: () => Promise<void>,
  readNotifications: () => Promise<void>,
  requestNotificationPermission: () => Promise<void>
}

const readNotification = ({ notification, to }: NotificationDetails): NotificationDetails =>
  ({ notification: { ...notification, read: true }, to });

const context = createContext<contextType | null>(null);

export const NotificationProvider: WrapperComponent = ({ children }) => {
  const { token } = useAuth();
  const { profile } = useProfile();

  const [ pushPermission, setPushPermission ] = useState<NotificationPermission>(`default`);
  const [ isLoading, setLoading ] = useState(true);
  const [ failedToLoad, setFailedToLoad ] = useState(null);
  const [ notifications, setNotifications ] = useState<Array<NotificationDetails>>([]);

  const getNotifications = useCallback(async () => {
    if(!token) return;
    
    try {
      setLoading(true);
      setFailedToLoad(null);

      const notifications = await NotificationService.getNotifications(token);

      setNotifications(notifications);
    } catch (err) {
      setFailedToLoad(err);
    } finally {
      setLoading(false);
    }
  }, [ token ]);

  useEffect(() => {
    getNotifications();
  }, [ getNotifications ]);

  const readNotifications = async () => {
    if(!token) return;

    const unreadCount = notifications.filter(({ notification: { read } }) => !read).length;
    if(!unreadCount) return;
    
    try {
      await NotificationService.readNotifications(token);
      setTimeout(() => {
        setNotifications(notifications => notifications.map(readNotification));
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const requestNotificationPermission = useCallback(async () => {
    if(!token) return;

    const permission = await PushService.requestPermission();
    setPushPermission(permission);
  }, [token])

  useEffect(() => {
    profile?.visible && requestNotificationPermission();
  }, [profile, requestNotificationPermission]);

  const contextValue: contextType = {
    isLoading, failedToLoad, notifications, pushPermission,
    getNotifications, readNotifications, requestNotificationPermission
  };

  return <context.Provider value={contextValue}>{children}</context.Provider>;
};

export const useNotification = () => useContext(context)!;
