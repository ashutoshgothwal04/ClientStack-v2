import React from "react";
import Icon from "../../../components/AppIcon";

const stats = [
  { label: "Paid Invoices", value: 128, icon: "CheckCircle", color: "text-green-600" },
  { label: "Pending", value: 24, icon: "Clock", color: "text-yellow-500" },
  { label: "Overdue", value: 6, icon: "AlertCircle", color: "text-red-500" },
];

const InvoiceStats = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Invoice Status</h3>

      <div className="space-y-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Icon name={item.icon} size={18} className={item.color} />
              <span className="text-sm">{item.label}</span>
            </div>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceStats;
