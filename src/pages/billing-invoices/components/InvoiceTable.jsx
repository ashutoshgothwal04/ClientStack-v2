import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoiceTable = ({ invoices, onViewInvoice, onEditInvoice, onDeleteInvoice }) => {
  const [sortField, setSortField] = useState('issueDate');
  const [sortDirection, setSortDirection] = useState('desc');

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedInvoices = [...invoices]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'amount') {
      aValue = parseFloat(aValue?.replace(/[$,]/g, ''));
      bValue = parseFloat(bValue?.replace(/[$,]/g, ''));
    } else if (sortField === 'issueDate' || sortField === 'dueDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortDirection === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('invoiceNumber')}
                  className="flex items-center space-x-2 text-sm font-medium text-card-foreground hover:text-primary transition-smooth"
                >
                  <span>Invoice #</span>
                  <SortIcon field="invoiceNumber" />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('client')}
                  className="flex items-center space-x-2 text-sm font-medium text-card-foreground hover:text-primary transition-smooth"
                >
                  <span>Client</span>
                  <SortIcon field="client" />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-2 text-sm font-medium text-card-foreground hover:text-primary transition-smooth"
                >
                  <span>Amount</span>
                  <SortIcon field="amount" />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-2 text-sm font-medium text-card-foreground hover:text-primary transition-smooth"
                >
                  <span>Status</span>
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('issueDate')}
                  className="flex items-center space-x-2 text-sm font-medium text-card-foreground hover:text-primary transition-smooth"
                >
                  <span>Issue Date</span>
                  <SortIcon field="issueDate" />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('dueDate')}
                  className="flex items-center space-x-2 text-sm font-medium text-card-foreground hover:text-primary transition-smooth"
                >
                  <span>Due Date</span>
                  <SortIcon field="dueDate" />
                </button>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-card-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedInvoices?.map((invoice) => (
              <tr key={invoice?.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                <td className="p-4">
                  <span className="font-mono text-sm font-medium text-primary">
                    {invoice?.invoiceNumber}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {invoice?.client?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-card-foreground">
                      {invoice?.client}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-semibold text-card-foreground">
                    {invoice?.amount}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice?.status)}`}>
                    {invoice?.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(invoice.issueDate)?.toLocaleDateString()}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(invoice.dueDate)?.toLocaleDateString()}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewInvoice(invoice)}
                      className="h-8 w-8"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditInvoice(invoice)}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteInvoice(invoice)}
                      className="h-8 w-8 text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;