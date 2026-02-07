import React from 'react';

import Image from '../../../components/AppImage';

const TopClientsCard = ({ clients = [], loading = false }) => {
  const defaultClients = [
    {
      id: 1,
      name: "TechCorp Solutions",
      avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=face",
      revenue: 45200,
      projects: 8,
      status: "active",
      growth: "+12%"
    },
    {
      id: 2,
      name: "Digital Innovations",
      avatar: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=100&h=100&fit=crop&crop=face",
      revenue: 38900,
      projects: 6,
      status: "active",
      growth: "+8%"
    },
    {
      id: 3,
      name: "StartupHub Inc",
      avatar: "https://images.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg?w=100&h=100&fit=crop&crop=face",
      revenue: 32100,
      projects: 5,
      status: "active",
      growth: "+15%"
    },
    {
      id: 4,
      name: "Creative Agency",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
      revenue: 28700,
      projects: 4,
      status: "on-hold",
      growth: "-2%"
    },
    {
      id: 5,
      name: "E-commerce Plus",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face",
      revenue: 24500,
      projects: 3,
      status: "active",
      growth: "+5%"
    }
  ];

  const clientData = clients?.length > 0 ? clients : defaultClients;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'on-hold': return 'text-warning bg-warning/10';
      case 'prospect': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getGrowthColor = (growth) => {
    if (growth?.startsWith('+')) return 'text-success';
    if (growth?.startsWith('-')) return 'text-error';
    return 'text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 elevation-2">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-32 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5]?.map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
                <div className="h-4 bg-muted rounded w-16"></div>
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
        <h3 className="text-lg font-semibold text-card-foreground">Top Clients</h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-smooth">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {clientData?.map((client, index) => (
          <div key={client?.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative">
                <Image
                  src={client?.avatar}
                  alt={client?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-muted border-2 border-card rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {client?.name}
                  </p>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(client?.status)}`}>
                    {client?.status}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <span>{client?.projects} projects</span>
                  <span className={`font-medium ${getGrowthColor(client?.growth)}`}>
                    {client?.growth}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-card-foreground">
                ${client?.revenue?.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">revenue</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Revenue</span>
          <span className="font-semibold text-card-foreground">
            ${clientData?.reduce((sum, client) => sum + client?.revenue, 0)?.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopClientsCard;