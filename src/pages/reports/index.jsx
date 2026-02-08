import { useState } from "react"
import { Download } from "lucide-react"

import Header from "../../components/ui/Header"
import Sidebar from "../../components/ui/Sidebar"
import Breadcrumb from "../../components/ui/Breadcrumb"

import ReportCard from "./components/ReportCard"
import RevenueChart from "./components/RevenueChart"
import ReportFilters from "./components/ReportFilters"
import InvoiceStats from "./components/InvoiceStats"

const ReportsPage = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [exportType, setExportType] = useState(null) // "csv" | "pdf"

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />

      <Header
        sidebarExpanded={sidebarExpanded}
        onMenuToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />

      {/* MAIN CONTENT */}
      <main className="pt-16 lg:ml-60">
        <div className="mx-auto max-w-[1400px] px-6 pb-10">
          <Breadcrumb
            customItems={[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Reports", isLast: true },
            ]}
          />

          {/* PAGE TITLE + EXPORT */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reports</h1>
              <p className="text-muted-foreground">
                Track revenue, invoices, and overall business performance
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setExportType("csv")}
                className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted transition"
              >
                <Download size={16} />
                Export CSV
              </button>

              <button
                onClick={() => setExportType("pdf")}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition"
              >
                <Download size={16} />
                Export PDF
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className="mb-6">
            <ReportFilters />
          </div>

          {/* STATS CARDS */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            <ReportCard title="Total Revenue" value="₹1,25,000" />
            <ReportCard title="Invoices Generated" value="42" />
            <ReportCard title="Paid Invoices" value="34" />
            <ReportCard title="Active Clients" value="18" />
          </div>

          {/* CHART + STATS */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            <InvoiceStats />
          </div>
        </div>
      </main>

      {/* EXPORT MODAL */}
      <ReportFilters
        exportType={exportType}
        onClose={() => setExportType(null)}
      />
    </div>
  )
}

export default ReportsPage
