import { useState } from "react"
import Button from "../../../components/ui/Button"
import Icon from "../../../components/AppIcon"

const ContractModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    client: "",
    value: "",
    startDate: "",
    endDate: "",
  })

  if (!isOpen) return null

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSave({
      ...form,
      id: Date.now(),
      status: "Draft",
      createdAt: new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card w-full max-w-lg rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">New Contract</h3>
          <button onClick={onClose}>
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            name="title"
            placeholder="Contract Title"
            className="w-full input"
            onChange={handleChange}
          />
          <input
            name="client"
            placeholder="Client Name"
            className="w-full input"
            onChange={handleChange}
          />
          <input
            name="value"
            placeholder="Contract Value"
            className="w-full input"
            onChange={handleChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="startDate"
              className="input"
              onChange={handleChange}
            />
            <input
              type="date"
              name="endDate"
              className="input"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Contract
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ContractModal
