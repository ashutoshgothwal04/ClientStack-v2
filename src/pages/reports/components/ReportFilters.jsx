import { useState } from "react"
import { Mail } from "lucide-react"
import { toast } from "sonner"

const ReportFilters = ({ exportType, onClose }) => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  // If used only as filters (no exportType), render filters UI
  if (!exportType) {
    return (
      <div className="flex flex-wrap gap-4">
        <select className="h-10 rounded-md border px-3 text-sm">
          <option>Last Month</option>
          <option>This Month</option>
          <option>Last 6 Months</option>
        </select>

        <select className="h-10 rounded-md border px-3 text-sm">
          <option>All Clients</option>
          <option>Active Clients</option>
          <option>Inactive Clients</option>
        </select>
      </div>
    )
  }

  const handleSend = () => {
    if (!email) {
      toast.error("Please enter an email address")
      return
    }

    setLoading(true)

    // simulate backend
    setTimeout(() => {
      setLoading(false)
      setEmail("")
      onClose()
      toast.success(
        `${exportType.toUpperCase()} report sent to ${email}`
      )
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">
          Export {exportType.toUpperCase()} Report
        </h3>

        <p className="text-sm text-muted-foreground mb-4">
          Enter email where the report should be sent
        </p>

        <div className="flex items-center gap-2 border rounded-md px-3 h-11 mb-6">
          <Mail size={16} className="text-muted-foreground" />
          <input
            type="email"
            placeholder="john@example.com"
            className="flex-1 bg-transparent outline-none text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Report"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportFilters
