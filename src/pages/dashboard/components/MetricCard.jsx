import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon, 
  trend = null,
  loading = false 
}) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 elevation-2">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-8 w-8 bg-muted rounded"></div>
          </div>
          <div className="h-8 bg-muted rounded w-32 mb-2"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-2 hover:elevation-3 transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name={icon} size={20} className="text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-card-foreground">{value}</p>
        
        {change && (
          <div className="flex items-center space-x-1">
            <Icon 
              name={getChangeIcon()} 
              size={14} 
              className={getChangeColor()} 
            />
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {change}
            </span>
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>
        )}
        
        {trend && (
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${trend}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;