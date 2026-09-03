import React, { createContext, useContext, useState } from 'react';
import { NotificationItem } from '../types';

interface ToastItem {
  id: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ALERT';
  message: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addToast: (type: ToastItem['type'], message: string) => void;
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Round 2 Evaluation Window Open',
    message: 'Mid-evaluation checkpoint has officially commenced. Please keep your prototype demos ready.',
    type: 'ALERT',
    timestamp: '10m ago',
    read: false,
    link: '/team/status',
  },
  {
    id: 'n-2',
    title: 'Group Photo Verification Required',
    message: 'Please ensure your official team group photo is uploaded before Round 2 scoring concludes.',
    type: 'WARNING',
    timestamp: '35m ago',
    read: false,
    link: '/team/upload-photo',
  },
  {
    id: 'n-3',
    title: 'Live Leaderboard Updated',
    message: 'Evaluations for 8 teams in Track AI/ML have been published to the live podium.',
    type: 'SUCCESS',
    timestamp: '1h ago',
    read: true,
    link: '/team/leaderboard',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addToast = (type: ToastItem['type'], message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addToast,
        toasts,
        removeToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
