import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProjectFilters = ({ onFilterChange, activeFilters = {} }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    search: activeFilters?.search || '',
    status: activeFilters?.status || 'all',
    client: activeFilters?.client || 'all',
    priority: activeFilters?.priority || 'all',
    teamMember: activeFilters?.teamMember || 'all',
    dateRange: activeFilters?.dateRange || 'all'
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Planning', label: 'Planning' }
  ];

  const clientOptions = [
    { value: 'all', label: 'All Clients' },
    { value: 'TechCorp Solutions', label: 'TechCorp Solutions' },
    { value: 'Digital Marketing Pro', label: 'Digital Marketing Pro' },
    { value: 'StartupXYZ', label: 'StartupXYZ' },
    { value: 'E-commerce Plus', label: 'E-commerce Plus' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'High', label: 'High Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'Low', label: 'Low Priority' }
  ];

  const teamMemberOptions = [
    { value: 'all', label: 'All Team Members' },
    { value: 'Sarah Johnson', label: 'Sarah Johnson' },
    { value: 'Mike Chen', label: 'Mike Chen' },
    { value: 'Emily Davis', label: 'Emily Davis' },
    { value: 'Alex Rodriguez', label: 'Alex Rodriguez' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Due Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      status: 'all',
      client: 'all',
      priority: 'all',
      teamMember: 'all',
      dateRange: 'all'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters)?.filter(value => value !== 'all' && value !== '')?.length;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Filters</h3>
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <span className="text-sm text-muted-foreground">
              {getActiveFilterCount()} active
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Icon name={showAdvanced ? "ChevronUp" : "ChevronDown"} size={16} />
            {showAdvanced ? 'Less' : 'More'} Filters
          </Button>
        </div>
      </div>
      {/* Search and Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <Input
            type="search"
            placeholder="Search projects..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        <div>
          <select
            value={filters?.status}
            onChange={(e) => handleFilterChange('status', e?.target?.value)}
            className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {statusOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filters?.client}
            onChange={(e) => handleFilterChange('client', e?.target?.value)}
            className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {clientOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filters?.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e?.target?.value)}
            className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {dateRangeOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Priority
            </label>
            <select
              value={filters?.priority}
              onChange={(e) => handleFilterChange('priority', e?.target?.value)}
              className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {priorityOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Team Member
            </label>
            <select
              value={filters?.teamMember}
              onChange={(e) => handleFilterChange('teamMember', e?.target?.value)}
              className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {teamMemberOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {/* Clear Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="flex justify-end pt-4 border-t border-border mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
          >
            <Icon name="X" size={16} />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;