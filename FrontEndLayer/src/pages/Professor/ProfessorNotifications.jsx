import PageHeader from "../../shared/components/PageHeader";
import { Bell } from "lucide-react";

const ProfessorNotifications = () => {
  return (
    <div className="flex flex-col gap-[44px] max-w-[960px] mx-auto">
      <PageHeader 
        title="Notifications" 
        subtitle="View your latest updates and alerts."
      />

      <div className="bg-white border border-border rounded-xl p-12 flex flex-col items-center justify-center gap-4">
        <Bell size={48} className="text-text-muted opacity-50" />
        <span className="font-heading text-lg text-text-muted">You have no new notifications.</span>
      </div>
    </div>
  );
};

export default ProfessorNotifications;
