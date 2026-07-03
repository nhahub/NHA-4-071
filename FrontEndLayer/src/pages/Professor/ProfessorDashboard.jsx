import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfessor } from "../../hooks/useProfessor";
import { ROUTES } from "../../routes/RoutePaths";
import KPICard from "../../shared/components/KPICard";
import PageHeader from "../../shared/components/PageHeader";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Users, BookOpen, ClipboardList } from "lucide-react";

const btnPrimary = "flex flex-row items-center px-4 py-[9px] gap-2 bg-primary shadow-sm rounded-lg border-none text-white font-body font-normal text-base leading-normal cursor-pointer";

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const { profile, offerings, loading, error, loadProfile, loadOfferings } = useProfessor();

  useEffect(() => {
    loadProfile();
    loadOfferings();
  }, [loadProfile, loadOfferings]);

  if (loading) return <LoadingSkeleton type="card" count={4} />;

  const totalOfferings = offerings?.length || 0;
  const totalStudents = offerings?.reduce((sum, offer) => sum + (offer.enrolledCount || 0), 0) || 0;

  return (
    <div className="flex flex-col gap-[44px] max-w-[960px] mx-auto">
      <PageHeader 
        title="Professor Dashboard" 
        subtitle={`Welcome back, ${profile?.title || "Professor"}. You have ${totalOfferings} course offerings this semester.`}
      >
        <button className={btnPrimary} onClick={() => navigate(ROUTES.PROFESSOR.GRADES)}>
          <ClipboardList size={16} />
          Input Grades
        </button>
      </PageHeader>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4 w-full">
        <KPICard label="TOTAL OFFERINGS" value={totalOfferings} subtitle="Active Courses" borderColor="#4F378A" />
        <KPICard label="TOTAL STUDENTS" borderColor="#63597C">
          <span className="font-heading font-semibold text-[36px] leading-[36px] text-text-primary">
            {totalStudents}
          </span>
        </KPICard>
        <KPICard label="UPCOMING LECTURES" value={totalOfferings * 2} subtitle="This Week" borderColor="#765B00" />
      </div>

      <div className="flex flex-col gap-4">
         <div className="flex justify-between items-center">
            <h3 className="font-heading font-semibold text-2xl m-0 text-text-primary">
               Quick Actions
            </h3>
         </div>
         <div className="grid grid-cols-3 gap-6">
            <div 
               className="flex flex-col items-center justify-center p-6 bg-white border border-border rounded-xl cursor-pointer hover:shadow-md transition-shadow"
               onClick={() => navigate(ROUTES.PROFESSOR.COURSES)}
            >
               <BookOpen size={32} className="text-primary mb-4" />
               <span className="font-heading font-semibold text-lg">My Courses</span>
            </div>
            <div 
               className="flex flex-col items-center justify-center p-6 bg-white border border-border rounded-xl cursor-pointer hover:shadow-md transition-shadow"
               onClick={() => navigate(ROUTES.PROFESSOR.STUDENTS)}
            >
               <Users size={32} className="text-primary mb-4" />
               <span className="font-heading font-semibold text-lg">Student Performance</span>
            </div>
            <div 
               className="flex flex-col items-center justify-center p-6 bg-white border border-border rounded-xl cursor-pointer hover:shadow-md transition-shadow"
               onClick={() => navigate(ROUTES.PROFESSOR.ASSIGNMENTS)}
            >
               <ClipboardList size={32} className="text-primary mb-4" />
               <span className="font-heading font-semibold text-lg">Assignments</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
