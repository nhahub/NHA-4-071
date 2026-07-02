import { useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const InstitutionalActivityChart = ({ data }) => {
  const [filter, setFilter] = useState("Enrollment");

  const chartData = data || [
    { month: "JAN", count: 40 },
    { month: "FEB", count: 70 },
    { month: "MAR", count: 100 },
    { month: "APR", count: 150 },
    { month: "MAY", count: 190 },
    { month: "JUN", count: 120 },
    { month: "JUL", count: 80 },
    { month: "AUG", count: 60 },
    { month: "SEP", count: 170 },
    { month: "OCT", count: 200 },
  ];

  return (
    <div className="box-border flex flex-col items-start w-full h-[389px] bg-admin-card border border-admin-border rounded">
      {/* Header with overlay */}
      <div
        className="box-border flex flex-row justify-between items-center px-4 py-4 w-full border-b border-admin-border"
        style={{ background: "rgba(39, 42, 44, 0.5)" }}
      >
        <h4 className="font-heading font-semibold text-lg leading-6 text-admin-text m-0">
          Enrollment Activity Trends
        </h4>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="box-border px-3 py-1.5 font-heading font-normal text-[11px] leading-6 text-admin-text bg-admin-input border border-admin-border rounded appearance-none pr-8 cursor-pointer focus:outline-none"
          >
            <option value="Enrollment">Enrollment</option>
            <option value="Advising">Advising</option>
            <option value="Complaints">Complaints</option>
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-admin-text-muted text-[10px]">
            ▼
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex flex-col justify-end items-start p-6 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: 10,
                fill: "#C2C6D6",
              }}
            />
            <Tooltip
              contentStyle={{
                background: "#323537",
                border: "1px solid #424754",
                borderRadius: "4px",
                fontFamily: "Hanken Grotesk, sans-serif",
                fontSize: "12px",
                color: "#E0E3E5",
              }}
              itemStyle={{ color: "#ADC6FF" }}
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
            />
            <Bar
              dataKey="count"
              fill="rgba(173, 198, 255, 0.4)"
              radius={[2, 2, 0, 0]}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InstitutionalActivityChart;
