import { useState } from "react"

import Header from "../../components/ui/Header"
import Sidebar from "../../components/ui/Sidebar"
import Breadcrumb from "../../components/ui/Breadcrumb"
import Button from "../../components/ui/Button"
import Icon from "../../components/AppIcon"

import ContractTable from "./components/ContractTable"
import ContractFilters from "./components/ContractFilters"
import ContractModal from "./components/ContractModal"

const initialContracts = [
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

const ContractsPage = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [contracts, setContracts] = useState(initialContracts)

  const handleAddContract = (contract) => {
    setContracts((prev) => [contract, ...prev])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />

      {/* Header */}
      <Header
        sidebarExpanded={sidebarExpanded}
        onMenuToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />

      {/* Main content */}
      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          {/* Breadcrumb */}
          <Breadcrumb
            customItems={[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Contracts", isLast: true },
            ]}
          />

          {/* Page header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Contracts</h1>
              <p className="text-muted-foreground">
                Manage agreements, status, and contract lifecycle
              </p>
            </div>

            <Button onClick={() => setShowCreateModal(true)}>
              <Icon name="Plus" size={16} className="mr-2" />
              New Contract
            </Button>
          </div>

          {/* Filters */}
          <ContractFilters />

          {/* Table */}
          <ContractTable contracts={contracts} />
        </div>
      </main>

      {/* Create modal */}
      <ContractModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleAddContract}
      />
    </div>
  )
}

export default ContractsPage
