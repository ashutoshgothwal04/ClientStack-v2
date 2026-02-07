import { useState } from "react"
import Header from "../../components/ui/Header"
import Sidebar from "../../components/ui/Sidebar"
import Breadcrumb from "../../components/ui/Breadcrumb"

import BusinessSettings from "./components/BusinessSettings"
import InvoiceSettings from "./components/InvoiceSettings"
import ProfileSettings from "./components/ProfileSettings"

const SettingsPage = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

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

      {/* Main Content */}
      <main className="lg:ml-60 pt-16">
        <div className="p-6 max-w-5xl">
          {/* Breadcrumb */}
          <Breadcrumb
            customItems={[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Settings", isLast: true },
            ]}
          />

          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your business, invoices, and profile preferences
            </p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-12">
            <BusinessSettings />
            <InvoiceSettings />
            <ProfileSettings />
          </div>
        </div>
      </main>
    </div>
  )
}

export default SettingsPage
