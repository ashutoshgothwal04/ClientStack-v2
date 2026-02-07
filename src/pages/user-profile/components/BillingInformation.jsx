import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { supabase } from '../../../utils/supabase';

const BillingInformation = ({ user, profile }) => {
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const loadBillingData = async () => {
      if (!user?.id) return;

      try {
        // Load subscription details
        const { data: subscription, error: subError } = await supabase?.from('subscription_details')?.select('*')?.eq('user_id', user?.id)?.single();

        if (subError && subError?.code !== 'PGRST116') {
          console.error('Error loading subscription:', subError);
        } else {
          setSubscriptionDetails(subscription);
        }

        // Mock payment methods (in real app, this would come from Stripe/payment processor)
        setPaymentMethods([
          {
            id: 'pm_1',
            type: 'card',
            last4: '4242',
            brand: 'visa',
            exp_month: 12,
            exp_year: 2025,
            is_default: true
          },
          {
            id: 'pm_2',
            type: 'card',
            last4: '5555',
            brand: 'mastercard',
            exp_month: 8,
            exp_year: 2026,
            is_default: false
          }
        ]);

        // Mock invoice data
        setInvoices([
          {
            id: 'inv_1',
            number: 'INV-2024-001',
            amount: 29.99,
            currency: 'USD',
            status: 'paid',
            date: '2024-01-01',
            period_start: '2024-01-01',
            period_end: '2024-01-31',
            description: 'Pro Plan - Monthly Subscription'
          },
          {
            id: 'inv_2',
            number: 'INV-2024-002',
            amount: 29.99,
            currency: 'USD',
            status: 'paid',
            date: '2024-02-01',
            period_start: '2024-02-01',
            period_end: '2024-02-29',
            description: 'Pro Plan - Monthly Subscription'
          },
          {
            id: 'inv_3',
            number: 'INV-2024-003',
            amount: 29.99,
            currency: 'USD',
            status: 'pending',
            date: '2024-03-01',
            period_start: '2024-03-01',
            period_end: '2024-03-31',
            description: 'Pro Plan - Monthly Subscription'
          }
        ]);

      } catch (error) {
        console.error('Error loading billing data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBillingData();
  }, [user?.id]);

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })?.format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBrandIcon = (brand) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return 'CreditCard';
      case 'mastercard':
        return 'CreditCard';
      case 'amex':
        return 'CreditCard';
      default:
        return 'CreditCard';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'failed':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'failed':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handlePaymentMethodDelete = (methodId) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this payment method?');
    if (!confirmDelete) return;

    setPaymentMethods(prev => prev?.filter(method => method?.id !== methodId));
    alert('Payment method removed successfully!');
  };

  const handleSetDefaultPayment = (methodId) => {
    setPaymentMethods(prev => 
      prev?.map(method => ({
        ...method,
        is_default: method?.id === methodId
      }))
    );
    alert('Default payment method updated successfully!');
  };

  const handleDownloadInvoice = (invoice) => {
    // In real implementation, this would download or open the invoice PDF
    alert(`Downloading invoice ${invoice?.number}`);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
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
          <h2 className="text-xl font-semibold text-card-foreground mb-2">Billing Information</h2>
          <p className="text-muted-foreground">
            Manage your subscription, payment methods, and billing history.
          </p>
        </div>

        {/* Current Subscription */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 border border-primary/10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Current Subscription</h3>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                  {profile?.subscription_tier?.charAt(0)?.toUpperCase() + profile?.subscription_tier?.slice(1)} Plan
                </span>
                {subscriptionDetails?.auto_renewal && (
                  <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                    Auto-renew enabled
                  </span>
                )}
              </div>
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

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div>
              <h4 className="font-medium text-card-foreground mb-2">Billing Details</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Started: {formatDate(subscriptionDetails?.started_at || profile?.created_at)}</div>
                <div>Billing Cycle: {subscriptionDetails?.billing_cycle || 'Monthly'}</div>
                <div>Payment Method: •••• {paymentMethods?.find(pm => pm?.is_default)?.last4 || '••••'}</div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Upgrade/downgrade functionality would be implemented here')}
              >
                <Icon name="ArrowUp" size={16} />
                Change Plan
              </Button>
              
              {subscriptionDetails?.auto_renewal && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('Cancel subscription functionality would be implemented here')}
                >
                  <Icon name="X" size={16} />
                  Cancel Subscription
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-card-foreground">Payment Methods</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPaymentModal(true)}
            >
              <Icon name="Plus" size={16} />
              Add Payment Method
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {paymentMethods?.map((method) => (
              <div
                key={method?.id}
                className={`border rounded-lg p-4 ${
                  method?.is_default ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name={getBrandIcon(method?.brand)} size={20} className="text-muted-foreground" />
                    </div>
                    
                    <div>
                      <div className="font-medium text-card-foreground">
                        {method?.brand?.charAt(0)?.toUpperCase() + method?.brand?.slice(1)} •••• {method?.last4}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expires {method?.exp_month?.toString()?.padStart(2, '0')}/{method?.exp_year}
                      </div>
                      {method?.is_default && (
                        <span className="inline-block px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full mt-1">
                          Default
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    {!method?.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefaultPayment(method?.id)}
                      >
                        <Icon name="Check" size={16} />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePaymentMethodDelete(method?.id)}
                      disabled={method?.is_default && paymentMethods?.length === 1}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-card-foreground">Billing History</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert('Download all invoices functionality would be implemented here')}
            >
              <Icon name="Download" size={16} />
              Download All
            </Button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-card-foreground">Invoice</th>
                    <th className="text-left p-4 font-medium text-card-foreground">Date</th>
                    <th className="text-left p-4 font-medium text-card-foreground">Amount</th>
                    <th className="text-left p-4 font-medium text-card-foreground">Status</th>
                    <th className="text-right p-4 font-medium text-card-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices?.map((invoice, index) => (
                    <tr key={invoice?.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-card-foreground">{invoice?.number}</div>
                          <div className="text-sm text-muted-foreground">{invoice?.description}</div>
                        </div>
                      </td>
                      <td className="p-4 text-card-foreground">
                        {formatDate(invoice?.date)}
                      </td>
                      <td className="p-4 text-card-foreground">
                        {formatCurrency(invoice?.amount, invoice?.currency)}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(invoice?.status)}`}>
                          {invoice?.status?.charAt(0)?.toUpperCase() + invoice?.status?.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <Icon name="Eye" size={16} />
                          </Button>
                          
                          {invoice?.status === 'paid' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadInvoice(invoice)}
                            >
                              <Icon name="Download" size={16} />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Billing Address & Tax Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-card-foreground">Billing Address</h4>
              <Button variant="ghost" size="sm">
                <Icon name="Edit" size={16} />
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <div>{profile?.full_name}</div>
              <div>{profile?.company}</div>
              <div>{profile?.location || 'No address on file'}</div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-card-foreground">Tax Information</h4>
              <Button variant="ghost" size="sm">
                <Icon name="Edit" size={16} />
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Tax ID: Not provided</div>
              <div>VAT Number: Not applicable</div>
              <div>Tax Rate: Standard rate applies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Add Payment Method"
        size="default"
      >
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CreditCard" size={32} className="text-primary" />
            </div>
            
            <h3 className="font-semibold text-card-foreground mb-2">Add New Payment Method</h3>
            <p className="text-muted-foreground">
              This would integrate with Stripe or another payment processor to securely add a new payment method.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
            >
              Cancel
            </Button>
            
            <Button
              onClick={() => {
                alert('Payment method integration would be implemented here');
                setShowPaymentModal(false);
              }}
            >
              <Icon name="Plus" size={16} />
              Add Payment Method
            </Button>
          </div>
        </div>
      </Modal>

      {/* Invoice Details Modal */}
      <Modal
        isOpen={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          setSelectedInvoice(null);
        }}
        title={`Invoice ${selectedInvoice?.number}`}
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">{selectedInvoice?.number}</h3>
                <p className="text-muted-foreground">
                  Billing period: {formatDate(selectedInvoice?.period_start)} - {formatDate(selectedInvoice?.period_end)}
                </p>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(selectedInvoice?.status)}`}>
                {selectedInvoice?.status?.charAt(0)?.toUpperCase() + selectedInvoice?.status?.slice(1)}
              </span>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-card-foreground">{selectedInvoice?.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(selectedInvoice?.period_start)} - {formatDate(selectedInvoice?.period_end)}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-card-foreground">
                    {formatCurrency(selectedInvoice?.amount, selectedInvoice?.currency)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowInvoiceModal(false);
                  setSelectedInvoice(null);
                }}
              >
                Close
              </Button>
              
              {selectedInvoice?.status === 'paid' && (
                <Button
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                >
                  <Icon name="Download" size={16} />
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default BillingInformation;