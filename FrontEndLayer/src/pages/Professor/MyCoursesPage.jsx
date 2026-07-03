import { useEffect } from "react";
import { useProfessor } from "../../hooks/useProfessor";
import PageHeader from "../../shared/components/PageHeader";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";

const MyCoursesPage = () => {
  const { offerings, loading, error, loadOfferings } = useProfessor();

  useEffect(() => {
    loadOfferings();
  }, [loadOfferings]);

  if (loading) return <LoadingSkeleton type="table" count={5} />;

  return (
    <div className="flex flex-col gap-[44px] max-w-[960px] mx-auto">
      <PageHeader 
        title="My Courses" 
        subtitle="View and manage the courses you are currently teaching."
      />

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-light">
                <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  Course
                </th>
                <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  Schedule
                </th>
                <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  Classroom
                </th>
                <th className="text-center px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  Enrollment
                </th>
              </tr>
            </thead>
            <tbody>
              {!offerings || offerings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-8 text-center font-heading text-text-muted">
                    You are not assigned to teach any courses this semester.
                  </td>
                </tr>
              ) : (
                offerings.map((offering, i) => (
                  <tr key={offering._id} className={i > 0 ? "border-t border-border hover:bg-gray-50" : "hover:bg-gray-50"}>
                    <td className="px-8 py-[18.5px]">
                      <div className="flex flex-col">
                        <span className="font-heading font-bold text-base text-text-primary">
                          {offering.courseId?.name || "Course Name"}
                        </span>
                        <span className="font-body font-normal text-sm text-primary">
                          {offering.courseId?.code || "Code"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4 font-heading font-normal text-base text-text-primary">
                      {offering.schedule}
                    </td>
                    <td className="px-8 py-4 font-heading font-normal text-base text-text-primary">
                      {offering.classroom}
                    </td>
                    <td className="px-8 py-[18px] text-center">
                      <span className="flex flex-col items-center px-3 py-1 bg-primary/10 rounded-full font-heading font-semibold text-xs tracking-wider text-primary inline-block">
                        {offering.enrolledCount} / {offering.capacity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;
