import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const ClientFilters = ({ filters, onChange, onReset }) => {
  return (
    <div className="mb-6 rounded-xl border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search name or email"
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        />

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Min Revenue */}
        <input
          type="number"
          placeholder="Min Revenue"
          value={filters.minRevenue}
          onChange={(e) => onChange("minRevenue", e.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        />

        {/* Min Invoices */}
        <input
          type="number"
          placeholder="Min Invoices"
          value={filters.minInvoices}
          onChange={(e) => onChange("minInvoices", e.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        />

        {/* Sort By */}
        <select
          value={filters.sortBy}
          onChange={(e) => onChange("sortBy", e.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">Sort By</option>
          <option value="revenue">Revenue</option>
          <option value="invoices">Invoices</option>
        </select>

        {/* Sort Order */}
        <select
          value={filters.sortOrder}
          onChange={(e) => onChange("sortOrder", e.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="desc">High → Low</option>
          <option value="asc">Low → High</option>
        </select>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={onReset}>
          <Icon name="RotateCcw" size={16} className="mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default ClientFilters;
