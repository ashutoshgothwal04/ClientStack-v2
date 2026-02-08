import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { toast } from "sonner";

const Sidebar = ({ isExpanded = true, onToggle }) => {
  const location = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      badge: null,
      tooltip: 'Overview and analytics'
    },
    {
      label: 'Projects',
      path: '/project-management',
      icon: 'FolderKanban',
      badge: 3,
      tooltip: 'Manage client projects'
    },
    {
      label: 'Billing',
      path: '/billing-invoices',
      icon: 'Receipt',
      badge: null,
      tooltip: 'Invoices and payments'
    },
    {
      label: 'Clients',
      path: '/clients',
      icon: 'Users',
      badge: null,
      tooltip: 'Client relationship management'
    },
    {
      label: 'Contracts',
      path: '/contracts',
      icon: 'FileText',
      badge: 2,
      tooltip: 'Agreements and documents'
    }
  ];

  const moreMenuItems = [
    {
      label: 'Reports',
      path: '/reports',
      icon: 'BarChart3',
      tooltip: 'Analytics and insights'
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: 'Settings',
      tooltip: 'Application settings'
    },
    {
      label: 'Help',
      path: '/help',
      icon: 'HelpCircle',
      tooltip: 'Support and documentation'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleMoreMenuToggle = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-100 lg:hidden"
          onClick={onToggle}
        />
      )}
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-card border-r border-border z-100 transition-all duration-300
        ${isExpanded ? 'w-60 translate-x-0' : 'w-60 -translate-x-full lg:translate-x-0'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-card-foreground">ClientStack</span>
                <span className="text-xs text-muted-foreground">Professional CRM</span>
              </div>
            </Link>
            
            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`
                  flex items-center justify-between w-full px-3 py-2.5 rounded-md text-sm font-medium transition-smooth group
                  ${isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-card-foreground hover:bg-muted hover:text-card-foreground'
                  }
                `}
                title={item?.tooltip}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={item?.icon} 
                    size={18} 
                    className={isActiveRoute(item?.path) ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-card-foreground'}
                  />
                  <span>{item?.label}</span>
                </div>
                {item?.badge && (
                  <span className={`
                    px-2 py-0.5 text-xs rounded-full font-medium
                    ${isActiveRoute(item?.path)
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-accent text-accent-foreground'
                    }
                  `}>
                    {item?.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={handleMoreMenuToggle}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-md text-sm font-medium text-card-foreground hover:bg-muted transition-smooth group"
              >
                <div className="flex items-center space-x-3">
                  <Icon name="MoreHorizontal" size={18} className="text-muted-foreground group-hover:text-card-foreground" />
                  <span>More</span>
                </div>
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className={`text-muted-foreground transition-transform ${showMoreMenu ? 'rotate-90' : ''}`}
                />
              </button>

              {/* More Menu Dropdown */}
              {showMoreMenu && (
                <div className="mt-2 ml-6 space-y-1 border-l border-border pl-4">
                  {moreMenuItems?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      className={`
                        flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-smooth
                        ${isActiveRoute(item?.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-card-foreground'
                        }
                      `}
                      title={item?.tooltip}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-border">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <Icon name="TrendingUp" size={16} className="text-success-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">Pro Plan</p>
                  <p className="text-xs text-muted-foreground">Active until Dec 2025</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info("Upgrade coming soon! Contact support for early access.")}> 
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;