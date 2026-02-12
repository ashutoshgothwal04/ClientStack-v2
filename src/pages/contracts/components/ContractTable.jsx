import { useState } from "react"
import ContractStatusBadge from "./ContractStatusBadge"
import ContractActions from "./ContractActions"
import ContractPreviewModal from "./ContractPreviewModal"

const contracts = [
  {
    id: 1,
    client: "Acme Corp",
    title: "Service Agreement",
    value: "₹50,000",
    status: "Active",
  },
  {
    id: 2,
    client: "XYZ Ltd",
    title: "NDA",
    value: "₹0",
    status: "Draft",
  },
]

const ContractTable = ({ contracts }) => {
  const [selectedContract, setSelectedContract] = useState(null)

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Contract</th>
              <th className="px-4 py-3 text-left">Value</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {contracts.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3">{c.client}</td>
                <td className="px-4 py-3">{c.title}</td>
                <td className="px-4 py-3">{c.value}</td>
                <td className="px-4 py-3">
                  <ContractStatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ContractActions onView={() => setSelectedContract(c)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ContractPreviewModal
        contract={selectedContract}
        onClose={() => setSelectedContract(null)}
      />
    </>
  )
}

export default ContractTable
