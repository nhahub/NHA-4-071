import { useEffect } from "react";
import { useProfessor } from "../../hooks/useProfessor";
import PageHeader from "../../shared/components/PageHeader";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Calendar } from "lucide-react";

const ProfessorSchedule = () => {
  const { offerings, loading, error, loadOfferings } = useProfessor();

  useEffect(() => {
    loadOfferings();
  }, [loadOfferings]);

  return (
    <div className="flex flex-col gap-[44px] max-w-[960px] mx-auto">
      <PageHeader 
        title="My Schedule" 
        subtitle="View your weekly lecture schedule."
      />

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm p-8">
        {loading ? (
           <LoadingSkeleton type="card" count={2} />
        ) : !offerings || offerings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-text-muted">
            <Calendar size={48} className="opacity-50" />
            <span className="font-heading text-lg">No classes scheduled for this semester.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h3 className="font-heading font-semibold text-xl text-text-primary mb-4">Weekly Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offerings.map(o => (
                <div key={o._id} className="flex gap-4 p-4 border border-border rounded-lg bg-bg-light">
                   <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full text-primary">
                     <Calendar size={24} />
                   </div>
                   <div className="flex flex-col">
                      <span className="font-heading font-bold text-base text-text-primary">{o.courseId?.name || "Course"}</span>
                      <span className="font-body text-sm text-text-secondary">{o.courseId?.code || "Code"} • Room: {o.classroom}</span>
                      <span className="font-body text-sm font-semibold text-primary mt-1">{o.schedule}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorSchedule;
