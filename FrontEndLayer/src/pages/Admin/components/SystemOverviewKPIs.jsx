const SystemOverviewKPIs = ({ kpis }) => {
  if (!kpis || kpis.length === 0) return null;

  return (
    <div className="flex flex-row justify-center items-start gap-4 w-full">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className="box-border flex flex-col items-start p-5 gap-2 flex-1 bg-admin-card border border-admin-border rounded"
        >
          {/* Label */}
          <span
            className="font-heading font-bold text-[11px] leading-4 uppercase text-admin-text-muted"
            style={{ letterSpacing: "0.55px" }}
          >
            {kpi.label}
          </span>

          {/* Value + Trend */}
          <div className="flex flex-row justify-between items-end w-full mt-1">
            <span
              className="font-heading font-bold text-[32px] leading-[40px] text-admin-text"
              style={{ letterSpacing: "-0.64px" }}
            >
              {kpi.value}
            </span>
            <span
              className="font-courier font-normal text-xs leading-4 mb-2"
              style={{ color: kpi.trendColor || "#C2C6D6" }}
            >
              {kpi.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemOverviewKPIs;
