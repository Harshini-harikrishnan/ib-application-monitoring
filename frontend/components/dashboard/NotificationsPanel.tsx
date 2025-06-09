"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "critical",
    message: "US East Server is down. Response time exceeded threshold.",
    timestamp: "5 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    message: "SSL certificate for api.example.com expires in 15 days.",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    message: "Scheduled maintenance completed for database servers.",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "critical",
    message: "Memory usage for Asia Pacific server at 95%.",
    timestamp: "4 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "warning",
    message: "Latency increase detected for EU West Server.",
    timestamp: "Yesterday",
    read: true,
  },
  {
    id: 6,
    type: "info",
    message: "New performance report available for download.",
    timestamp: "2 days ago",
    read: true,
  },
];

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true }
        : notification
    ));
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Notifications</CardTitle>
          <Badge>{notifications.filter(n => !n.read).length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "flex justify-between items-start p-3 rounded-lg border",
                  notification.read ? "bg-background" : "bg-accent",
                  !notification.read && "border-primary/20"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        notification.type === "critical" && "text-red-500 border-red-200 bg-red-50 dark:bg-red-950/20",
                        notification.type === "warning" && "text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/20",
                        notification.type === "info" && "text-blue-500 border-blue-200 bg-blue-50 dark:bg-blue-950/20"
                      )}
                    >
                      {notification.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    )}
                  </div>
                  <p className="text-sm">{notification.message}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(notification.id);
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}