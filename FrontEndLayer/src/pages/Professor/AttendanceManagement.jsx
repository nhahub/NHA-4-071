import { useEffect, useState } from "react";
import { useProfessor } from "../../hooks/useProfessor";
import PageHeader from "../../shared/components/PageHeader";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { CheckCircle, XCircle } from "lucide-react";

const btnPrimary = "px-4 py-2 bg-primary text-white font-heading font-semibold text-sm rounded-lg hover:opacity-90 disabled:opacity-50";

const AttendanceManagement = () => {
  const { offerings, students, loading, error, loadOfferings, loadOfferingStudents } = useProfessor();
  const [selectedOffering, setSelectedOffering] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [statusMsg, setStatusMsg] = useState("");

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
      setAttendance({});
      setStatusMsg("");
    }
  }, [selectedOffering, loadOfferingStudents]);

  const handleMark = (studentId, isPresent) => {
    setAttendance(prev => ({ ...prev, [studentId]: isPresent }));
  };

  const handleSave = () => {
    // In a real app, this would hit an API endpoint like submitAttendance
    setStatusMsg(`Attendance saved for ${date}`);
    setTimeout(() => setStatusMsg(""), 3000);
  };

  return (
    <div className="flex flex-col gap-[44px] max-w-[960px] mx-auto">
      <PageHeader 
        title="Attendance Management" 
        subtitle="Track and manage student attendance for your lectures."
      >
        <button 
          className={btnPrimary} 
          onClick={handleSave}
          disabled={Object.keys(attendance).length === 0}
        >
          Save Attendance
        </button>
      </PageHeader>

      {(error || statusMsg) && (
        <div className={`p-4 rounded-lg font-heading text-sm ${error ? "bg-danger/10 border-danger text-danger" : "bg-success/10 border-success text-success"}`}>
          {error || statusMsg}
        </div>
      )}

      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-heading font-semibold text-sm text-text-primary">Course Offering:</label>
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
        <div className="flex flex-col gap-2">
          <label className="font-heading font-semibold text-sm text-text-primary">Lecture Date:</label>
          <input 
            type="date" 
            className="px-4 py-2 border border-border rounded-lg font-body text-base outline-none"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
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
                  Status
                </th>
                <th className="text-center px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  Mark
                </th>
              </tr>
            </thead>
            <tbody>
              {!students || students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-8 text-center font-heading text-text-muted">
                    No students enrolled to track attendance.
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
                    <td className="px-8 py-4 font-heading font-semibold text-base">
                      {attendance[student._id] === true && <span className="text-success">Present</span>}
                      {attendance[student._id] === false && <span className="text-danger">Absent</span>}
                      {attendance[student._id] === undefined && <span className="text-text-muted">Unmarked</span>}
                    </td>
                    <td className="px-8 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          className={`p-2 rounded-full border ${attendance[student._id] === true ? 'bg-success/20 border-success text-success' : 'border-border text-text-muted hover:bg-success/10 hover:text-success'}`}
                          onClick={() => handleMark(student._id, true)}
                          title="Mark Present"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          className={`p-2 rounded-full border ${attendance[student._id] === false ? 'bg-danger/20 border-danger text-danger' : 'border-border text-text-muted hover:bg-danger/10 hover:text-danger'}`}
                          onClick={() => handleMark(student._id, false)}
                          title="Mark Absent"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
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

export default AttendanceManagement;
