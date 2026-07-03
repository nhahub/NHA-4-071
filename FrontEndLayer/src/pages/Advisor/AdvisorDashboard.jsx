import { useEffect } from "react";
import { useAdvisor } from "../../hooks/useAdvisor";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
// Icon imports (adjust path if using a different icon library)
import { ArrowUpRight, ChevronLeft, ChevronRight, Bell } from "react-feather";
// Missing component imports
import StatusBadge from "../../shared/components/StatusBadge";
import SessionCard from "../../shared/components/SessionCard";
import AlertItem from "../../shared/components/AlertItem";
import CircularProgress from "../../shared/components/CircularProgress";
import { advisors } from "../../dummyData/advisors";
import AdvisorCard from "../../shared/components/AdvisorCard";

const MetricCard = ({ label, value, borderColor, children, progress }) => (
  <div
    className="flex flex-col items-start p-6 gap-3 min-w-[180px] flex-1"
    style={{ background: "#1E2021", borderLeft: `4px solid ${borderColor || "#E7C365"}` }}
  >
    <div className="flex flex-row justify-between items-start self-stretch">
      <span className="font-mono text-base leading-6 tracking-wider uppercase" style={{ color: "#D0C5B2" }}>
        {label}
      </span>
      {children}
    </div>
    <div className="flex flex-row items-end gap-1 self-stretch">
      <span className="font-inter text-base leading-6" style={{ color: "#E2E2E3" }}>
        {value}
      </span>
    </div>
    {progress !== undefined && (
      <div className="w-full" style={{ background: "#333536", borderRadius: 12, height: 8 }}>
        <div style={{ width: `${Math.min(100, Math.max(0, progress))}%`, background: "#E7C365", borderRadius: 12, height: 8 }} />
      </div>
    )}
  </div>
);

const TrendIndicator = ({ positive, value }) => (
  <div className="flex flex-row items-center gap-1" style={{ padding: "0 0 4px" }}>
    {positive ? (
      <svg width="11.67" height="7" viewBox="0 0 12 8" fill="none">
        <path d="M1 7L5.5 2L10 7" stroke="#E7C365" strokeWidth="1.5" />
      </svg>
    ) : (
      <div style={{ width: 9.33, height: 9.33, background: "#E7C365" }} />
    )}
    <span className="font-mono text-base leading-6" style={{ color: "#E7C365" }}>{value}</span>
  </div>
);

const AdvisorDashboard = () => {
  const { dashboardStats, statsLoading, loadDashboardStats } = useAdvisor();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  if (statsLoading || !dashboardStats) {
    return (
      <div className="flex flex-col gap-6 p-8" style={{ background: "#121415", minHeight: "calc(100vh - 64px)" }}>
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }


  const { metrics, atRiskStudents, todaysSessions, alerts, insights } = dashboardStats;

  return (
    <div className="flex flex-col gap-10" style={{
      background: "linear-gradient(0deg, #121415, #121415), #FFFFFF",
      minHeight: "calc(100vh - 64px)",
      padding: 32,
      overflow: "auto",
}}>
      <div className="flex flex-row justify-center items-start gap-6 self-stretch">
        <MetricCard label="TOTAL ADVISEES" value={metrics.totalAdvisees} borderColor="#E7C365">
          <div style={{ width: 22, height: 16, background: "rgba(231, 195, 101, 0.5)" }} />
        </MetricCard>
        <MetricCard label="AT-RISK STUDENTS" value={metrics.atRiskCount} borderColor="#FFB4AB">
          <div style={{ width: 22, height: 19, background: "rgba(255, 180, 171, 0.5)" }} />
        </MetricCard>
        <MetricCard label="AUDIT COMPLETION" value={`${metrics.auditCompletionPercent}%`} borderColor="#E7C365" progress={metrics.auditCompletionPercent}>
          <div style={{ width: 22, height: 21, background: "rgba(231, 195, 101, 0.5)" }} />
        </MetricCard>
        <MetricCard label="RESPONSE TIME" value={`${metrics.avgResponseHours}h`} borderColor="#E7C365">
          <div style={{ width: 20, height: 20, background: "rgba(231, 195, 101, 0.5)" }} />
        </MetricCard>
      </div>

      <span className="font-inter text-base leading-6" style={{ color: "#E2E2E3" }}>At-Risk Student Monitoring</span>
      <button className="font-mono text-base leading-6 uppercase bg-transparent border-none cursor-pointer" style={{ color: "#E7C365" }}>View All</button>
    </div>
  );
};

export default AdvisorDashboard;
