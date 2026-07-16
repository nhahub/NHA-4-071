import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const InstitutionalActivityChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="box-border flex flex-col items-center justify-center w-full h-[389px] bg-admin-card border border-admin-border rounded">
        <span className="font-heading text-sm text-admin-text-muted">No enrollment data available yet.</span>
      </div>
    );
  }

  return (
    <div className="box-border flex flex-col items-start w-full h-[389px] bg-admin-card border border-admin-border rounded">
      <div
        className="box-border flex flex-row justify-between items-center px-4 py-4 w-full border-b border-admin-border"
        style={{ background: "rgba(39, 42, 44, 0.5)" }}
      >
        <h4 className="font-heading font-semibold text-lg leading-6 text-admin-text m-0">
          Enrollment Activity Trends
        </h4>
      </div>

      <div className="flex flex-col justify-end items-start p-6 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
