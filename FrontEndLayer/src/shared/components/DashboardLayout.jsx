import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import { useAuth } from "../../hooks/useAuth";

const DashboardLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen font-heading text-primary">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="flex flex-1 pt-16">
        <DashboardSidebar />
        <main className="flex-1 ml-[255px] px-8 pt-[85px] pb-[61px] min-h-[calc(100vh-64px)] bg-bg-page">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
