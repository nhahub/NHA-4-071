import { useEffect } from "react";
import { useAdvisor } from "../../hooks/useAdvisor";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";

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


  const { totalAdvisees, atRiskAdvisees } = dashboardStats;

  return (
    <div className="flex flex-col gap-10" style={{
      background: "linear-gradient(0deg, #121415, #121415), #FFFFFF",
      minHeight: "calc(100vh - 64px)",
      padding: 32,
      overflow: "auto",
    }}>
      <div className="flex flex-row justify-center items-start gap-6 self-stretch">
        <MetricCard label="TOTAL ADVISEES" value={totalAdvisees ?? 0} borderColor="#E7C365">
          <div style={{ width: 22, height: 16, background: "rgba(231, 195, 101, 0.5)" }} />
        </MetricCard>
        <MetricCard label="AT-RISK STUDENTS" value={atRiskAdvisees ?? 0} borderColor="#FFB4AB">
          <div style={{ width: 22, height: 19, background: "rgba(255, 180, 171, 0.5)" }} />
        </MetricCard>
      </div>

      <span className="font-inter text-base leading-6" style={{ color: "#E2E2E3" }}>At-Risk Student Monitoring</span>
      <button onClick={() => {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999';
        modal.innerHTML = '<div style="background:#1E2021;padding:40px;border-radius:12px;max-width:500px;text-align:center"><h2 style="color:#E2E2E3;margin-bottom:16px">At-Risk Students</h2><p style="color:#D0C5B2;margin-bottom:24px">All at-risk students are being monitored. Intervention plans are active.</p><button onclick="this.closest(\'div[style]\').remove()" style="background:#E7C365;color:#121415;border:none;padding:10px 24px;border-radius:8px;font-weight:bold;cursor:pointer">OK</button></div>';
        document.body.appendChild(modal);
      }} className="font-mono text-base leading-6 uppercase bg-transparent border-none cursor-pointer" style={{ color: "#E7C365" }}>View All</button>
    </div>
  );
};

export default AdvisorDashboard;
