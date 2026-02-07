import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const InvoiceFilters = ({ onFilterChange, onExport }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    client: '',
    dateRange: 'all',
    amountMin: '',
    amountMax: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'partial', label: 'Partial' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: 'all',
      client: '',
      dateRange: 'all',
      amountMin: '',
      amountMax: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value !== '' && value !== 'all'
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Status
          </label>
          <select
            value={filters?.status}
            onChange={(e) => handleFilterChange('status', e?.target?.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {statusOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Client
          </label>
          <Input
            type="text"
            placeholder="Search client..."
            value={filters?.client}
            onChange={(e) => handleFilterChange('client', e?.target?.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Date Range
          </label>
          <select
            value={filters?.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e?.target?.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {dateRangeOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex-1"
          >
            <Icon name="Filter" size={16} className="mr-2" />
            Advanced
          </Button>
          <Button
            variant="outline"
            onClick={onExport}
          >
            <Icon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Amount Range
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min amount"
                  value={filters?.amountMin}
                  onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max amount"
                  value={filters?.amountMax}
                  onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
                />
              </div>
            </div>

            {filters?.dateRange === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Custom Date Range
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="date"
                    onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="date"
                    onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Filter Actions */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Active filters applied
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            <Icon name="X" size={16} className="mr-2" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilters;