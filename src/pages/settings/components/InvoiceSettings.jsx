import { useState } from "react"

export default function InvoiceSettings() {
  const [settings, setSettings] = useState({
    currency: "INR",
    taxRate: "",
    invoicePrefix: "INV",
    logo: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoUpload = (e) => {
    if (!e.target.files?.[0]) return
    setSettings((prev) => ({
      ...prev,
      logo: URL.createObjectURL(e.target.files[0]),
    }))
  }

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Invoice Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure invoice defaults like currency, tax, and branding
        </p>
      </div>

      <div className="grid gap-6">
        {/* Logo */}
        <div className="flex items-center gap-5">
          {settings.logo ? (
            <img
              src={settings.logo}
              alt="Invoice Logo"
              className="h-16 w-16 rounded-md object-contain border bg-white p-1"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
              Logo
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Invoice Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Appears on top of invoices
            </p>
          </div>
        </div>

        {/* Currency */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">Currency</label>
          <select
            name="currency"
            value={settings.currency}
            onChange={handleChange}
            className="rounded-md border px-4 py-2 text-sm"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        {/* Tax */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">Tax Rate (%)</label>
          <input
            name="taxRate"
            type="number"
            placeholder="18"
            value={settings.taxRate}
            onChange={handleChange}
            className="rounded-md border px-4 py-2 text-sm"
          />
        </div>

        {/* Invoice Prefix */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">Invoice Prefix</label>
          <input
            name="invoicePrefix"
            placeholder="INV"
            value={settings.invoicePrefix}
            onChange={handleChange}
            className="rounded-md border px-4 py-2 text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Example: INV-001, INV-002
          </p>
        </div>

        {/* Save */}
        <div className="pt-2">
          <button className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Save Invoice Settings
          </button>
        </div>
      </div>
    </section>
  )
}
