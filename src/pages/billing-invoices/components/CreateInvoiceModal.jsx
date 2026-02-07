import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CreateInvoiceModal = ({ isOpen, onClose, onCreateInvoice }) => {
  const [invoiceData, setInvoiceData] = useState({
    client: '',
    project: '',
    dueDate: '',
    notes: '',
    lineItems: [
      { description: '', quantity: 1, rate: '', amount: 0 }
    ]
  });

  const [taxRate, setTaxRate] = useState(10);

  const clients = [
    "TechCorp Solutions",
    "Digital Marketing Pro",
    "StartupXYZ",
    "Enterprise Systems Ltd",
    "Creative Agency Inc"
  ];

  const projects = [
    "Website Redesign",
    "Mobile App Development",
    "Brand Identity Package",
    "E-commerce Platform",
    "Marketing Campaign"
  ];

  const handleInputChange = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...invoiceData?.lineItems];
    newLineItems[index] = {
      ...newLineItems?.[index],
      [field]: value
    };

    // Calculate amount for this line item
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(newLineItems?.[index]?.quantity) || 0;
      const rate = field === 'rate' ? parseFloat(value) || 0 : parseFloat(newLineItems?.[index]?.rate) || 0;
      newLineItems[index].amount = quantity * rate;
    }

    setInvoiceData(prev => ({
      ...prev,
      lineItems: newLineItems
    }));
  };

  const addLineItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: [
        ...prev?.lineItems,
        { description: '', quantity: 1, rate: '', amount: 0 }
      ]
    }));
  };

  const removeLineItem = (index) => {
    if (invoiceData?.lineItems?.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        lineItems: prev?.lineItems?.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateSubtotal = () => {
    return invoiceData?.lineItems?.reduce((sum, item) => sum + (item?.amount || 0), 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const newInvoice = {
      id: Date.now(),
      invoiceNumber: `INV-${String(Date.now())?.slice(-6)}`,
      client: invoiceData?.client,
      project: invoiceData?.project,
      amount: `$${calculateTotal()?.toFixed(2)}`,
      status: 'Unpaid',
      issueDate: new Date()?.toISOString()?.split('T')?.[0],
      dueDate: invoiceData?.dueDate,
      lineItems: invoiceData?.lineItems,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      notes: invoiceData?.notes
    };

    onCreateInvoice(newInvoice);
    onClose();
    
    // Reset form
    setInvoiceData({
      client: '',
      project: '',
      dueDate: '',
      notes: '',
      lineItems: [
        { description: '', quantity: 1, rate: '', amount: 0 }
      ]
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Invoice"
      size="lg"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Invoice
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Client *
            </label>
            <select
              value={invoiceData?.client}
              onChange={(e) => handleInputChange('client', e?.target?.value)}
              required
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="">Select client...</option>
              {clients?.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Project
            </label>
            <select
              value={invoiceData?.project}
              onChange={(e) => handleInputChange('project', e?.target?.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              <option value="">Select project...</option>
              {projects?.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Input
            label="Due Date *"
            type="date"
            value={invoiceData?.dueDate}
            onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
            required
          />
        </div>

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-card-foreground">Line Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLineItem}
            >
              <Icon name="Plus" size={16} className="mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {invoiceData?.lineItems?.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  <Input
                    label={index === 0 ? "Description" : ""}
                    placeholder="Service description..."
                    value={item?.description}
                    onChange={(e) => handleLineItemChange(index, 'description', e?.target?.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    label={index === 0 ? "Qty" : ""}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item?.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', e?.target?.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    label={index === 0 ? "Rate" : ""}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item?.rate}
                    onChange={(e) => handleLineItemChange(index, 'rate', e?.target?.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    label={index === 0 ? "Amount" : ""}
                    value={`$${item?.amount?.toFixed(2)}`}
                    disabled
                  />
                </div>
                <div className="col-span-1">
                  {invoiceData?.lineItems?.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(index)}
                      className="text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-border pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">${calculateSubtotal()?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Tax:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e?.target?.value) || 0)}
                    className="w-16 px-2 py-1 text-xs border border-border rounded"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
                <span className="font-medium">${calculateTax()?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-border pt-2">
                <span>Total:</span>
                <span>${calculateTotal()?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Notes
          </label>
          <textarea
            value={invoiceData?.notes}
            onChange={(e) => handleInputChange('notes', e?.target?.value)}
            placeholder="Additional notes or terms..."
            rows={3}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateInvoiceModal;