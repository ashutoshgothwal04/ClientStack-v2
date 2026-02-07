import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecentActivity = ({ activities = [], loading = false }) => {
  const defaultActivities = [
    {
      id: 1,
      type: 'contract_signed',
      title: 'Contract signed by TechCorp Solutions',
      description: 'Web Development Agreement - $25,000',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      priority: 'high'
    },
    {
      id: 2,
      type: 'payment_received',
      title: 'Payment received from Digital Innovations',
      description: 'Invoice #INV-2024-0156 - $8,500',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      user: {
        name: 'Michael Chen',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face'
      },
      priority: 'medium'
    },
    {
      id: 3,
      type: 'project_completed',
      title: 'Project milestone completed',
      description: 'StartupHub Inc - Mobile App Phase 2',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      user: {
        name: 'Emily Rodriguez',
        avatar: 'https://images.pixabay.com/photo/2016/11/29/09/38/adult-1868750_1280.jpg?w=100&h=100&fit=crop&crop=face'
      },
      priority: 'medium'
    },
    {
      id: 4,
      type: 'client_added',
      title: 'New client onboarded',
      description: 'Creative Agency - Branding Project',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      user: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      priority: 'low'
    },
    {
      id: 5,
      type: 'invoice_sent',
      title: 'Invoice sent to E-commerce Plus',
      description: 'Monthly retainer - $3,200',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      user: {
        name: 'Lisa Wang',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face'
      },
      priority: 'low'
    }
  ];

  const activityData = activities?.length > 0 ? activities : defaultActivities;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'contract_signed': return 'FileCheck';
      case 'payment_received': return 'CreditCard';
      case 'project_completed': return 'CheckCircle';
      case 'client_added': return 'UserPlus';
      case 'invoice_sent': return 'Send';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'contract_signed': return 'text-success bg-success/10';
      case 'payment_received': return 'text-primary bg-primary/10';
      case 'project_completed': return 'text-accent bg-accent/10';
      case 'client_added': return 'text-secondary bg-secondary/10';
      case 'invoice_sent': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error';
      case 'medium': return 'border-l-warning';
      case 'low': return 'border-l-success';
      default: return 'border-l-muted';
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

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 elevation-2">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-40 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5]?.map((i) => (
              <div key={i} className="flex items-start space-x-3 p-3">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-48 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-32 mb-1"></div>
                  <div className="h-3 bg-muted rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Recent Activity</h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-smooth">
          View All
        </button>
      </div>
      <div className="space-y-1">
        {activityData?.map((activity) => (
          <div 
            key={activity?.id} 
            className={`flex items-start space-x-3 p-3 rounded-lg border-l-2 ${getPriorityColor(activity?.priority)} hover:bg-muted/30 transition-smooth`}
          >
            <div className={`p-2 rounded-full ${getActivityColor(activity?.type)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-card-foreground truncate">
                  {activity?.title}
                </p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formatTimestamp(activity?.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2 truncate">
                {activity?.description}
              </p>
              
              <div className="flex items-center space-x-2">
                <Image
                  src={activity?.user?.avatar}
                  alt={activity?.user?.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-xs text-muted-foreground">
                  {activity?.user?.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <button className="w-full text-sm text-primary hover:text-primary/80 transition-smooth py-2">
          Load More Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;