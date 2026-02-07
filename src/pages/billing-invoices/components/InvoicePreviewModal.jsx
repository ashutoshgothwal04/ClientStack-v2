import React from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const InvoicePreviewModal = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null;

  const handleDownloadPDF = () => {
    // Mock PDF download functionality
    console.log('Downloading PDF for invoice:', invoice?.invoiceNumber);
    // In a real app, this would generate and download a PDF
  };

  const handleSendInvoice = () => {
    // Mock send invoice functionality
    console.log('Sending invoice:', invoice?.invoiceNumber);
    // In a real app, this would send the invoice via email
  };

  const handleGeneratePaymentLink = () => {
    // Mock Stripe payment link generation
    const mockPaymentLink = `https://pay.stripe.com/invoice/${invoice?.invoiceNumber}`;
    navigator.clipboard?.writeText(mockPaymentLink);
    console.log('Payment link copied to clipboard');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-success text-success-foreground';
      case 'unpaid':
        return 'bg-warning text-warning-foreground';
      case 'overdue':
        return 'bg-error text-error-foreground';
      case 'partial':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invoice Preview"
      size="xl"
      footer={
        <div className="flex justify-between w-full">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Icon name="Download" size={16} className="mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handleSendInvoice}>
              <Icon name="Mail" size={16} className="mr-2" />
              Send Invoice
            </Button>
            <Button variant="outline" onClick={handleGeneratePaymentLink}>
              <Icon name="CreditCard" size={16} className="mr-2" />
              Payment Link
            </Button>
          </div>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="bg-background border border-border rounded-lg p-8 max-w-4xl mx-auto">
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-primary-foreground"
                  fill="currentColor"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">ClientStack</h1>
                <p className="text-sm text-muted-foreground">Professional CRM Solutions</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>123 Business Street</p>
              <p>San Francisco, CA 94105</p>
              <p>contact@clientstack.com</p>
              <p>(555) 123-4567</p>
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-3xl font-bold text-card-foreground mb-2">INVOICE</h2>
            <div className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Invoice #:</span> <span className="font-mono font-medium">{invoice?.invoiceNumber}</span></p>
              <p><span className="text-muted-foreground">Issue Date:</span> {new Date(invoice.issueDate)?.toLocaleDateString()}</p>
              <p><span className="text-muted-foreground">Due Date:</span> {new Date(invoice.dueDate)?.toLocaleDateString()}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice?.status)}`}>
                  {invoice?.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-card-foreground mb-3 uppercase tracking-wide">Bill To</h3>
            <div className="text-sm">
              <p className="font-medium text-card-foreground text-lg">{invoice?.client}</p>
              <p className="text-muted-foreground">123 Client Avenue</p>
              <p className="text-muted-foreground">New York, NY 10001</p>
              <p className="text-muted-foreground">client@example.com</p>
            </div>
          </div>
          
          {invoice?.project && (
            <div>
              <h3 className="text-sm font-semibold text-card-foreground mb-3 uppercase tracking-wide">Project</h3>
              <div className="text-sm">
                <p className="font-medium text-card-foreground">{invoice?.project}</p>
                <p className="text-muted-foreground">Project-based billing</p>
              </div>
            </div>
          )}
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-3 text-sm font-semibold text-card-foreground uppercase tracking-wide">Description</th>
                  <th className="text-center py-3 text-sm font-semibold text-card-foreground uppercase tracking-wide">Qty</th>
                  <th className="text-right py-3 text-sm font-semibold text-card-foreground uppercase tracking-wide">Rate</th>
                  <th className="text-right py-3 text-sm font-semibold text-card-foreground uppercase tracking-wide">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice?.lineItems?.map((item, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-4 text-sm text-card-foreground">{item?.description}</td>
                    <td className="py-4 text-sm text-center text-muted-foreground">{item?.quantity}</td>
                    <td className="py-4 text-sm text-right text-muted-foreground">${parseFloat(item?.rate || 0)?.toFixed(2)}</td>
                    <td className="py-4 text-sm text-right font-medium text-card-foreground">${item?.amount?.toFixed(2) || '0.00'}</td>
                  </tr>
                )) || (
                  <tr className="border-b border-border">
                    <td className="py-4 text-sm text-card-foreground">Professional Services</td>
                    <td className="py-4 text-sm text-center text-muted-foreground">1</td>
                    <td className="py-4 text-sm text-right text-muted-foreground">{invoice?.amount}</td>
                    <td className="py-4 text-sm text-right font-medium text-card-foreground">{invoice?.amount}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium text-card-foreground">
                  ${invoice?.subtotal?.toFixed(2) || invoice?.amount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%):</span>
                <span className="font-medium text-card-foreground">
                  ${invoice?.tax?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-card-foreground">Total:</span>
                  <span className="text-card-foreground">
                    ${invoice?.total?.toFixed(2) || invoice?.amount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice?.notes && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-card-foreground mb-3 uppercase tracking-wide">Notes</h3>
            <p className="text-sm text-muted-foreground">{invoice?.notes}</p>
          </div>
        )}

        {/* Payment Terms */}
        <div className="border-t border-border pt-6">
          <h3 className="text-sm font-semibold text-card-foreground mb-3 uppercase tracking-wide">Payment Terms</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Payment is due within 30 days of invoice date</p>
            <p>• Late payments may incur a 1.5% monthly service charge</p>
            <p>• Please include invoice number with payment</p>
            <p>• For questions, contact us at billing@clientstack.com</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Thank you for your business! This invoice was generated on {new Date()?.toLocaleDateString()}.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default InvoicePreviewModal;