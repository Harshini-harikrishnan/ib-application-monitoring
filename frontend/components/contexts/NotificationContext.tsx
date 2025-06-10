"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification, NotificationContextType, NotificationType } from '@/components/types/notifications';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notification data - in a real app, this would come from your API
const mockNotifications: Omit<Notification, 'id' | 'timestamp'>[] = [
  {
    type: 'ssl-expiry',
    priority: 'critical',
    title: 'SSL Certificate Expiring Soon',
    message: 'SSL certificate for example.com expires in 3 days',
    isRead: false,
    actionUrl: '/monitoring/ssl-expiry',
    metadata: {
      siteUrl: 'example.com',
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      daysUntilExpiry: 3,
      certificateIssuer: 'Let\'s Encrypt'
    }
  },
  {
    type: 'ssl-expiry',
    priority: 'high',
    title: 'SSL Certificate Expiring',
    message: 'SSL certificate for mysite.org expires in 15 days',
    isRead: false,
    actionUrl: '/monitoring/ssl-expiry',
    metadata: {
      siteUrl: 'mysite.org',
      expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      daysUntilExpiry: 15,
      certificateIssuer: 'DigiCert'
    }
  },
  {
    type: 'uptime-alert',
    priority: 'high',
    title: 'Site Downtime Detected',
    message: 'api.example.com has been down for 5 minutes',
    isRead: false,
    actionUrl: '/monitoring/uptime',
    metadata: {
      siteUrl: 'api.example.com'
    }
  },
  {
    type: 'performance',
    priority: 'medium',
    title: 'Slow Response Time',
    message: 'Average response time for shop.example.com increased by 200%',
    isRead: true,
    actionUrl: '/monitoring/performance'
  },
  {
    type: 'maintenance',
    priority: 'low',
    title: 'Scheduled Maintenance',
    message: 'Server maintenance scheduled for this weekend',
    isRead: false,
    actionUrl: '/maintenance'
  }
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initialize with mock data
    const initialNotifications = mockNotifications.map((notif, index) => ({
      ...notif,
      id: `notif-${index + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Random time in last 24 hours
    }));
    setNotifications(initialNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationsByType = (type: NotificationType) => {
    return notifications.filter(notif => notif.type === type);
  };

  const getSslStatus = (): 'good' | 'warning' | 'critical' => {
    const sslNotifications = getNotificationsByType('ssl-expiry');
    const criticalSsl = sslNotifications.find(n => n.priority === 'critical' && !n.isRead);
    const warningSsl = sslNotifications.find(n => n.priority === 'high' && !n.isRead);
    
    if (criticalSsl) return 'critical';
    if (warningSsl) return 'warning';
    return 'good';
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    getNotificationsByType,
    getSslStatus
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}