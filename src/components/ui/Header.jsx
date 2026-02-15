import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { supabase } from '../../lib/supabase';

const Header = ({ onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);

  // Dummy notifications (can connect later to DB)
  const notifications = [
    { id: 1, title: 'New project assigned', time: '5 min ago', unread: true },
    { id: 2, title: 'Invoice payment received', time: '1 hour ago', unread: true },
    { id: 3, title: 'Project deadline approaching', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // 🔥 GET CURRENT USER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const userInitial =
    user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    'U';

  const displayName =
    user?.user_metadata?.full_name || user?.email || 'User';

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

        {/* Search */}
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
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">

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

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border last:border-b-0 hover:bg-muted cursor-pointer ${
                        notification.unread ? 'bg-accent/5' : ''
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
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
                {userInitial}
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {displayName}
              </span>
              <Icon name="ChevronDown" size={16} />
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>

                <div className="py-2">
                  <NavLink
                    to="/user-profile"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-3 py-2 text-sm hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="User" size={16} />
                    <span>Profile</span>
                  </NavLink>

                  <NavLink
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full px-3 py-2 text-sm hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </NavLink>
                </div>

                <div className="py-2 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-sm text-error hover:bg-muted flex items-center space-x-2"
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
