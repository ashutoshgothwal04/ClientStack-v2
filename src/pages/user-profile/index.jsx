import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import PersonalInformation from './components/PersonalInformation';
import AccountSettings from './components/AccountSettings';
import Preferences from './components/Preferences';
import NotificationSettings from './components/NotificationSettings';
import Security from './components/Security';
import BillingInformation from './components/BillingInformation';
import { supabase, getCurrentUser, getUserProfile } from '../../utils/supabase';
import { toast } from "sonner";

const UserProfile = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Information',
      icon: 'User',
      description: 'Manage your profile and basic information'
    },
    {
      id: 'account',
      label: 'Account Settings',
      icon: 'Settings',
      description: 'Subscription and usage details'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'Sliders',
      description: 'Customize your dashboard and defaults'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      description: 'Control how you receive updates'
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      description: 'Password and authentication settings'
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: 'CreditCard',
      description: 'Payment methods and billing history'
    }
  ];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          const userProfile = await getUserProfile(currentUser?.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();

    // Set up auth state listener
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      } else if (session?.user) {
        setUser(session?.user);
        getUserProfile(session?.user?.id)?.then(setProfile)?.catch(console.error);
      }
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  const handleTabChange = (tabId) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm(
        'You have unsaved changes. Are you sure you want to leave this section?'
      );
      if (!confirmChange) return;
      setHasUnsavedChanges(false);
    }
    setActiveTab(tabId);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setHasUnsavedChanges(false);
  };

  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const renderTabContent = () => {
    const commonProps = {
      user,
      profile,
      onProfileUpdate: handleProfileUpdate,
      onUnsavedChanges: setHasUnsavedChanges
    };

    switch (activeTab) {
      case 'personal':
        return <PersonalInformation {...commonProps} />;
      case 'account':
        return <AccountSettings {...commonProps} />;
      case 'preferences':
        return <Preferences {...commonProps} />;
      case 'notifications':
        return <NotificationSettings {...commonProps} />;
      case 'security':
        return <Security {...commonProps} />;
      case 'billing':
        return <BillingInformation {...commonProps} />;
      default:
        return <PersonalInformation {...commonProps} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar isExpanded={sidebarExpanded} onToggle={handleSidebarToggle} />
        <Header onMenuToggle={handleSidebarToggle} sidebarExpanded={sidebarExpanded} />
        
        <main className="lg:ml-60 pt-16">
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Loading profile...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Profile | ClientStack</title>
        <meta name="description" content="Manage your profile, preferences, and account settings in ClientStack" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Sidebar isExpanded={sidebarExpanded} onToggle={handleSidebarToggle} />
        <Header onMenuToggle={handleSidebarToggle} sidebarExpanded={sidebarExpanded} />
        
        <main className="lg:ml-60 pt-16">
          <div className="p-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="User" size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-card-foreground">Profile Settings</h1>
                  <p className="text-muted-foreground">
                    Manage your account information, preferences, and security settings
                  </p>
                </div>
              </div>
              
              {hasUnsavedChanges && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertTriangle" size={16} className="text-warning" />
                    <span className="text-sm font-medium text-warning">
                      You have unsaved changes. Make sure to save your progress.
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-1 sticky top-24">
                  <nav className="space-y-1">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => handleTabChange(tab?.id)}
                        className={`
                          w-full flex items-start space-x-3 px-3 py-4 rounded-md text-sm font-medium transition-smooth text-left
                          ${activeTab === tab?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-card-foreground hover:bg-muted'
                          }
                        `}
                      >
                        <Icon 
                          name={tab?.icon} 
                          size={18}
                          className={activeTab === tab?.id ? 'text-primary-foreground mt-0.5' : 'text-muted-foreground mt-0.5'}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{tab?.label}</div>
                          <div className={`
                            text-xs mt-1 leading-relaxed
                            ${activeTab === tab?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}
                          `}>
                            {tab?.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-card border border-border rounded-lg">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfile;