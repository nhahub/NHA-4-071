import { useEffect, useState } from "react";
import { useProfessor } from "../../hooks/useProfessor";
import PageHeader from "../../shared/components/PageHeader";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Plus, FileText } from "lucide-react";

const btnPrimary = "flex flex-row items-center px-4 py-[9px] gap-2 bg-primary shadow-sm rounded-lg border-none text-white font-body font-normal text-base leading-normal cursor-pointer hover:opacity-90";

const AssignmentsPage = () => {
  const { offerings, assignments, loading, error, loadOfferings, loadAssignments, createAssignment } = useProfessor();
  const [selectedOffering, setSelectedOffering] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: "", description: "", dueDate: "", totalPoints: "" });

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
      loadAssignments(selectedOffering);
      setShowForm(false);
    }
  }, [selectedOffering, loadAssignments]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedOffering) return;
    
    await createAssignment({
      offeringId: selectedOffering,
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate,
      totalPoints: Number(newAssignment.totalPoints)
    });
    
    setShowForm(false);
    setNewAssignment({ title: "", description: "", dueDate: "", totalPoints: "" });
  };

  return (
    <div className="flex flex-col gap-[44px] max-w-[960px] mx-auto">
      <PageHeader 
        title="Assignments" 
        subtitle="Manage assignments and create new ones for your courses."
      >
         <button className={btnPrimary} onClick={() => setShowForm(!showForm)}>
           <Plus size={16} />
           {showForm ? "Cancel" : "Create Assignment"}
         </button>
      </PageHeader>

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

      {showForm && (
        <form onSubmit={handleCreate} className="flex flex-col gap-4 p-6 bg-white border border-border rounded-xl shadow-sm">
          <h3 className="font-heading font-semibold text-lg text-text-primary m-0">Create New Assignment</h3>
          <div className="flex gap-4">
             <div className="flex-1 flex flex-col gap-2">
                <label className="font-heading text-sm font-semibold">Title</label>
                <input required type="text" className="px-3 py-2 border border-border rounded-lg outline-none font-body" value={newAssignment.title} onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})} />
             </div>
             <div className="flex-1 flex flex-col gap-2">
                <label className="font-heading text-sm font-semibold">Due Date</label>
                <input required type="date" className="px-3 py-2 border border-border rounded-lg outline-none font-body" value={newAssignment.dueDate} onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})} />
             </div>
             <div className="flex-1 flex flex-col gap-2">
                <label className="font-heading text-sm font-semibold">Total Points</label>
                <input required type="number" className="px-3 py-2 border border-border rounded-lg outline-none font-body" value={newAssignment.totalPoints} onChange={(e) => setNewAssignment({...newAssignment, totalPoints: e.target.value})} />
             </div>
          </div>
          <div className="flex flex-col gap-2">
             <label className="font-heading text-sm font-semibold">Description</label>
             <textarea required rows="3" className="px-3 py-2 border border-border rounded-lg outline-none font-body" value={newAssignment.description} onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})} />
          </div>
          <div className="flex justify-end mt-2">
             <button type="submit" className={btnPrimary}>Save Assignment</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        {loading && !assignments?.length ? (
           <LoadingSkeleton type="table" count={5} />
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-light">
                <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  Title
                </th>
                <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  Due Date
                </th>
                <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  Points
                </th>
                <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {!assignments || assignments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-8 text-center font-heading text-text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText size={32} className="text-text-muted opacity-50" />
                      <span>No assignments found for this offering.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                assignments.map((assign, i) => (
                  <tr key={assign._id} className={i > 0 ? "border-t border-border hover:bg-gray-50" : "hover:bg-gray-50"}>
                    <td className="px-8 py-[18.5px]">
                      <div className="flex flex-col">
                        <span className="font-heading font-bold text-base text-text-primary">
                          {assign.title}
                        </span>
                        <span className="font-body font-normal text-sm text-text-secondary">
                          {assign.description?.substring(0, 50) || "No description"}...
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4 font-body font-normal text-base text-text-primary">
                      {new Date(assign.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-4 font-heading font-normal text-base text-text-primary">
                      {assign.totalPoints}
                    </td>
                    <td className="px-8 py-4 font-heading font-normal text-base text-text-primary">
                      <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-semibold">Active</span>
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

export default AssignmentsPage;
