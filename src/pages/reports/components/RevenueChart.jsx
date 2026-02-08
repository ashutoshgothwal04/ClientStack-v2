import React from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

const data = [
  { month: "Jul 2024", revenue: 9000 },
  { month: "Aug 2024", revenue: 12000 },
  { month: "Sep 2024", revenue: 15000 },
  { month: "Oct 2024", revenue: 18000 },
  { month: "Nov 2024", revenue: 22000 },
  { month: "Dec 2024", revenue: 26000 },
  { month: "Jan 2025", revenue: 30000 },
  { month: "Feb 2025", revenue: 34000 },
  { month: "Mar 2025", revenue: 38000 },
  { month: "Apr 2025", revenue: 42000 },
  { month: "May 2025", revenue: 47000 },
  { month: "Jun 2025", revenue: 52000 },
]

const RevenueChart = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Revenue Overview</h3>
        <span className="text-sm text-muted-foreground">
          Last 12 Months
        </span>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
              }}
              formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              fill="url(#revenueGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RevenueChart
