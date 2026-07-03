import { useEffect, useState } from "react";
import { useProfessor } from "../../hooks/useProfessor";
import PageHeader from "../../shared/components/PageHeader";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Users } from "lucide-react";

const StudentPerformance = () => {
  const { offerings, students, loading, error, loadOfferings, loadOfferingStudents } = useProfessor();
  const [selectedOffering, setSelectedOffering] = useState("");

  useEffect(() => {
    loadOfferings();
  }, [loadOfferings]);

  useEffect(() => {
    if (offerings && offerings.length > 0 && !selectedOffering) {
      setSelectedOffering(offerings[0]._id);
    }
  }, [offerings, selectedOffering]);

  useEffect(() => {
    if (selectedOffering) {
      loadOfferingStudents(selectedOffering);
    }
  }, [selectedOffering, loadOfferingStudents]);

  return (
    <div className="flex flex-col gap-[44px] max-w-[960px] mx-auto">
      <PageHeader 
        title="Student Performance" 
        subtitle="View performance, grades, and attendance for your enrolled students."
      />

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="font-heading font-semibold text-text-primary">Select Course Offering:</label>
        <select 
          className="px-4 py-2 border border-border rounded-lg font-body text-base outline-none min-w-[200px]"
          value={selectedOffering}
          onChange={(e) => setSelectedOffering(e.target.value)}
        >
          {offerings?.map(o => (
            <option key={o._id} value={o._id}>{o.courseId?.name || "Course"} - {o.schedule}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        {loading && !students?.length ? (
           <LoadingSkeleton type="table" count={5} />
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-light">
                <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  Student Name
                </th>
                <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  University ID
                </th>
                <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  GPA
                </th>
                <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  Level
                </th>
              </tr>
            </thead>
            <tbody>
              {!students || students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-8 text-center font-heading text-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users size={32} className="text-text-muted opacity-50" />
                      <span>No students enrolled in this offering yet.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student, i) => (
                  <tr key={student._id} className={i > 0 ? "border-t border-border hover:bg-gray-50" : "hover:bg-gray-50"}>
                    <td className="px-8 py-[18.5px] font-heading font-bold text-base text-text-primary">
                      {student.userId?.name || "Student Name"}
                    </td>
                    <td className="px-8 py-4 font-body font-normal text-base text-text-primary">
                      {student.userId?.universityId || "ID"}
                    </td>
                    <td className="px-8 py-4 font-heading font-normal text-base text-text-primary">
                      {student.GPA?.toFixed(2) || "N/A"}
                    </td>
                    <td className="px-8 py-4 font-heading font-normal text-base text-text-primary">
                      {student.level || 1}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
};

export default StudentPerformance;
