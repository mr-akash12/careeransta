import { useState } from "react";
import { Bell, Check, Trash2, User, Calendar, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "interview" | "session" | "system";
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Interview Feedback Ready",
    message: "Your mock interview feedback for Software Engineer role is now available.",
    time: "2 hours ago",
    read: false,
    type: "interview",
  },
  {
    id: "2",
    title: "Session Reminder",
    message: "Your live session with Priya Sharma is scheduled for tomorrow at 4:00 PM.",
    time: "5 hours ago",
    read: false,
    type: "session",
  },
  {
    id: "3",
    title: "New Feature Available",
    message: "Try our new AI-powered resume analysis feature for better interview prep.",
    time: "1 day ago",
    read: true,
    type: "system",
  },
];

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "interview":
        return <Brain className="h-4 w-4 text-primary" />;
      case "session":
        return <Calendar className="h-4 w-4 text-accent" />;
      case "system":
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-primary text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-card border-border" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h4 className="font-display font-semibold text-foreground">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer relative group",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-sm font-medium text-foreground",
                          !notification.read && "font-semibold"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <Bell className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </ScrollArea>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsDropdown;
