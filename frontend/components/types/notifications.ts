export type NotificationType = 'ssl-expiry' | 'uptime-alert' | 'maintenance' | 'security' | 'performance' | 'general';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    siteUrl?: string;
    expiryDate?: Date;
    daysUntilExpiry?: number;
    certificateIssuer?: string;
  };
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  getNotificationsByType: (type: NotificationType) => Notification[];
  getSslStatus: () => 'good' | 'warning' | 'critical';
}