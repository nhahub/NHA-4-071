import { useEffect } from "react";
import { useAdmin } from "../../hooks/useAdmin";
import SystemOverviewKPIs from "./components/SystemOverviewKPIs";
import InstitutionalActivityChart from "./components/InstitutionalActivityChart";
import QuickManagementGrid from "./components/QuickManagementGrid";
import AdministrativeAuditTrail from "./components/AdministrativeAuditTrail";

const AdminDashboard = () => {
  const { dashboardData, loadDashboard, loading } = useAdmin();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading && !dashboardData) {
    return (
      <div className="flex justify-center items-center h-[600px] font-heading text-admin-accent">
        Loading System Dashboard...
      </div>
    );
  }

  const kpis = dashboardData?.kpis;
  const enrollmentTrends = dashboardData?.enrollmentTrends;
  const quickManagement = dashboardData?.quickManagement;
  const auditTrail = dashboardData?.auditTrail;

  return (
    <div className="flex flex-col items-start gap-6 w-full max-w-[1280px] mx-auto pb-12">
      {/* 1. System Overview KPIs */}
      <SystemOverviewKPIs kpis={kpis} />

      {/* 2 & 3. Chart + Quick Management Side by Side */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6 w-full">
        <div className="flex-[2] min-w-0">
          <InstitutionalActivityChart data={enrollmentTrends} />
        </div>
        <div className="flex-[1] min-w-0">
          <QuickManagementGrid actions={quickManagement} />
        </div>
      </div>

      {/* 4. Administrative Audit Trail */}
      <AdministrativeAuditTrail logs={auditTrail} />
    </div>
  );
};

export default AdminDashboard;
