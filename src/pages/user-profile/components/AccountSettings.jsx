import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../utils/supabase';
import { toast } from "sonner";

const AccountSettings = ({ user, profile }) => {
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [usageStats, setUsageStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccountData = async () => {
      if (!user?.id) return;
      try {
        // Load subscription details
        const { data: subscription, error: subError } = await supabase?.from('subscription_details')?.select('*')?.eq('user_id', user?.id)?.single();
        if (subError && subError?.code !== 'PGRST116') {
          console.error('Error loading subscription:', subError);
+         toast.error('Failed to load subscription details.');
        } else {
          setSubscriptionDetails(subscription);
+         toast.success('Subscription details loaded.');
        }
        // Mock usage stats (in real app, this would come from your analytics)
        setUsageStats({
          projects_created: 12,
          total_invoices: 45,
          storage_used: '2.3 GB',
          storage_limit: '10 GB',
          api_calls_this_month: 1250,
          api_limit: 5000,
          team_members: 3,
          team_limit: profile?.subscription_tier === 'enterprise' ? 50 : profile?.subscription_tier === 'pro' ? 10 : 3
        });
      } catch (error) {
        console.error('Error loading account data:', error);
+       toast.error('Error loading account data.');
      } finally {
        setLoading(false);
      }
    };
    loadAccountData();
  }, [user?.id, profile?.subscription_tier]);

  const getSubscriptionBadgeColor = (tier) => {
    switch (tier) {
      case 'enterprise':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'pro':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'free':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUpgradeButtonColor = (currentTier) => {
    if (currentTier === 'enterprise') return null;
    return currentTier === 'pro' ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-cyan-500';
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })?.format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUsagePercentage = (used, limit) => {
    if (!used || !limit) return 0;
    const usedNum = typeof used === 'string' ? parseFloat(used) : used;
    const limitNum = typeof limit === 'string' ? parseFloat(limit) : limit;
    return Math.min((usedNum / limitNum) * 100, 100);
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
    <div className="p-6 space-y-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-2">Account Settings</h2>
        <p className="text-muted-foreground">
          Manage your subscription, usage, and account preferences.
        </p>
      </div>

      {/* Subscription Overview */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 border border-primary/10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionBadgeColor(profile?.subscription_tier)}`}>
                {profile?.subscription_tier?.charAt(0)?.toUpperCase() + profile?.subscription_tier?.slice(1)} Plan
              </span>
              {subscriptionDetails?.auto_renewal && (
                <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                  Auto-renew enabled
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Current Subscription
            </h3>
            <p className="text-muted-foreground">
              {subscriptionDetails?.billing_cycle === 'yearly' ? 'Yearly' : 'Monthly'} billing
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-card-foreground">
              {formatCurrency(subscriptionDetails?.price_paid)}
              <span className="text-sm font-normal text-muted-foreground">
                /{subscriptionDetails?.billing_cycle === 'yearly' ? 'year' : 'month'}
              </span>
            </div>
            {subscriptionDetails?.next_billing_date && (
              <p className="text-sm text-muted-foreground">
                Next billing: {formatDate(subscriptionDetails?.next_billing_date)}
              </p>
            )}
          </div>
        </div>

        {profile?.subscription_tier !== 'enterprise' && (
          <div className="pt-4 border-t border-border/50">
            <Button
              className={`bg-gradient-to-r ${getUpgradeButtonColor(profile?.subscription_tier)} hover:opacity-90 text-white border-0`}
              onClick={() => {
                toast.info('Upgrade functionality would be implemented here');
              }}
            >
              <Icon name="Zap" size={16} />
              {profile?.subscription_tier === 'free' ? 'Upgrade to Pro' : 'Upgrade to Enterprise'}
            </Button>
          </div>
        )}
      </div>

      {/* Usage Statistics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-card-foreground">Usage This Month</h3>
          
          {/* API Calls */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-card-foreground">API Calls</span>
              <span className="text-sm text-muted-foreground">
                {usageStats?.api_calls_this_month?.toLocaleString()} / {usageStats?.api_limit?.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${getUsagePercentage(usageStats?.api_calls_this_month, usageStats?.api_limit)}%` }}
              ></div>
            </div>
          </div>

          {/* Storage */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-card-foreground">Storage Used</span>
              <span className="text-sm text-muted-foreground">
                {usageStats?.storage_used} / {usageStats?.storage_limit}
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${getUsagePercentage(2.3, 10)}%` }}
              ></div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-card-foreground">Team Members</span>
              <span className="text-sm text-muted-foreground">
                {usageStats?.team_members} / {usageStats?.team_limit}
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-300"
                style={{ width: `${getUsagePercentage(usageStats?.team_members, usageStats?.team_limit)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <h3 className="font-semibold text-card-foreground">Account Statistics</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/5 rounded-lg p-4 text-center border border-primary/10">
              <div className="text-2xl font-bold text-primary mb-1">
                {usageStats?.projects_created}
              </div>
              <div className="text-sm text-muted-foreground">Projects Created</div>
            </div>
            
            <div className="bg-accent/5 rounded-lg p-4 text-center border border-accent/10">
              <div className="text-2xl font-bold text-accent mb-1">
                {usageStats?.total_invoices}
              </div>
              <div className="text-sm text-muted-foreground">Total Invoices</div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-card-foreground mb-3">Account Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Created</span>
                <span className="text-card-foreground">{formatDate(profile?.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Login</span>
                <span className="text-card-foreground">{formatDate(profile?.last_login_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email Verified</span>
                <span className={`${profile?.email_verified ? 'text-success' : 'text-warning'}`}>
                  {profile?.email_verified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="space-y-4">
        <h3 className="font-semibold text-card-foreground">Available Plans</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Free Plan */}
          <div className={`border rounded-lg p-4 ${profile?.subscription_tier === 'free' ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <div className="text-center mb-4">
              <h4 className="font-semibold text-card-foreground">Free</h4>
              <div className="text-2xl font-bold text-card-foreground mt-2">$0</div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-success mr-2" />
                <span>3 Projects</span>
              </li>
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-success mr-2" />
                <span>1 GB Storage</span>
              </li>
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-success mr-2" />
                <span>Basic Support</span>
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className={`border rounded-lg p-4 ${profile?.subscription_tier === 'pro' ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <div className="text-center mb-4">
              <h4 className="font-semibold text-card-foreground">Pro</h4>
              <div className="text-2xl font-bold text-card-foreground mt-2">$29</div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-success mr-2" />
                <span>Unlimited Projects</span>
              </li>
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-success mr-2" />
                <span>10 GB Storage</span>
              </li>
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-success mr-2" />
                <span>Priority Support</span>
              </li>
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-success mr-2" />
                <span>Advanced Analytics</span>
              </li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className={`border rounded-lg p-4 ${profile?.subscription_tier === 'enterprise' ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <div className="text-center mb-4">
              <h4 className="font-semibold text-card-foreground">Enterprise</h4>
              <div className="text-2xl font-bold text-card-foreground mt-2">$99</div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-success mr-2" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-success mr-2" />
                <span>100 GB Storage</span>
              </li>
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-success mr-2" />
                <span>50 Team Members</span>
              </li>
              <li className="flex items-center">
                <Icon name="Check" size={16} className="text-success mr-2" />
                <span>24/7 Phone Support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="pt-6 border-t border-border">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => {
              toast.info('Billing history functionality would be implemented here');
            }}
          >
            <Icon name="Receipt" size={16} />
            View Billing History
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast.info('Usage reports functionality would be implemented here');
            }}
          >
            <Icon name="BarChart3" size={16} />
            Download Usage Report
          </Button>
          {subscriptionDetails?.tier !== 'free' && (
            <Button
              variant="outline"
              onClick={() => {
                toast.info('Cancel subscription functionality would be implemented here');
              }}
            >
              <Icon name="X" size={16} />
              Cancel Subscription
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;