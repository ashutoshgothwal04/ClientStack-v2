import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCenter = ({ notifications = [], onMarkAsRead, onDismiss }) => {
  const [filter, setFilter] = useState('all'); // all, urgent, normal

  const defaultNotifications = [
    {
      id: 1,
      type: 'payment_overdue',
      title: 'Payment Overdue',
      message: 'Invoice #INV-2024-0145 from TechCorp Solutions is 5 days overdue',
      timestamp: new Date(Date.now() - 432000000), // 5 days ago
      priority: 'urgent',
      read: false,
      actionRequired: true
    },
    {
      id: 2,
      type: 'deadline_approaching',
      title: 'Project Deadline Approaching',
      message: 'Digital Innovations mobile app project due in 2 days',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      priority: 'urgent',
      read: false,
      actionRequired: true
    },
    {
      id: 3,
      type: 'contract_expiring',
      title: 'Contract Expiring Soon',
      message: 'StartupHub Inc contract expires in 7 days',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      priority: 'normal',
      read: false,
      actionRequired: false
    },
    {
      id: 4,
      type: 'new_inquiry',
      title: 'New Project Inquiry',
      message: 'Potential client interested in e-commerce development',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      priority: 'normal',
      read: true,
      actionRequired: false
    },
    {
      id: 5,
      type: 'milestone_completed',
      title: 'Milestone Completed',
      message: 'Creative Agency branding project Phase 1 completed',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      priority: 'normal',
      read: false,
      actionRequired: false
    }
  ];

  const notificationData = notifications?.length > 0 ? notifications : defaultNotifications;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'payment_overdue': return 'AlertTriangle';
      case 'deadline_approaching': return 'Clock';
      case 'contract_expiring': return 'FileX';
      case 'new_inquiry': return 'Mail';
      case 'milestone_completed': return 'CheckCircle';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'urgent') {
      return 'text-error bg-error/10 border-error/20';
    }
    
    switch (type) {
      case 'payment_overdue': return 'text-error bg-error/10 border-error/20';
      case 'deadline_approaching': return 'text-warning bg-warning/10 border-warning/20';
      case 'contract_expiring': return 'text-warning bg-warning/10 border-warning/20';
      case 'new_inquiry': return 'text-primary bg-primary/10 border-primary/20';
      case 'milestone_completed': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notificationData?.filter(notification => {
    if (filter === 'urgent') return notification?.priority === 'urgent';
    if (filter === 'normal') return notification?.priority === 'normal';
    return true;
  });

  const unreadCount = notificationData?.filter(n => !n?.read)?.length;
  const urgentCount = notificationData?.filter(n => n?.priority === 'urgent' && !n?.read)?.length;

  const handleMarkAsRead = (id) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleDismiss = (id) => {
    if (onDismiss) {
      onDismiss(id);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-card-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-error text-error-foreground rounded-full">
              {unreadCount}
            </span>
          )}
          {urgentCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-warning text-warning-foreground rounded-full">
              {urgentCount} urgent
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground"
          >
            <option value="all">All</option>
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
          </select>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications to show</p>
          </div>
        ) : (
          filteredNotifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`p-4 rounded-lg border transition-smooth ${
                notification?.read ? 'bg-muted/30' : 'bg-card'
              } ${getNotificationColor(notification?.type, notification?.priority)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Icon 
                    name={getNotificationIcon(notification?.type)} 
                    size={20}
                    className={notification?.priority === 'urgent' ? 'text-error' : 'text-current'}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-medium ${
                      notification?.read ? 'text-muted-foreground' : 'text-card-foreground'
                    }`}>
                      {notification?.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatTimestamp(notification?.timestamp)}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-3 ${
                    notification?.read ? 'text-muted-foreground' : 'text-muted-foreground'
                  }`}>
                    {notification?.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {notification?.actionRequired && (
                        <span className="px-2 py-1 text-xs bg-warning/20 text-warning rounded">
                          Action Required
                        </span>
                      )}
                      {notification?.priority === 'urgent' && (
                        <span className="px-2 py-1 text-xs bg-error/20 text-error rounded">
                          Urgent
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!notification?.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification?.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismiss(notification?.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {filteredNotifications?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                filteredNotifications?.forEach(n => {
                  if (!n?.read) handleMarkAsRead(n?.id);
                });
              }}
            >
              Mark All as Read
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              iconPosition="left"
            >
              Notification Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;