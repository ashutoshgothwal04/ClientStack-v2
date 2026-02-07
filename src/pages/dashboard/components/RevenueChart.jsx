import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data = [], loading = false }) => {
  const defaultData = [
    { month: 'Jan', revenue: 12500, projects: 8 },
    { month: 'Feb', revenue: 15200, projects: 12 },
    { month: 'Mar', revenue: 18900, projects: 15 },
    { month: 'Apr', revenue: 22100, projects: 18 },
    { month: 'May', revenue: 19800, projects: 16 },
    { month: 'Jun', revenue: 25400, projects: 22 },
    { month: 'Jul', revenue: 28900, projects: 25 },
    { month: 'Aug', revenue: 31200, projects: 28 }
  ];

  const chartData = data?.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 elevation-3">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-success">
              Revenue: ${payload?.[0]?.value?.toLocaleString()}
            </p>
            <p className="text-sm text-primary">
              Projects: {payload?.[0]?.payload?.projects}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 elevation-2">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-48 mb-6"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Revenue Trends</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-muted-foreground">Monthly Revenue</span>
          </div>
        </div>
      </div>
      <div className="w-full h-64" aria-label="Monthly Revenue Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="revenue" 
              fill="var(--color-primary)" 
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;