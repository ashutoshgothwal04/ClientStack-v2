// path : components/pages/BillingInvoices.jsx:

import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import InvoiceTable from './components/InvoiceTable';
import InvoiceFilters from './components/InvoiceFilters';
import CreateInvoiceModal from './components/CreateInvoiceModal';
import RevenueAnalytics from './components/RevenueAnalytics';
import InvoicePreviewModal from './components/InvoicePreviewModal';
import { toast } from "sonner";
import { Link } from 'react-router-dom';

const BillingInvoices = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('invoices');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);

  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: "INV-001234",
      client: "TechCorp Solutions",
      amount: "$5,250.00",
      status: "Paid",
      issueDate: "2025-07-15",
      dueDate: "2025-08-14",
      project: "Website Redesign",
      lineItems: [
        { description: "UI/UX Design", quantity: 40, rate: 85, amount: 3400 },
        { description: "Frontend Development", quantity: 30, rate: 95, amount: 2850 }
      ],
      subtotal: 6250,
      tax: 625,
      total: 6875,
      notes: "Thank you for your business. Payment terms: Net 30 days."
    },
    {
      id: 2,
      invoiceNumber: "INV-001235",
      client: "Digital Marketing Pro",
      amount: "$3,800.00",
      status: "Unpaid",
      issueDate: "2025-07-20",
      dueDate: "2025-08-19",
      project: "SEO Campaign",
      lineItems: [
        { description: "SEO Audit & Strategy", quantity: 1, rate: 1500, amount: 1500 },
        { description: "Content Creation", quantity: 20, rate: 75, amount: 1500 }
      ],
      subtotal: 3000,
      tax: 300,
      total: 3300,
      notes: "Monthly SEO services as per agreement."
    },
    {
      id: 3,
      invoiceNumber: "INV-001236",
      client: "StartupXYZ",
      amount: "$7,200.00",
      status: "Overdue",
      issueDate: "2025-06-25",
      dueDate: "2025-07-25",
      project: "Mobile App Development",
      lineItems: [
        { description: "App Development", quantity: 60, rate: 110, amount: 6600 },
        { description: "Testing & QA", quantity: 15, rate: 80, amount: 1200 }
      ],
      subtotal: 7800,
      tax: 780,
      total: 8580,
      notes: "Final milestone payment for mobile app project."
    },
    {
      id: 4,
      invoiceNumber: "INV-001237",
      client: "Enterprise Systems Ltd",
      amount: "$12,500.00",
      status: "Partial",
      issueDate: "2025-07-28",
      dueDate: "2025-08-27",
      project: "System Integration",
      lineItems: [
        { description: "System Analysis", quantity: 40, rate: 120, amount: 4800 },
        { description: "Integration Development", quantity: 80, rate: 130, amount: 10400 }
      ],
      subtotal: 15200,
      tax: 1520,
      total: 16720,
      notes: "Enterprise system integration project - Phase 2."
    },
    {
      id: 5,
      invoiceNumber: "INV-001238",
      client: "Creative Agency Inc",
      amount: "$4,100.00",
      status: "Unpaid",
      issueDate: "2025-08-01",
      dueDate: "2025-08-31",
      project: "Brand Identity Package",
      lineItems: [
        { description: "Logo Design", quantity: 1, rate: 2000, amount: 2000 },
        { description: "Brand Guidelines", quantity: 1, rate: 1500, amount: 1500 }
      ],
      subtotal: 3500,
      tax: 350,
      total: 3850,
      notes: "Complete brand identity package including logo and guidelines."
    }
  ]);

  const handleMenuToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleCreateInvoice = (newInvoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPreviewModal(true);
  };

  const handleEditInvoice = (invoice) => {
    console.log('Edit invoice:', invoice?.invoiceNumber);
    // In a real app, this would open an edit modal
  };

  const handleDeleteInvoice = (invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice?.invoiceNumber}?`)) {
      setInvoices(prev => prev?.filter(inv => inv?.id !== invoice?.id));
    }
  };

  const handleFilterChange = (filters) => {
    console.log('Filters changed:', filters);
    // In a real app, this would filter the invoices
  };

  const handleExport = () => {
    console.log('Exporting invoices...');
    // In a real app, this would export the data
  };

  const handleCreateFromProject = () => {
    console.log('Creating invoice from project tasks...');
    setShowCreateDropdown(false);
    setShowCreateModal(true);
  };

  const handleManualCreate = () => {
    setShowCreateDropdown(false);
    setShowCreateModal(true);
  };

  const tabs = [
    { id: 'invoices', label: 'Invoices', icon: 'Receipt', count: invoices?.length },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Billing & Invoices', path: '/billing-invoices', isLast: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isExpanded={sidebarExpanded} onToggle={handleMenuToggle} />
      <Header onMenuToggle={handleMenuToggle} sidebarExpanded={sidebarExpanded} />
      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          <Breadcrumb customItems={breadcrumbItems} />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground mb-2">
                Billing & Invoices
              </h1>
              <p className="text-muted-foreground">
                Manage invoices, track payments, and analyze revenue performance
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <div className="relative">
                <Button
                  onClick={() => setShowCreateDropdown(!showCreateDropdown)}
                  className="flex items-center space-x-2"
                >
                  <Icon name="Plus" size={16} />
                  <span>Create Invoice</span>
                  <Icon name="ChevronDown" size={16} />
                </Button>
                
                {showCreateDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg elevation-3 z-300">
                    <div className="py-2">
                      <button
                        onClick={handleManualCreate}
                        className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-smooth flex items-center space-x-3"
                      >
                        <Icon name="FileText" size={16} />
                        <div>
                          <p className="font-medium">Manual Invoice</p>
                          <p className="text-xs text-muted-foreground">Create from scratch</p>
                        </div>
                      </button>
                      <button
                        onClick={handleCreateFromProject}
                        className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-smooth flex items-center space-x-3"
                      >
                        <Icon name="Zap" size={16} />
                        <div>
                          <p className="font-medium">From Project</p>
                          <p className="text-xs text-muted-foreground">Auto-generate from tasks</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Link to='/settings'>
              <Button variant="outline">
                <Icon name="Settings" size={16} className="mr-2" />
                Settings
              </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1 mb-6 w-fit">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                  activeTab === tab?.id
                    ? 'bg-background text-card-foreground elevation-1'
                    : 'text-muted-foreground hover:text-card-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
                {tab?.count && (
                  <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                    {tab?.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <InvoiceFilters 
                onFilterChange={handleFilterChange}
                onExport={handleExport}
              />
              
              <InvoiceTable
                invoices={invoices}
                onViewInvoice={handleViewInvoice}
                onEditInvoice={handleEditInvoice}
                onDeleteInvoice={handleDeleteInvoice}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <RevenueAnalytics />
          )}
        </div>
      </main>
      {/* Modals */}
      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateInvoice={handleCreateInvoice}
      />
      <InvoicePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        invoice={selectedInvoice}
      />
    </div>
  );
};

export default BillingInvoices;