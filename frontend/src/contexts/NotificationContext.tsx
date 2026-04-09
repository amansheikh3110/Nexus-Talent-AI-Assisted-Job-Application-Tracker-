import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type NotificationType = 'welcome' | 'app_created' | 'status_change' | 'ai_parse' | 'app_deleted' | 'info' | 'reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number; // ms since epoch
  read: boolean;
  icon?: string;    // material symbol name
  iconFill?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  deleteNotification: () => {},
  clearAll: () => {},
});

const STORAGE_KEY = 'nexus-notifications';
const MAX_NOTIFICATIONS = 50;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...n,
      id: generateId(),
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

// ─── Helper: get icon for notification type ───
export function getNotificationIcon(type: NotificationType): { icon: string; fill: boolean; colorClass: string } {
  switch (type) {
    case 'welcome':
      return { icon: 'waving_hand', fill: true, colorClass: 'bg-secondary/10 text-secondary' };
    case 'app_created':
      return { icon: 'add_circle', fill: true, colorClass: 'bg-primary/10 text-primary' };
    case 'status_change':
      return { icon: 'swap_horiz', fill: false, colorClass: 'bg-tertiary-container/30 text-on-surface-variant' };
    case 'ai_parse':
      return { icon: 'auto_awesome', fill: true, colorClass: 'bg-secondary/10 text-secondary' };
    case 'app_deleted':
      return { icon: 'delete', fill: false, colorClass: 'bg-error-container/30 text-error' };
    case 'reminder':
      return { icon: 'schedule', fill: false, colorClass: 'bg-primary/10 text-primary' };
    case 'info':
    default:
      return { icon: 'info', fill: false, colorClass: 'bg-surface-container-high text-on-surface-variant' };
  }
}

// ─── Helper: time ago formatting ───
export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 10) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
