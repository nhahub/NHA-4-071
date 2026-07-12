import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import { useAuth } from "../../hooks/useAuth";

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const role = user?.role || "student";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen font-heading text-primary">
        Loading...
      </div>
    );
  }

  return (
    <div data-theme={role} className="flex flex-row items-start min-h-screen">
      <DashboardSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 lg:ml-[240px] min-h-screen">
        <DashboardHeader onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 bg-bg-page overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
