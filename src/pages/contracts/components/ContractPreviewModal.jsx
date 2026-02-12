const ContractPreviewModal = ({ contract, onClose }) => {
  if (!contract) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Contract Details</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Client</span>
            <p className="font-medium">{contract.client}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Contract</span>
            <p className="font-medium">{contract.title}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Value</span>
            <p className="font-medium">{contract.value}</p>
          </div>

          <div>
            <span className="text-muted-foreground">Status</span>
            <p className="font-medium">{contract.status}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-md border border-border px-4 py-2 text-sm">
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContractPreviewModal
