import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';


const RevenueAnalytics = () => {
  const [activeTab, setActiveTab] = useState('monthly');

  const monthlyData = [
    { month: 'Jan', revenue: 12500, invoices: 15, paid: 11200, outstanding: 1300 },
    { month: 'Feb', revenue: 18200, invoices: 22, paid: 16800, outstanding: 1400 },
    { month: 'Mar', revenue: 15800, invoices: 19, paid: 14200, outstanding: 1600 },
    { month: 'Apr', revenue: 22100, invoices: 28, paid: 20500, outstanding: 1600 },
    { month: 'May', revenue: 19500, invoices: 24, paid: 17800, outstanding: 1700 },
    { month: 'Jun', revenue: 25300, invoices: 31, paid: 23100, outstanding: 2200 },
    { month: 'Jul', revenue: 28700, invoices: 35, paid: 26200, outstanding: 2500 },
    { month: 'Aug', revenue: 24900, invoices: 29, paid: 22400, outstanding: 2500 }
  ];

  const clientRevenueData = [
    { name: 'TechCorp Solutions', value: 45200, color: '#2563EB' },
    { name: 'Digital Marketing Pro', value: 32800, color: '#0EA5E9' },
    { name: 'StartupXYZ', value: 28500, color: '#059669' },
    { name: 'Enterprise Systems', value: 22100, color: '#D97706' },
    { name: 'Creative Agency', value: 18400, color: '#DC2626' },
    { name: 'Others', value: 15600, color: '#64748B' }
  ];

  const paymentStatusData = [
    { name: 'Paid', value: 78, color: '#059669' },
    { name: 'Unpaid', value: 15, color: '#D97706' },
    { name: 'Overdue', value: 7, color: '#DC2626' }
  ];

  const tabs = [
    { id: 'monthly', label: 'Monthly Trends', icon: 'TrendingUp' },
    { id: 'clients', label: 'Top Clients', icon: 'Users' },
    { id: 'status', label: 'Payment Status', icon: 'PieChart' }
  ];

  const totalRevenue = monthlyData?.reduce((sum, item) => sum + item?.revenue, 0);
  const totalOutstanding = monthlyData?.reduce((sum, item) => sum + item?.outstanding, 0);
  const averageInvoiceValue = totalRevenue / monthlyData?.reduce((sum, item) => sum + item?.invoices, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 elevation-3">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: ${entry?.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-card-foreground">
                ${totalRevenue?.toLocaleString()}
              </p>
              <p className="text-xs text-success flex items-center mt-1">
                <Icon name="TrendingUp" size={12} className="mr-1" />
                +12.5% from last period
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={24} className="text-success" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <p className="text-2xl font-bold text-card-foreground">
                ${totalOutstanding?.toLocaleString()}
              </p>
              <p className="text-xs text-warning flex items-center mt-1">
                <Icon name="Clock" size={12} className="mr-1" />
                Pending collection
              </p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertCircle" size={24} className="text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Invoice</p>
              <p className="text-2xl font-bold text-card-foreground">
                ${Math.round(averageInvoiceValue)?.toLocaleString()}
              </p>
              <p className="text-xs text-accent flex items-center mt-1">
                <Icon name="BarChart3" size={12} className="mr-1" />
                Per invoice value
              </p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Receipt" size={24} className="text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Collection Rate</p>
              <p className="text-2xl font-bold text-card-foreground">92.3%</p>
              <p className="text-xs text-success flex items-center mt-1">
                <Icon name="CheckCircle" size={12} className="mr-1" />
                Payment success rate
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Target" size={24} className="text-primary" />
            </div>
          </div>
        </div>
      </div>
      {/* Analytics Charts */}
      <div className="bg-card border border-border rounded-lg">
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-card-foreground">Revenue Analytics</h3>
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                    activeTab === tab?.id
                      ? 'bg-background text-card-foreground elevation-1'
                      : 'text-muted-foreground hover:text-card-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'monthly' && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outstanding" fill="var(--color-warning)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clientRevenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {clientRevenueData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value?.toLocaleString()}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {clientRevenueData?.map((client, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: client?.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">
                        {client?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${client?.value?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentStatusData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-6 flex justify-center space-x-8">
                {paymentStatusData?.map((status, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-sm font-medium text-card-foreground">
                        {status.name}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-card-foreground">
                      {status.value}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;