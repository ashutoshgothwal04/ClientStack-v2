const ContractFilters = () => {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <input
        placeholder="Search contracts..."
        className="h-10 w-64 rounded-md border border-border bg-background px-3 text-sm"
      />

      <select className="h-10 rounded-md border border-border bg-background px-3 text-sm">
        <option>Status</option>
        <option>Draft</option>
        <option>Active</option>
        <option>Expired</option>
      </select>

      <select className="h-10 rounded-md border border-border bg-background px-3 text-sm">
        <option>Date</option>
        <option>This Month</option>
        <option>This Year</option>
      </select>
    </div>
  )
}

export default ContractFilters
