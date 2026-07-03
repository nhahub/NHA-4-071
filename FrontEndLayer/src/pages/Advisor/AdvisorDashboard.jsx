import { useEffect } from "react";
import { useAdvisor } from "../../hooks/useAdvisor";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { ArrowUpRight, ChevronLeft, ChevronRight, Bell } from "lucide-react";

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

const TrendBadge = ({ value, positive }) => (
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

const StatusBadge = ({ status }) => {
  const isCritical = status === "critical";
  return (
    <div
      className="flex flex-row items-start px-2 py-[0.5px]"
      style={{
        background: isCritical ? "#93000A" : "rgba(124, 45, 18, 0.4)",
        borderRadius: 2,
      }}
    >
      <span
        className="font-inter font-bold text-[10px] leading-[15px] uppercase"
        style={{ color: isCritical ? "#FFDAD6" : "#FED7AA" }}
      >
        {isCritical ? "CRITICAL" : "WARNING"}
      </span>
    </div>
  );
};

const SessionCard = ({ session }) => {
  const isActive = session.status === "scheduled" && session._id === "as004";
  return (
    <div
      className="flex flex-row items-center p-3 gap-6 self-stretch"
      style={{
        background: isActive ? "#282A2B" : "#1A1C1D",
        opacity: isActive ? 1 : 0.8,
        borderLeft: `4px solid ${isActive ? "#E7C365" : "rgba(77, 70, 55, 0.3)"}`,
      }}
    >
      <div className="flex flex-col items-center min-w-[60px]">
        <span className="font-mono text-base leading-6 text-center" style={{ color: isActive ? "#E7C365" : "#D0C5B2" }}>
          {session.time}
        </span>
        <span className="font-inter text-[10px] leading-[15px] uppercase text-center" style={{ color: "#D0C5B2" }}>
          {session.date?.slice(-5) || ""}
        </span>
      </div>
      <div className="flex flex-col flex-1">
        <span className="font-inter font-semibold text-base leading-6" style={{ color: isActive ? "#E2E2E3" : "#D0C5B2" }}>
          {session.title}
        </span>
        <span className="font-inter text-base leading-6" style={{ color: isActive ? "#D0C5B2" : "rgba(208, 197, 178, 0.6)" }}>
          {session.location} • {session.type}
        </span>
      </div>
      {isActive && (
        <div
          className="flex flex-col justify-center items-center px-3 py-1"
          style={{
            background: "rgba(231, 195, 101, 0.1)",
            border: "1px solid rgba(231, 195, 101, 0.2)",
            borderRadius: 2,
          }}
        >
          <span className="font-inter font-bold text-base leading-6 uppercase text-center" style={{ color: "#E7C365" }}>
            Join
          </span>
        </div>
      )}
    </div>
  );
};

const AlertItem = ({ alert }) => {
  const isUrgent = alert.type === "urgent";
  const dotColor = isUrgent ? "#E7C365" : "#4D4637";
  const borderColor = isUrgent ? "rgba(231, 195, 101, 0.3)" : "rgba(77, 70, 55, 0.3)";
  const titleColor = isUrgent ? "#E7C365" : "#D0C5B2";
  const textColor = isUrgent ? "#E2E2E3" : "#D0C5B2";

  return (
    <div className="flex flex-col items-start gap-1 self-stretch relative pl-6" style={{ borderLeft: `1px solid ${borderColor}`, padding: "4px 0 4px 24px" }}>
      <div className="flex flex-row items-center gap-2">
        <span className="font-mono text-base leading-6 uppercase" style={{ color: titleColor }}>
          {alert.title}
        </span>
        <span className="font-inter text-[10px] leading-[15px]" style={{ color: "#D0C5B2" }}>
          {new Date(alert.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
      <span className="font-inter text-base leading-6" style={{ color: textColor }}>
        {alert.message}
      </span>
      <div className="absolute" style={{ left: -4, top: 8 }}>
        <div
          className="relative"
          style={{
            width: 8,
            height: 8,
            background: dotColor,
            borderRadius: 12,
            boxShadow: isUrgent ? `0 0 0 4px ${dotColor}1A` : "none",
          }}
        />
      </div>
    </div>
  );
};

const CircularProgress = ({ value, label }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="128" height="128" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#333536" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={radius}
          fill="none" stroke="#E7C365" strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col items-center" style={{ marginTop: -80 }}>
        <span className="font-inter font-bold text-2xl leading-8" style={{ color: "#E2E2E3" }}>
          {value}%
        </span>
        <span className="font-inter text-[10px] leading-[15px] uppercase" style={{ color: "#D0C5B2" }}>
          {label}
        </span>
      </div>
    </div>
  );
};

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

      <div className="flex gap-6 self-stretch">
        <div className="flex flex-col gap-6 flex-[2] min-w-0">
          <div className="flex flex-col" style={{ background: "#1E2021", border: "1px solid rgba(77, 70, 55, 0.1)", borderRadius: 4 }}>
            <div
              className="flex flex-row justify-between items-center px-6 py-3"
              style={{ background: "#282A2B", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
            >
              <span className="font-inter text-base leading-6" style={{ color: "#E2E2E3" }}>
                At-Risk Student Monitoring
              </span>
              <button className="font-mono text-base leading-6 uppercase bg-transparent border-none cursor-pointer" style={{ color: "#E7C365" }}>
                View All
              </button>
            </div>
            <div className="flex flex-col overflow-auto">
              <div className="flex flex-row" style={{ background: "rgba(51, 53, 54, 0.3)" }}>
                <div className="flex flex-col px-6 py-[23.5px] flex-1 min-w-[120px]">
                  <span className="font-mono font-bold text-base leading-6 tracking-wider uppercase" style={{ color: "#D0C5B2" }}>
                    Name
                  </span>
                </div>
                <div className="flex flex-col px-6 py-3 w-[100px]">
                  <span className="font-mono font-bold text-base leading-6 tracking-wider uppercase" style={{ color: "#D0C5B2" }}>
                    Status
                  </span>
                </div>
                <div className="flex flex-col px-6 py-[23.5px] w-[80px]">
                  <span className="font-mono font-bold text-base leading-6 tracking-wider uppercase" style={{ color: "#D0C5B2" }}>
                    GPA
                  </span>
                </div>
                <div className="flex flex-col px-6 py-3 w-[130px]">
                  <span className="font-mono font-bold text-base leading-6 tracking-wider uppercase" style={{ color: "#D0C5B2" }}>
                    Last Session
                  </span>
                </div>
                <div className="flex flex-col px-6 py-[23.5px] w-[50px]" />
              </div>
              {atRiskStudents.map((student, idx) => {
                const initials = student.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                const bgColors = ["#C9A74D", "#454749", "#C9A74D"];
                const textColors = ["#503D00", "#B4B5B7", "#503D00"];
                const bgIdx = idx % 3;
                return (
                  <div
                    key={student._id}
                    className="flex flex-row items-center pl-6 self-stretch"
                    style={{ borderTop: idx > 0 ? "1px solid rgba(255, 255, 255, 0.05)" : "none" }}
                  >
                    <div className="flex flex-row items-center gap-3 flex-1 min-w-[120px]" style={{ padding: "24px 0" }}>
                      <div
                        className="flex flex-row justify-center items-center"
                        style={{ width: 26, height: 32, background: bgColors[bgIdx], borderRadius: 2 }}
                      >
                        <span className="font-inter font-bold text-base leading-6 text-center" style={{ color: textColors[bgIdx] }}>
                          {initials}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-inter text-base leading-6" style={{ color: "#E2E2E3" }}>
                          {student.name}
                        </span>
                        <span className="font-inter text-xs leading-[18px]" style={{ color: "#D0C5B2" }}>
                          {student.universityId}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col px-6 w-[100px]">
                      <StatusBadge status={student.status} />
                    </div>
                    <div className="flex flex-col px-6 w-[80px]">
                      <span className="font-mono text-base leading-6" style={{ color: "#E2E2E3" }}>
                        {student.GPA.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-col px-6 w-[130px]">
                      <span className="font-inter text-base leading-6" style={{ color: "#D0C5B2" }}>
                        {student.lastSession}
                      </span>
                    </div>
                    <div className="flex flex-col items-end px-6 w-[50px]">
                      <ArrowUpRight size={16} style={{ color: "#E7C365", opacity: 0 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col p-6 gap-6" style={{ background: "#1E2021", border: "1px solid rgba(77, 70, 55, 0.1)", borderRadius: 4 }}>
            <div className="flex flex-row justify-between items-center self-stretch">
              <span className="font-inter text-base leading-6" style={{ color: "#E2E2E3" }}>
                Today's Sessions
              </span>
              <div className="flex flex-row gap-2">
                <button className="flex flex-col justify-center items-center p-1 bg-transparent border-none cursor-pointer" style={{ borderRadius: 2 }}>
                  <ChevronLeft size={12} style={{ color: "#E2E2E3" }} />
                </button>
                <button className="flex flex-col justify-center items-center p-1 bg-transparent border-none cursor-pointer" style={{ borderRadius: 2 }}>
                  <ChevronRight size={12} style={{ color: "#E2E2E3" }} />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3 self-stretch">
              {todaysSessions.map((session) => (
                <SessionCard key={session._id} session={session} />
              ))}
              {todaysSessions.length === 0 && (
                <span className="font-inter text-base text-center py-8" style={{ color: "#D0C5B2" }}>
                  No sessions scheduled for today.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 flex-1 min-w-[260px] max-w-[320px]">
          <div className="flex flex-col p-6 gap-6 self-stretch" style={{ background: "#282A2B", border: "1px solid rgba(77, 70, 55, 0.1)", borderRadius: 4 }}>
            <div className="flex flex-row items-center gap-2 self-stretch">
              <Bell size={20} style={{ color: "#E7C365" }} />
              <span className="font-inter text-base leading-6" style={{ color: "#E2E2E3" }}>
                Recent Alerts
              </span>
            </div>
            <div className="flex flex-col gap-6 self-stretch">
              {alerts.map((alert) => (
                <AlertItem key={alert._id} alert={alert} />
              ))}
            </div>
            <div
              className="flex flex-row justify-center items-center py-2 self-stretch cursor-pointer"
              style={{ border: "1px solid rgba(77, 70, 55, 0.3)" }}
            >
              <span className="font-mono text-base leading-6 text-center tracking-wider uppercase" style={{ color: "#D0C5B2" }}>
                View All Notifications
              </span>
            </div>
          </div>

          <div
            className="flex flex-col p-6 gap-4 self-stretch relative overflow-hidden"
            style={{ background: "#C9A74D", borderRadius: 4 }}
          >
            <div className="absolute" style={{ right: -10.86, bottom: -6.26, opacity: 0.1, transform: "rotate(12deg)" }}>
              <Bell size={110} style={{ color: "#503D00" }} />
            </div>
            <div className="flex flex-col gap-1 self-stretch relative z-10">
              <span className="font-inter font-bold text-base leading-6" style={{ color: "#503D00" }}>
                {insights.cohortName} Status
              </span>
              <div className="flex flex-col self-stretch" style={{ opacity: 0.9, paddingBottom: 20 }}>
                <span className="font-inter text-base leading-6" style={{ color: "#503D00" }}>
                  {insights.description}
                </span>
              </div>
              <button
                className="flex flex-row justify-center items-center px-4 py-2 w-fit cursor-pointer"
                style={{ background: "#503D00", borderRadius: 2, border: "none" }}
              >
                <span className="font-inter font-bold text-base leading-6 text-center" style={{ color: "#C9A74D" }}>
                  View Report
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col p-6 gap-6 self-stretch" style={{ background: "#1E2021", border: "1px solid rgba(77, 70, 55, 0.1)", borderRadius: 4 }}>
            <span className="font-mono font-medium text-base leading-6 tracking-wider uppercase self-stretch" style={{ color: "#D0C5B2" }}>
              Response Efficiency
            </span>
            <div className="flex flex-row justify-center items-start self-stretch">
              <CircularProgress value={83} label="TARGET" />
            </div>
            <div className="flex flex-col items-center self-stretch">
              <span className="font-inter italic text-base leading-6 text-center" style={{ color: "#D0C5B2" }}>
                Meeting target 83% of the time
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorDashboard;
