import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Header = ({ onMenuToggle, sidebarExpanded = false }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const notifications = [
    { id: 1, title: 'New project assigned', time: '5 min ago', unread: true },
    { id: 2, title: 'Invoice payment received', time: '1 hour ago', unread: true },
    { id: 3, title: 'Project deadline approaching', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout clicked');
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-60 h-16 bg-card border-b border-border z-200 transition-all duration-300">
      <div className="flex items-center justify-between h-full px-6">
        {/* Mobile Menu Toggle */}
        <div className="flex items-center lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="mr-2"
          >
            <Icon name="Menu" size={20} />
          </Button>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search projects, clients, invoices..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <Icon name="Search" size={20} />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg elevation-3 z-300">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-popover-foreground">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.map((notification) => (
                    <div
                      key={notification?.id}
                      className={`p-4 border-b border-border last:border-b-0 hover:bg-muted transition-smooth cursor-pointer ${notification?.unread ? 'bg-accent/5' : ''
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-popover-foreground">
                            {notification?.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification?.time}
                          </p>
                        </div>
                        {notification?.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={handleUserMenuClick}
              className="flex items-center space-x-2 px-3"
            >
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                JD
              </div>
              <span className="hidden sm:block text-sm font-medium">John Doe</span>
              <Icon name="ChevronDown" size={16} />
            </Button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg elevation-3 z-300">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-popover-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@clientstack.com</p>
                </div>
                <div className="py-2">
                  <NavLink
                    to="/user-profile"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-smooth flex items-center space-x-2"
                  >
                    <Icon name="User" size={16} />
                    <span>Profile</span>
                  </NavLink>

                  <NavLink to="/settings" className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-smooth flex items-center space-x-2" onClick={() => setShowUserMenu(false)}>
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </NavLink>
                  <NavLink to="/help" className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-smooth flex items-center space-x-2" onClick={() => setShowUserMenu(false)}>
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </NavLink>
                </div>
                <div className="py-2 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-sm text-error hover:bg-muted transition-smooth flex items-center space-x-2"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;