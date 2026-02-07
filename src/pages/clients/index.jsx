import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import Breadcrumb from "../../components/ui/Breadcrumb";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";

import ClientTable from "./components/ClientTable";
import ClientFilters from "./components/ClientFilters";
import CreateClientModal from "./components/CreateClientModal";
import ClientPreviewModal from "./components/ClientPreviewModal";

const DEFAULT_FILTERS = {
  search: "",
  status: "",
  minRevenue: "",
  minInvoices: "",
  sortBy: "",
  sortOrder: "desc",
};

const Clients = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [clients, setClients] = useState([
    {
      id: 1,
      name: "TechCorp Solutions",
      email: "contact@techcorp.com",
      totalInvoices: 5,
      totalRevenue: 15250,
      status: "Active",
    },
    {
      id: 2,
      name: "Digital Marketing Pro",
      email: "hello@digitalpro.com",
      totalInvoices: 3,
      totalRevenue: 8300,
      status: "Active",
    },
    {
      id: 3,
      name: "StartupXYZ",
      email: "founder@startupxyz.io",
      totalInvoices: 2,
      totalRevenue: 7200,
      status: "Inactive",
    },
  ]);

  /* 🔗 Sync URL → State */
  useEffect(() => {
    const urlFilters = Object.fromEntries(searchParams.entries());
    setFilters({ ...DEFAULT_FILTERS, ...urlFilters });
  }, []);

  /* 🔗 Sync State → URL */
  useEffect(() => {
    setSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      )
    );
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchParams({});
  };

  /* 🧠 Filter + Sort Logic */
  const filteredClients = useMemo(() => {
    let data = [...clients];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    if (filters.status) {
      data = data.filter((c) => c.status === filters.status);
    }

    if (filters.minRevenue) {
      data = data.filter(
        (c) => c.totalRevenue >= Number(filters.minRevenue)
      );
    }

    if (filters.minInvoices) {
      data = data.filter(
        (c) => c.totalInvoices >= Number(filters.minInvoices)
      );
    }

    if (filters.sortBy) {
      data.sort((a, b) => {
        const valA =
          filters.sortBy === "revenue"
            ? a.totalRevenue
            : a.totalInvoices;
        const valB =
          filters.sortBy === "revenue"
            ? b.totalRevenue
            : b.totalInvoices;

        return filters.sortOrder === "asc" ? valA - valB : valB - valA;
      });
    }

    return data;
  }, [clients, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />
      <Header
        onMenuToggle={() => setSidebarExpanded(!sidebarExpanded)}
        sidebarExpanded={sidebarExpanded}
      />

      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          <Breadcrumb
            customItems={[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Clients", isLast: true },
            ]}
          />

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Clients</h1>
              <p className="text-muted-foreground">
                Manage your customers and billing relationships
              </p>
            </div>

            <Button onClick={() => setShowCreateModal(true)}>
              <Icon name="Plus" size={16} className="mr-2" />
              Add Client
            </Button>
          </div>

          <ClientFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <ClientTable
            clients={filteredClients}
            onView={setSelectedClient}
          />
        </div>
      </main>

      <CreateClientModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(client) => setClients((p) => [client, ...p])}
      />

      <ClientPreviewModal
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
      />
    </div>
  );
};

export default Clients;
