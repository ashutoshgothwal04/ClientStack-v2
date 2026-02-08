import React from "react";
import Icon from "../../../components/AppIcon";

const ReportCard = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>

          {trend && (
            <p
              className={`text-sm mt-1 ${
                trend > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {trend > 0 ? "+" : ""}
              {trend}% from last month
            </p>
          )}
        </div>

        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name={icon} size={22} className="text-primary" />
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
