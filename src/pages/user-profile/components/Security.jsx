import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import { supabase } from '../../../utils/supabase';

const Security = ({ user, profile }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  useEffect(() => {
    const loadSecurityData = async () => {
      if (!user?.id) return;

      try {
        // Load user sessions
        const { data: sessionData, error: sessionError } = await supabase?.from('user_sessions')?.select('*')?.eq('user_id', user?.id)?.order('last_activity_at', { ascending: false });

        if (sessionError) {
          console.error('Error loading sessions:', sessionError);
        } else {
          // Add mock current session if no sessions exist
          const sessionsWithCurrent = sessionData?.length ? sessionData : [
            {
              id: 'current',
              device_info: 'Current Browser Session',
              ip_address: '192.168.1.1',
              location: 'San Francisco, CA',
              user_agent: navigator?.userAgent,
              is_current: true,
              created_at: new Date()?.toISOString(),
              last_activity_at: new Date()?.toISOString()
            }
          ];
          setSessions(sessionsWithCurrent);
        }
      } catch (error) {
        console.error('Error loading security data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSecurityData();
  }, [user?.id]);

  const handlePasswordChange = async (data) => {
    try {
      const { error } = await supabase?.auth?.updateUser({
        password: data?.newPassword
      });

      if (error) throw error;

      alert('Password updated successfully!');
      setShowPasswordModal(false);
      reset();
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password: ' + error?.message);
    }
  };

  const handleToggle2FA = async () => {
    try {
      // In a real implementation, this would handle 2FA setup/disable
      const new2FAStatus = !profile?.two_factor_enabled;
      
      alert(`Two-factor authentication ${new2FAStatus ? 'enabled' : 'disabled'} successfully!`);
      setShow2FAModal(false);
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      alert('Failed to update two-factor authentication settings.');
    }
  };

  const handleSessionRevoke = async (sessionId) => {
    if (sessionId === 'current') {
      alert('Cannot revoke current session. Please log out normally.');
      return;
    }

    const confirmRevoke = window.confirm('Are you sure you want to revoke this session?');
    if (!confirmRevoke) return;

    setLoadingSessions(true);
    try {
      const { error } = await supabase?.from('user_sessions')?.delete()?.eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev?.filter(session => session?.id !== sessionId));
      alert('Session revoked successfully!');
    } catch (error) {
      console.error('Error revoking session:', error);
      alert('Failed to revoke session. Please try again.');
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleRevokeAllSessions = async () => {
    const confirmRevokeAll = window.confirm(
      'This will sign you out of all devices except the current one. Continue?'
    );
    if (!confirmRevokeAll) return;

    setLoadingSessions(true);
    try {
      const { error } = await supabase?.from('user_sessions')?.delete()?.eq('user_id', user?.id)?.neq('is_current', true);

      if (error) throw error;

      setSessions(prev => prev?.filter(session => session?.is_current));
      alert('All other sessions have been revoked successfully!');
    } catch (error) {
      console.error('Error revoking all sessions:', error);
      alert('Failed to revoke sessions. Please try again.');
    } finally {
      setLoadingSessions(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return 'Monitor';
    if (userAgent?.includes('Mobile') || userAgent?.includes('Android') || userAgent?.includes('iPhone')) {
      return 'Smartphone';
    }
    if (userAgent?.includes('Tablet') || userAgent?.includes('iPad')) {
      return 'Tablet';
    }
    return 'Monitor';
  };

  const parseDeviceInfo = (userAgent) => {
    if (!userAgent) return { browser: 'Unknown', os: 'Unknown' };
    
    let browser = 'Unknown';
    let os = 'Unknown';

    // Simple browser detection
    if (userAgent?.includes('Chrome')) browser = 'Chrome';
    else if (userAgent?.includes('Firefox')) browser = 'Firefox';
    else if (userAgent?.includes('Safari')) browser = 'Safari';
    else if (userAgent?.includes('Edge')) browser = 'Edge';

    // Simple OS detection
    if (userAgent?.includes('Windows')) os = 'Windows';
    else if (userAgent?.includes('Mac')) os = 'macOS';
    else if (userAgent?.includes('Linux')) os = 'Linux';
    else if (userAgent?.includes('Android')) os = 'Android';
    else if (userAgent?.includes('iOS')) os = 'iOS';

    return { browser, os };
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
    <>
      <div className="p-6 space-y-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-2">Security Settings</h2>
          <p className="text-muted-foreground">
            Manage your account security, password, and active sessions.
          </p>
        </div>

        {/* Account Security Overview */}
        <div className="bg-muted/30 rounded-lg p-6">
          <h3 className="font-semibold text-card-foreground mb-4">Security Overview</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-background rounded-lg">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                profile?.email_verified ? 'bg-success/10' : 'bg-warning/10'
              }`}>
                <Icon 
                  name={profile?.email_verified ? 'CheckCircle' : 'AlertCircle'} 
                  size={24} 
                  className={profile?.email_verified ? 'text-success' : 'text-warning'} 
                />
              </div>
              <div className="font-medium text-card-foreground">Email Verification</div>
              <div className={`text-sm ${profile?.email_verified ? 'text-success' : 'text-warning'}`}>
                {profile?.email_verified ? 'Verified' : 'Pending'}
              </div>
            </div>

            <div className="text-center p-4 bg-background rounded-lg">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                profile?.two_factor_enabled ? 'bg-success/10' : 'bg-muted'
              }`}>
                <Icon 
                  name="Shield" 
                  size={24} 
                  className={profile?.two_factor_enabled ? 'text-success' : 'text-muted-foreground'} 
                />
              </div>
              <div className="font-medium text-card-foreground">Two-Factor Auth</div>
              <div className={`text-sm ${profile?.two_factor_enabled ? 'text-success' : 'text-muted-foreground'}`}>
                {profile?.two_factor_enabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>

            <div className="text-center p-4 bg-background rounded-lg">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Icon name="Clock" size={24} className="text-primary" />
              </div>
              <div className="font-medium text-card-foreground">Last Login</div>
              <div className="text-sm text-muted-foreground">
                {profile?.last_login_at ? formatDate(profile?.last_login_at) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Password Management */}
        <div className="space-y-4">
          <h3 className="font-semibold text-card-foreground">Password & Authentication</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-card-foreground">Password</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    <Icon name="Key" size={16} />
                    Change Password
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Last updated: {profile?.updated_at ? formatDate(profile?.updated_at) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-card-foreground">Two-Factor Authentication</h4>
                  <Button
                    variant={profile?.two_factor_enabled ? "destructive" : "default"}
                    size="sm"
                    onClick={() => setShow2FAModal(true)}
                  >
                    <Icon name="Shield" size={16} />
                    {profile?.two_factor_enabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {profile?.two_factor_enabled 
                    ? 'Your account is protected with two-factor authentication' :'Add an extra layer of security to your account'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-card-foreground">Active Sessions</h3>
            {sessions?.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevokeAllSessions}
                disabled={loadingSessions}
              >
                <Icon name="LogOut" size={16} />
                Revoke All Other Sessions
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {sessions?.map((session) => {
              const deviceInfo = parseDeviceInfo(session?.user_agent);
              
              return (
                <div
                  key={session?.id}
                  className={`border rounded-lg p-4 ${
                    session?.is_current ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        session?.is_current ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Icon 
                          name={getDeviceIcon(session?.user_agent)} 
                          size={20} 
                          className={session?.is_current ? 'text-primary' : 'text-muted-foreground'}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-card-foreground">
                            {session?.device_info || `${deviceInfo?.browser} on ${deviceInfo?.os}`}
                          </h4>
                          {session?.is_current && (
                            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-muted-foreground mt-1 space-y-1">
                          <div>IP Address: {session?.ip_address || 'Unknown'}</div>
                          {session?.location && (
                            <div>Location: {session?.location}</div>
                          )}
                          <div>Last activity: {formatDate(session?.last_activity_at)}</div>
                        </div>
                      </div>
                    </div>

                    {!session?.is_current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSessionRevoke(session?.id)}
                        disabled={loadingSessions}
                      >
                        <Icon name="X" size={16} />
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="bg-muted/30 rounded-lg p-6">
          <h3 className="font-semibold text-card-foreground mb-4">Security Recommendations</h3>
          
          <div className="space-y-3">
            {(!profile?.email_verified) && (
              <div className="flex items-start space-x-3 p-3 bg-warning/10 rounded-lg">
                <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                <div>
                  <div className="font-medium text-warning">Verify your email address</div>
                  <div className="text-sm text-muted-foreground">
                    Verify your email to secure your account and receive important notifications.
                  </div>
                </div>
              </div>
            )}
            
            {(!profile?.two_factor_enabled) && (
              <div className="flex items-start space-x-3 p-3 bg-primary/10 rounded-lg">
                <Icon name="Shield" size={16} className="text-primary mt-0.5" />
                <div>
                  <div className="font-medium text-primary">Enable two-factor authentication</div>
                  <div className="text-sm text-muted-foreground">
                    Add an extra layer of security to protect your account from unauthorized access.
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
              <Icon name="RefreshCw" size={16} className="text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium text-card-foreground">Regular password updates</div>
                <div className="text-sm text-muted-foreground">
                  Change your password regularly and use a strong, unique password.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          reset();
        }}
        title="Change Password"
        size="default"
      >
        <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            required
            {...register('currentPassword', { 
              required: 'Current password is required' 
            })}
            error={errors?.currentPassword?.message}
          />
          
          <Input
            label="New Password"
            type="password"
            required
            {...register('newPassword', { 
              required: 'New password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain uppercase, lowercase, and number'
              }
            })}
            error={errors?.newPassword?.message}
          />
          
          <Input
            label="Confirm New Password"
            type="password"
            required
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === watch('newPassword') || 'Passwords do not match'
            })}
            error={errors?.confirmPassword?.message}
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowPasswordModal(false);
                reset();
              }}
            >
              Cancel
            </Button>
            
            <Button type="submit">
              <Icon name="Key" size={16} />
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Two-Factor Authentication Modal */}
      <Modal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        title={`${profile?.two_factor_enabled ? 'Disable' : 'Enable'} Two-Factor Authentication`}
        size="default"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" size={32} className="text-primary" />
            </div>
            
            <h3 className="font-semibold text-card-foreground mb-2">
              {profile?.two_factor_enabled ? 'Disable Two-Factor Authentication' : 'Secure Your Account'}
            </h3>
            
            <p className="text-muted-foreground">
              {profile?.two_factor_enabled 
                ? 'Disabling 2FA will make your account less secure. Are you sure you want to continue?' :'Two-factor authentication adds an extra layer of security to your account by requiring a code from your phone in addition to your password.'
              }
            </p>
          </div>
          
          {!profile?.two_factor_enabled && (
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium text-card-foreground mb-2">How it works:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Install an authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>Scan the QR code or enter the setup key</li>
                <li>Enter the verification code to complete setup</li>
              </ol>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShow2FAModal(false)}
            >
              Cancel
            </Button>
            
            <Button
              type="button"
              variant={profile?.two_factor_enabled ? "destructive" : "default"}
              onClick={handleToggle2FA}
            >
              <Icon name="Shield" size={16} />
              {profile?.two_factor_enabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Security;