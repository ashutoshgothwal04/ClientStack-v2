import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../utils/supabase';

const NotificationSettings = ({ user, onUnsavedChanges }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    email: null,
    push: null,
    in_app: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const notificationTypes = [
    {
      id: 'project_updates',
      label: 'Project Updates',
      description: 'Get notified when projects are updated or milestones are reached',
      icon: 'FolderKanban'
    },
    {
      id: 'invoice_reminders',
      label: 'Invoice Reminders',
      description: 'Reminders for overdue invoices and payment notifications',
      icon: 'Receipt'
    },
    {
      id: 'payment_confirmations',
      label: 'Payment Confirmations',
      description: 'Confirmations when payments are received or processed',
      icon: 'CreditCard'
    },
    {
      id: 'security_alerts',
      label: 'Security Alerts',
      description: 'Important security notifications and login alerts',
      icon: 'Shield'
    },
    {
      id: 'marketing_emails',
      label: 'Marketing Communications',
      description: 'Product updates, newsletters, and promotional content',
      icon: 'Mail'
    },
    {
      id: 'weekly_digest',
      label: 'Weekly Digest',
      description: 'Summary of your weekly activity and important metrics',
      icon: 'Calendar'
    }
  ];

  const channels = [
    {
      id: 'email',
      label: 'Email',
      description: 'Receive notifications via email',
      icon: 'Mail'
    },
    {
      id: 'push',
      label: 'Push Notifications',
      description: 'Browser and mobile push notifications',
      icon: 'Smartphone'
    },
    {
      id: 'in_app',
      label: 'In-App Notifications',
      description: 'Notifications within the application',
      icon: 'Bell'
    }
  ];

  useEffect(() => {
    const loadNotificationSettings = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase?.from('notification_settings')?.select('*')?.eq('user_id', user?.id);

        if (error) {
          console.error('Error loading notification settings:', error);
        } else {
          // Transform array data into object structure for easier handling
          const settingsMap = {};
          data?.forEach(setting => {
            settingsMap[setting?.notification_type] = setting;
          });
          
          setNotificationSettings(settingsMap);
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotificationSettings();
  }, [user?.id]);

  useEffect(() => {
    onUnsavedChanges?.(hasChanges);
  }, [hasChanges, onUnsavedChanges]);

  const handleToggle = (channelType, notificationType, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [channelType]: {
        ...prev?.[channelType],
        [notificationType]: value
      }
    }));
    setHasChanges(true);
  };

  const handleChannelToggle = (channelType, enabled) => {
    const updatedSettings = { ...notificationSettings };
    
    if (updatedSettings?.[channelType]) {
      // Update all notification types for this channel
      Object.keys(updatedSettings?.[channelType])?.forEach(key => {
        if (notificationTypes?.some(nt => nt?.id === key)) {
          updatedSettings[channelType][key] = enabled;
        }
      });
    }
    
    setNotificationSettings(updatedSettings);
    setHasChanges(true);
  };

  const saveSettings = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      // Prepare upsert data for each channel
      const upsertPromises = channels?.map(async (channel) => {
        const channelSettings = notificationSettings?.[channel?.id];
        if (!channelSettings) return;

        const settingsData = {
          user_id: user?.id,
          notification_type: channel?.id,
          project_updates: channelSettings?.project_updates ?? true,
          invoice_reminders: channelSettings?.invoice_reminders ?? true,
          payment_confirmations: channelSettings?.payment_confirmations ?? true,
          security_alerts: channelSettings?.security_alerts ?? true,
          marketing_emails: channelSettings?.marketing_emails ?? false,
          weekly_digest: channelSettings?.weekly_digest ?? true,
          updated_at: new Date()?.toISOString()
        };

        return supabase?.from('notification_settings')?.upsert(settingsData, { 
            onConflict: 'user_id,notification_type',
            ignoreDuplicates: false 
          });
      });

      const results = await Promise.all(upsertPromises?.filter(Boolean));
      
      // Check if any updates failed
      const hasErrors = results?.some(result => result?.error);
      if (hasErrors) {
        throw new Error('Some settings failed to save');
      }

      setHasChanges(false);
      alert('Notification settings saved successfully!');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      alert('Failed to save notification settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    // Reload settings from the original state
    setNotificationSettings(prev => {
      const reset = {};
      channels?.forEach(channel => {
        if (prev?.[channel?.id]) {
          reset[channel?.id] = { ...prev?.[channel?.id] };
        }
      });
      return reset;
    });
    setHasChanges(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-2">Notification Settings</h2>
        <p className="text-muted-foreground">
          Control how and when you receive notifications across different channels.
        </p>
      </div>

      <div className="space-y-8">
        {/* Quick Controls */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="font-medium text-card-foreground mb-3">Quick Controls</h3>
          <div className="flex flex-wrap gap-3">
            {channels?.map((channel) => {
              const channelSettings = notificationSettings?.[channel?.id];
              const hasAnyEnabled = channelSettings && Object.values(channelSettings)?.some(val => val === true);
              
              return (
                <div key={channel?.id} className="flex items-center space-x-3">
                  <Button
                    variant={hasAnyEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleChannelToggle(channel?.id, !hasAnyEnabled)}
                  >
                    <Icon name={channel?.icon} size={16} />
                    {hasAnyEnabled ? 'Disable' : 'Enable'} {channel?.label}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notification Matrix */}
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-4 font-medium text-card-foreground">Notification Type</th>
                  {channels?.map((channel) => (
                    <th key={channel?.id} className="text-center p-4 font-medium text-card-foreground min-w-[120px]">
                      <div className="flex flex-col items-center space-y-1">
                        <Icon name={channel?.icon} size={16} />
                        <span className="text-sm">{channel?.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {notificationTypes?.map((notification, index) => (
                  <tr key={notification?.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                    <td className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                          <Icon name={notification?.icon} size={16} className="text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-card-foreground">{notification?.label}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {notification?.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {channels?.map((channel) => {
                      const isEnabled = notificationSettings?.[channel?.id]?.[notification?.id] ?? (
                        notification?.id === 'marketing_emails' ? false : true
                      );
                      
                      return (
                        <td key={channel?.id} className="p-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={isEnabled}
                              onChange={(e) => handleToggle(channel?.id, notification?.id, e?.target?.checked)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Channel Descriptions */}
        <div className="grid md:grid-cols-3 gap-4">
          {channels?.map((channel) => (
            <div key={channel?.id} className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={channel?.icon} size={18} className="text-primary" />
                <h4 className="font-medium text-card-foreground">{channel?.label}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{channel?.description}</p>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
            <div>
              <h4 className="font-medium text-warning mb-1">Important Security Notice</h4>
              <p className="text-sm text-muted-foreground">
                Security alerts cannot be completely disabled to ensure account safety. 
                Critical security notifications will always be sent via email regardless of your preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={resetSettings}
            disabled={!hasChanges}
          >
            Reset Changes
          </Button>
          
          <Button
            type="button"
            onClick={saveSettings}
            disabled={!hasChanges}
            loading={saving}
          >
            <Icon name="Save" size={16} />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;