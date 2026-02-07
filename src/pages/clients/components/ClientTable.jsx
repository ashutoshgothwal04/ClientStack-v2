import React from "react";
import Icon from "../../../components/AppIcon";

const ClientTable = ({ clients, onView, onDelete }) => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="text-left px-4 py-3 text-sm">Client</th>
            <th className="text-left px-4 py-3 text-sm">Email</th>
            <th className="text-center px-4 py-3 text-sm">Invoices</th>
            <th className="text-right px-4 py-3 text-sm">Revenue</th>
            <th className="text-center px-4 py-3 text-sm">Status</th>
            <th className="text-right px-4 py-3 text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id} className="border-t border-border">
              <td className="px-4 py-3 font-medium">{c.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
              <td className="px-4 py-3 text-center">{c.totalInvoices}</td>
              <td className="px-4 py-3 text-right">${c.totalRevenue.toLocaleString()}</td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  c.status === "Active"
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {c.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <button onClick={() => onView(c)}>
                  <Icon name="Eye" size={16} />
                </button>
                <button onClick={() => onDelete(c)} className="text-error">
                  <Icon name="Trash2" size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
