import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import { useAuth } from "../../hooks/useAuth";

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const role = user?.role || "student";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen font-heading text-primary">
        Loading...
      </div>
    );
  }

  return (
    <div data-theme={role} className="flex flex-row items-start min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 ml-[240px] min-h-screen">
        <DashboardHeader />
        <main className="flex-1 p-8 bg-bg-page overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
