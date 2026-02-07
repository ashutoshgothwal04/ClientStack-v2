import { useState } from "react"

export default function BusinessSettings() {
  const [business, setBusiness] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setBusiness((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Business Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your business information shown on invoices
        </p>
      </div>

      <div className="grid gap-5">
        <div className="grid gap-1">
          <label className="text-sm font-medium">Business Name</label>
          <input
            name="name"
            placeholder="Your Company Pvt Ltd"
            value={business.name}
            onChange={handleChange}
            className="input border rounded-md px-4 py-2"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Business Email</label>
          <input
            name="email"
            type="email"
            placeholder="billing@company.com"
            value={business.email}
            onChange={handleChange}
            className="input border rounded-md px-4 py-2"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Phone Number</label>
          <input
            name="phone"
            placeholder="+91 12345 67890"
            value={business.phone}
            onChange={handleChange}
            className="input border rounded-md px-4 py-2"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Business Address</label>
          <textarea
            name="address"
            rows={3}
            placeholder="Street, City, State, Country"
            value={business.address}
            onChange={handleChange}
            className="input border rounded-md px-4 py-2 resize-none"
          />
        </div>

        <div className="pt-2">
          <button className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Save Business Info
          </button>
        </div>
      </div>
    </section>
  )
}
