import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdvisor } from "../../hooks/useAdvisor";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
<<<<<<< HEAD
import StatusBadge from "../../shared/components/StatusBadge";
import SessionCard from "../../shared/components/SessionCard";
import AlertItem from "../../shared/components/AlertItem";
import AdvisorCard from "../../shared/components/AdvisorCard";
import styles from "./AdvisorDashboard.module.css";
=======
>>>>>>> 4f067de2df75df7cdbd9d5ef1948e2f884dc60e7

// Metric Card Component
const MetricCard = ({ label, value, borderColor, children, progress }) => (
  <div
    className={styles.metricCard}
    style={{
      background: "#1E2021",
      borderLeft: `4px solid ${borderColor || "#E7C365"}`,
    }}
  >
    <div className={styles.metricHeader}>
      <span className={styles.metricLabel} style={{ color: "#D0C5B2" }}>
        {label}
      </span>
      {children}
    </div>
    <div className={styles.metricValueWrapper}>
      <span className={styles.metricValue} style={{ color: "#E2E2E3" }}>
        {value}
      </span>
    </div>
    {progress !== undefined && (
      <div className={styles.progressContainer} style={{ background: "#333536" }}>
        <div
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            background: "#E7C365",
          }}
          className={styles.progressBar}
        />
      </div>
    )}
  </div>
);

<<<<<<< HEAD
// Trend Indicator Component
const TrendIndicator = ({ positive, value }) => (
  <div className={styles.trendIndicator} style={{ padding: "0 0 4px" }}>
    {positive ? (
      <svg width="11.67" height="7" viewBox="0 0 12 8" fill="none">
        <path d="M1 7L5.5 2L10 7" stroke="#E7C365" strokeWidth="1.5" />
      </svg>
    ) : (
      <div style={{ width: 9.33, height: 9.33, background: "#E7C365" }} />
    )}
    <span className={styles.trendValue} style={{ color: "#E7C365" }}>{value}</span>
  </div>
);

=======
>>>>>>> 4f067de2df75df7cdbd9d5ef1948e2f884dc60e7
const AdvisorDashboard = () => {
  const { dashboardStats, statsLoading, loadDashboardStats } = useAdvisor();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  if (statsLoading || !dashboardStats) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

<<<<<<< HEAD
  // Ensure metrics and other arrays have default values to avoid undefined errors
  const {
    metrics = { totalAdvisees: 0, atRiskCount: 0, auditCompletionPercent: 0, avgResponseHours: 0 },
    atRiskStudents = [],
    todaysSessions = [],
    alerts = [],
    insights = [],
  } = dashboardStats || {};

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.metricsGrid}>
        <MetricCard label="TOTAL ADVISEES" value={metrics.totalAdvisees} borderColor="#E7C365">
=======

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
>>>>>>> 4f067de2df75df7cdbd9d5ef1948e2f884dc60e7
          <div style={{ width: 22, height: 16, background: "rgba(231, 195, 101, 0.5)" }} />
        </MetricCard>
        <MetricCard label="AT-RISK STUDENTS" value={atRiskAdvisees ?? 0} borderColor="#FFB4AB">
          <div style={{ width: 22, height: 19, background: "rgba(255, 180, 171, 0.5)" }} />
        </MetricCard>
<<<<<<< HEAD
        <MetricCard
          label="AUDIT COMPLETION"
          value={`${metrics.auditCompletionPercent}%`}
          borderColor="#E7C365"
          progress={metrics.auditCompletionPercent}
        >
          <div style={{ width: 22, height: 21, background: "rgba(231, 195, 101, 0.5)" }} />
        </MetricCard>
        <MetricCard
          label="RESPONSE TIME"
          value={`${metrics.avgResponseHours}h`}
          borderColor="#E7C365"
        >
          <div style={{ width: 20, height: 20, background: "rgba(231, 195, 101, 0.5)" }} />
        </MetricCard>
      </div>

      {/* At-Risk Student Monitoring */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>At-Risk Student Monitoring</span>
        <button className={styles.viewAllButton} onClick={() => navigate('/advisor/at-risk')}>View All</button>
      </div>
      <div className={styles.atRiskTable}>
        {atRiskStudents.map((student) => (
          <div key={student.id} className={styles.atRiskRow}>
            <StatusBadge status={student.status} />
            <span className={styles.studentName}>{student.name}</span>
            <span className={styles.studentInfo}>{student.info}</span>
          </div>
        ))}
      </div>

      {/* Today's Sessions */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Today's Sessions</span>
        <button className={styles.viewAllButton} onClick={() => navigate('/advisor/todays-sessions')}>View All</button>
      </div>
      <div className={styles.sessionsList}>
        {todaysSessions.map((session) => (
          <SessionCard key={session.id} title={session.title} description={session.description} time={session.time} />
        ))}
      </div>

      {/* Recent Alerts */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Recent Alerts</span>
        <button className={styles.viewAllButton} onClick={() => navigate('/advisor/alerts')}>View All</button>
      </div>
      <div className={styles.alertsList}>
        {alerts.map((alert) => (
          <AlertItem key={alert.id} type={alert.type} message={alert.message} />
        ))}
      </div>

      {/* Insights */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Insights</span>
        <button className={styles.viewAllButton} onClick={() => navigate('/advisor/insights')}>View All</button>
      </div>
      <div className={styles.insightsContent}>
        {insights.map((insight) => (
          <AdvisorCard key={insight.id} title={insight.title} description={insight.description} />
        ))}
      </div>
=======
      </div>

      <span className="font-inter text-base leading-6" style={{ color: "#E2E2E3" }}>At-Risk Student Monitoring</span>
      <button onClick={() => {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999';
        modal.innerHTML = '<div style="background:#1E2021;padding:40px;border-radius:12px;max-width:500px;text-align:center"><h2 style="color:#E2E2E3;margin-bottom:16px">At-Risk Students</h2><p style="color:#D0C5B2;margin-bottom:24px">All at-risk students are being monitored. Intervention plans are active.</p><button onclick="this.closest(\'div[style]\').remove()" style="background:#E7C365;color:#121415;border:none;padding:10px 24px;border-radius:8px;font-weight:bold;cursor:pointer">OK</button></div>';
        document.body.appendChild(modal);
      }} className="font-mono text-base leading-6 uppercase bg-transparent border-none cursor-pointer" style={{ color: "#E7C365" }}>View All</button>
>>>>>>> 4f067de2df75df7cdbd9d5ef1948e2f884dc60e7
    </div>
  );
};

export default AdvisorDashboard;
