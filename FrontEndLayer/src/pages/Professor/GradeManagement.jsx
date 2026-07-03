import { useEffect, useState } from "react";
import { useProfessor } from "../../hooks/useProfessor";
import PageHeader from "../../shared/components/PageHeader";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { CheckCircle } from "lucide-react";

const btnPrimary = "px-4 py-2 bg-primary text-white font-heading font-semibold text-sm rounded-lg hover:opacity-90";

const GradeManagement = () => {
  const { offerings, students, loading, error, loadOfferings, loadOfferingStudents, submitGrade } = useProfessor();
  const [selectedOffering, setSelectedOffering] = useState("");
  const [grades, setGrades] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");

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
      setGrades({});
      setSubmitStatus("");
    }
  }, [selectedOffering, loadOfferingStudents]);

  const handleGradeChange = (studentId, grade) => {
    setGrades(prev => ({ ...prev, [studentId]: grade }));
  };

  const handleSubmit = async (studentId) => {
    if (!grades[studentId]) return;
    try {
      await submitGrade({ offeringId: selectedOffering, studentId, grade: grades[studentId] });
      setSubmitStatus(`Grade submitted successfully for student ${studentId}`);
      setTimeout(() => setSubmitStatus(""), 3000);
    } catch (err) {
      setSubmitStatus("Failed to submit grade");
    }
  };

  return (
    <div className="flex flex-col gap-[44px] max-w-[960px] mx-auto">
      <PageHeader 
        title="Grade Management" 
        subtitle="Input and publish grades for your students."
      />

      {(error || submitStatus) && (
        <div className={`p-4 rounded-lg font-heading text-sm ${error || submitStatus.includes("Failed") ? "bg-danger/10 border-danger text-danger" : "bg-success/10 border-success text-success"}`}>
          {error || submitStatus}
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
                  Input Grade
                </th>
                <th className="text-center px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {!students || students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-8 text-center font-heading text-text-muted">
                    No students enrolled to grade.
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
                    <td className="px-8 py-4">
                      <select 
                         className="px-3 py-2 border border-border rounded-md font-body outline-none"
                         value={grades[student._id] || ""}
                         onChange={(e) => handleGradeChange(student._id, e.target.value)}
                      >
                         <option value="" disabled>Select Grade</option>
                         <option value="A+">A+</option>
                         <option value="A">A</option>
                         <option value="B+">B+</option>
                         <option value="B">B</option>
                         <option value="C+">C+</option>
                         <option value="C">C</option>
                         <option value="D">D</option>
                         <option value="F">F</option>
                      </select>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <button 
                         className={btnPrimary}
                         disabled={!grades[student._id]}
                         onClick={() => handleSubmit(student._id)}
                      >
                         <CheckCircle size={14} className="inline mr-1" />
                         Publish
                      </button>
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

export default GradeManagement;
