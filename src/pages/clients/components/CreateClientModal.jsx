import React, { useState } from "react";
import Button from "../../../components/ui/Button";

const CreateClientModal = ({ isOpen, onClose, onCreate }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
    totalInvoices: 0,
    totalRevenue: 0,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onCreate({
      id: Date.now(),
      ...form,
      totalInvoices: Number(form.totalInvoices),
      totalRevenue: Number(form.totalRevenue),
    });

    onClose();
    setForm({
      name: "",
      email: "",
      phone: "",
      status: "Active",
      totalInvoices: 0,
      totalRevenue: 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-background w-full max-w-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Add Client</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Client Name"
            className="input w-full"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input w-full"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone"
            className="input w-full"
            value={form.phone}
            onChange={handleChange}
          />

          <select
            name="status"
            className="input w-full"
            value={form.status}
            onChange={handleChange}
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Prospect</option>
            <option>On Hold</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="totalInvoices"
              type="number"
              placeholder="Total Invoices"
              className="input"
              value={form.totalInvoices}
              onChange={handleChange}
            />

            <input
              name="totalRevenue"
              type="number"
              placeholder="Total Revenue"
              className="input"
              value={form.totalRevenue}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Client</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClientModal;
