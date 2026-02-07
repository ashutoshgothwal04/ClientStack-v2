import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { supabase } from '../../../utils/supabase';

const Preferences = ({ user, profile, onUnsavedChanges }) => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
    reset
  } = useForm({
    defaultValues: {
      theme: 'system',
      timezone: 'UTC',
      language: 'en',
      date_format: 'MM/DD/YYYY',
      time_format: '12',
      default_project_view: 'list',
      dashboard_layout: '{"widgets": ["metrics", "recent_activity", "quick_actions"]}'
    }
  });

  const themeOptions = [
    { value: 'light', label: 'Light Mode', description: 'Clean and bright interface' },
    { value: 'dark', label: 'Dark Mode', description: 'Easy on the eyes' },
    { value: 'system', label: 'System Default', description: 'Matches your device settings' }
  ];

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (New York)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (London)' },
    { value: 'Europe/Berlin', label: 'Central European Time (Berlin)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (Tokyo)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (Shanghai)' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'zh', label: '中文' },
    { value: 'ja', label: '日本語' }
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US Format)', description: '12/31/2024' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU Format)', description: '31/12/2024' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO Format)', description: '2024-12-31' },
    { value: 'DD MMM YYYY', label: 'DD MMM YYYY', description: '31 Dec 2024' }
  ];

  const timeFormatOptions = [
    { value: '12', label: '12-hour format', description: '2:30 PM' },
    { value: '24', label: '24-hour format', description: '14:30' }
  ];

  const projectViewOptions = [
    { value: 'list', label: 'List View', description: 'Simple list with details' },
    { value: 'grid', label: 'Grid View', description: 'Card-based layout' },
    { value: 'kanban', label: 'Kanban Board', description: 'Visual task management' },
    { value: 'calendar', label: 'Calendar View', description: 'Timeline-based view' }
  ];

  const dashboardWidgets = [
    { id: 'metrics', label: 'Key Metrics', description: 'Revenue, projects, clients' },
    { id: 'recent_activity', label: 'Recent Activity', description: 'Latest actions and updates' },
    { id: 'quick_actions', label: 'Quick Actions', description: 'Shortcuts to common tasks' },
    { id: 'notifications', label: 'Notifications', description: 'Important alerts and messages' },
    { id: 'revenue_chart', label: 'Revenue Chart', description: 'Income visualization' },
    { id: 'top_clients', label: 'Top Clients', description: 'Most valuable customers' }
  ];

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase?.from('user_preferences')?.select('*')?.eq('user_id', user?.id)?.single();

        if (error && error?.code !== 'PGRST116') {
          console.error('Error loading preferences:', error);
        } else if (data) {
          setPreferences(data);
          
          // Update form with loaded preferences
          setValue('theme', data?.theme || 'system');
          setValue('timezone', data?.timezone || 'UTC');
          setValue('language', data?.language || 'en');
          setValue('date_format', data?.date_format || 'MM/DD/YYYY');
          setValue('time_format', data?.time_format || '12');
          setValue('default_project_view', data?.default_project_view || 'list');
          setValue('dashboard_layout', JSON.stringify(data?.dashboard_layout || { widgets: ['metrics', 'recent_activity', 'quick_actions'] }));
          
          reset({
            theme: data?.theme || 'system',
            timezone: data?.timezone || 'UTC',
            language: data?.language || 'en',
            date_format: data?.date_format || 'MM/DD/YYYY',
            time_format: data?.time_format || '12',
            default_project_view: data?.default_project_view || 'list',
            dashboard_layout: JSON.stringify(data?.dashboard_layout || { widgets: ['metrics', 'recent_activity', 'quick_actions'] })
          });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id, setValue, reset]);

  // Watch form changes to notify parent of unsaved changes
  useEffect(() => {
    onUnsavedChanges?.(isDirty);
  }, [isDirty, onUnsavedChanges]);

  const onSubmit = async (data) => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const updatedPreferences = {
        user_id: user?.id,
        theme: data?.theme,
        timezone: data?.timezone,
        language: data?.language,
        date_format: data?.date_format,
        time_format: data?.time_format,
        default_project_view: data?.default_project_view,
        dashboard_layout: JSON.parse(data?.dashboard_layout),
        updated_at: new Date()?.toISOString()
      };

      const { data: result, error } = await supabase?.from('user_preferences')?.upsert(updatedPreferences, { onConflict: 'user_id' })?.select()?.single();

      if (error) throw error;

      setPreferences(result);
      reset(data); // Reset form dirty state
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDashboardWidgetToggle = (widgetId, isEnabled) => {
    const currentLayout = JSON.parse(watch('dashboard_layout') || '{"widgets": []}');
    let newWidgets = [...(currentLayout?.widgets || [])];

    if (isEnabled && !newWidgets?.includes(widgetId)) {
      newWidgets?.push(widgetId);
    } else if (!isEnabled && newWidgets?.includes(widgetId)) {
      newWidgets = newWidgets?.filter(widget => widget !== widgetId);
    }

    setValue('dashboard_layout', JSON.stringify({ widgets: newWidgets }), { shouldDirty: true });
  };

  const getCurrentWidgets = () => {
    try {
      const layout = JSON.parse(watch('dashboard_layout') || '{"widgets": []}');
      return layout?.widgets || [];
    } catch {
      return [];
    }
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
        <h2 className="text-xl font-semibold text-card-foreground mb-2">Preferences</h2>
        <p className="text-muted-foreground">
          Customize your dashboard layout, timezone, and application defaults.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Appearance Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-card-foreground">Appearance</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Theme Preference"
              options={themeOptions}
              value={watch('theme')}
              onChange={(value) => setValue('theme', value, { shouldDirty: true })}
              placeholder="Select theme"
            />
            
            <Select
              label="Language"
              options={languageOptions}
              value={watch('language')}
              onChange={(value) => setValue('language', value, { shouldDirty: true })}
              placeholder="Select language"
            />
          </div>
        </div>

        {/* Localization Settings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-card-foreground">Localization</h3>
          
          <div className="space-y-4">
            <Select
              label="Timezone"
              options={timezoneOptions}
              value={watch('timezone')}
              onChange={(value) => setValue('timezone', value, { shouldDirty: true })}
              searchable
              placeholder="Select your timezone"
              description="Used for scheduling and time display"
            />
            
            <div className="grid md:grid-cols-2 gap-6">
              <Select
                label="Date Format"
                options={dateFormatOptions}
                value={watch('date_format')}
                onChange={(value) => setValue('date_format', value, { shouldDirty: true })}
                placeholder="Select date format"
              />
              
              <Select
                label="Time Format"
                options={timeFormatOptions}
                value={watch('time_format')}
                onChange={(value) => setValue('time_format', value, { shouldDirty: true })}
                placeholder="Select time format"
              />
            </div>
          </div>
        </div>

        {/* Default Views */}
        <div className="space-y-4">
          <h3 className="font-semibold text-card-foreground">Default Views</h3>
          
          <Select
            label="Default Project View"
            options={projectViewOptions}
            value={watch('default_project_view')}
            onChange={(value) => setValue('default_project_view', value, { shouldDirty: true })}
            placeholder="Select default view"
            description="Choose how projects are displayed by default"
          />
        </div>

        {/* Dashboard Layout */}
        <div className="space-y-4">
          <h3 className="font-semibold text-card-foreground">Dashboard Layout</h3>
          <p className="text-sm text-muted-foreground">
            Select which widgets to display on your dashboard
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {dashboardWidgets?.map((widget) => {
              const isEnabled = getCurrentWidgets()?.includes(widget?.id);
              
              return (
                <div
                  key={widget?.id}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all duration-200
                    ${isEnabled 
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20' :'border-border hover:border-border/80'
                    }
                  `}
                  onClick={() => handleDashboardWidgetToggle(widget?.id, !isEnabled)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon 
                          name={isEnabled ? 'CheckCircle' : 'Circle'} 
                          size={16} 
                          className={isEnabled ? 'text-primary' : 'text-muted-foreground'} 
                        />
                        <span className="font-medium text-card-foreground">
                          {widget?.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {widget?.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Selected widgets: {getCurrentWidgets()?.length} / {dashboardWidgets?.length}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              onUnsavedChanges?.(false);
            }}
            disabled={!isDirty}
          >
            Reset Changes
          </Button>
          
          <Button
            type="submit"
            disabled={!isDirty}
            loading={saving}
          >
            <Icon name="Save" size={16} />
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Preferences;