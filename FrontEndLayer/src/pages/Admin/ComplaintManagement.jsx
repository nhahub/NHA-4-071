import { useState, useEffect } from "react";
import {
  User, CheckCircle, ShieldAlert, X
} from "lucide-react";
import { getAllComplaints, assignComplaint, resolveComplaint, getAdvisors } from "../../services/adminService";

const STATUS_STYLES = {
  pending: "bg-[#03B5D3] text-[#00424E]",
  in_progress: "bg-[#FFB4AB] text-[#93000A]",
  resolved: "bg-[#323537] text-[#C2C6D6]",
  rejected: "bg-[#93000A] text-[#FFB4AB]",
};

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterTab, setFilterTab] = useState("ALL");
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: null,
    complaintId: null,
    adminId: null,
    adminName: "",
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    Promise.all([getAllComplaints(), getAdvisors()]).then(
      ([complaintsResult, advisorsResult]) => {
        if (complaintsResult.success && complaintsResult.data?.complaints) {
          const formatted = complaintsResult.data.complaints.map((c) => {
            const studentName =
              typeof c.studentId === "object"
                ? c.studentId?.userId?.name || "Student"
                : "Student";
            const assignedName =
              typeof c.adminId === "object" && c.adminId?.name
                ? c.adminId.name
                : null;
            return {
              _id: c._id,
              ticketNumber: c._id.slice(-6).toUpperCase(),
              title: c.subject,
              snippet: c.description,
              status: c.status || "pending",
              category: "COMPLAINT",
              timeAgo: c.createdAt
                ? new Date(c.createdAt).toLocaleDateString()
                : "N/A",
              studentName,
              assignedTo: assignedName,
              assignedId: typeof c.adminId === "object" ? c.adminId?._id : c.adminId || null,
              resolutionNote: c.resolutionNote || null,
            };
          });
          setComplaints(formatted);
          if (formatted.length > 0 && !selectedTicket) {
            setSelectedTicket(formatted[0]);
          }
        }
        if (advisorsResult.success && advisorsResult.data?.users) {
          setAdvisors(advisorsResult.data.users);
        }
        setLoading(false);
      }
    );
  }, []);

  const refreshComplaint = async (complaintId) => {
    const result = await getAllComplaints();
    if (result.success && result.data?.complaints) {
      const updated = result.data.complaints.find((c) => c._id === complaintId);
      if (updated) {
        const studentName =
          typeof updated.studentId === "object"
            ? updated.studentId?.userId?.name || "Student"
            : "Student";
        const assignedName =
          typeof updated.adminId === "object" && updated.adminId?.name
            ? updated.adminId.name
            : null;
        const formatted = {
          _id: updated._id,
          ticketNumber: updated._id.slice(-6).toUpperCase(),
          title: updated.subject,
          snippet: updated.description,
          status: updated.status || "pending",
          category: "COMPLAINT",
          timeAgo: updated.createdAt
            ? new Date(updated.createdAt).toLocaleDateString()
            : "N/A",
          studentName,
          assignedTo: assignedName,
          assignedId: typeof updated.adminId === "object" ? updated.adminId?._id : updated.adminId || null,
          resolutionNote: updated.resolutionNote || null,
        };
        setComplaints((prev) =>
          prev.map((c) => (c._id === formatted._id ? formatted : c))
        );
        setSelectedTicket(formatted);
      }
    }
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleAgentSelect = (e) => {
    const adminId = e.target.value;
    if (!adminId) return;
    const advisor = advisors.find((a) => a._id === adminId);
    setConfirmModal({
      show: true,
      type: "assign",
      complaintId: selectedTicket._id,
      adminId,
      adminName: advisor?.name || "this advisor",
    });
  };

  const handleResolveClick = () => {
    setResolutionNote("");
    setConfirmModal({
      show: true,
      type: "resolve",
      complaintId: selectedTicket._id,
      adminId: null,
      adminName: "",
    });
  };

  const handleConfirm = async () => {
    setActionLoading(true);
    setConfirmModal((prev) => ({ ...prev, show: false }));

    try {
      if (confirmModal.type === "assign") {
        const result = await assignComplaint(
          confirmModal.complaintId,
          confirmModal.adminId
        );
        if (result.success) {
          setToast({
            type: "success",
            message: `Complaint assigned to ${confirmModal.adminName} successfully.`,
          });
          await refreshComplaint(confirmModal.complaintId);
        } else {
          setToast({ type: "error", message: result.error || "Failed to assign complaint." });
        }
      } else if (confirmModal.type === "resolve") {
        const result = await resolveComplaint(
          confirmModal.complaintId,
          resolutionNote
        );
        if (result.success) {
          setToast({ type: "success", message: "Complaint resolved successfully." });
          await refreshComplaint(confirmModal.complaintId);
        } else {
          setToast({ type: "error", message: result.error || "Failed to resolve complaint." });
        }
      }
    } catch {
      setToast({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setConfirmModal((prev) => ({ ...prev, show: false }));
  };

  const filteredTickets = complaints.filter((t) => {
    if (filterTab === "ALL") return true;
    if (filterTab === "OPEN") return t.status !== "resolved" && t.status !== "rejected";
    if (filterTab === "CLOSED") return t.status === "resolved" || t.status === "rejected";
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#424754] pb-6">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-[#E0E3E5] tracking-[-0.24px] m-0">
            Complaint Management
          </h1>
          <p className="font-heading text-sm text-[#C2C6D6] mt-1 m-0">
            Student grievances, grade appeals, and resolution workflows.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-lg shadow-xl font-heading text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-[#064E3B] text-[#6EE7B7] border border-[#6EE7B7]/40"
              : "bg-[#93000A] text-[#FFB4AB] border border-[#FFB4AB]/40"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-4 bg-transparent border-none cursor-pointer text-current opacity-60 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60">
          <div className="bg-[#1D2022] border border-[#424754] rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-[#424754]">
              <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
                {confirmModal.type === "assign" ? "Assign Complaint" : "Resolve Complaint"}
              </h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="font-heading text-sm text-[#C2C6D6] m-0 leading-relaxed">
                {confirmModal.type === "assign"
                  ? `Are you sure you want to assign this complaint to ${confirmModal.adminName}?`
                  : "Provide a resolution summary for the student:"}
              </p>
              {confirmModal.type === "resolve" && (
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Describe how the complaint was resolved..."
                  className="w-full bg-[#101415] border border-[#424754] rounded-lg p-3 text-sm text-[#E0E3E5] focus:outline-none focus:border-[#4D8EFF] resize-none h-24 placeholder:text-[#6B7280] font-heading"
                />
              )}
            </div>
            <div className="px-6 py-4 bg-[#191C1E] border-t border-[#424754] flex justify-end gap-3">
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="px-4 py-2 rounded font-heading font-bold text-xs uppercase tracking-wider text-[#C2C6D6] bg-[#323537] hover:bg-[#424754] transition-colors cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={actionLoading}
                className={`px-4 py-2 rounded font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer border-none ${
                  confirmModal.type === "assign"
                    ? "bg-[#ADC6FF] text-[#002E6A] hover:bg-[#8CAEFF]"
                    : "bg-[#064E3B] text-[#6EE7B7] hover:bg-[#065F46]"
                }`}
              >
                {actionLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[840px]">

        {/* COLUMN 1: Ticket Inbox */}
        <div className="lg:col-span-3 bg-[#191C1E] border border-[#424754] rounded-lg flex flex-col overflow-hidden shadow-xl max-h-[880px]">
          <div className="p-4 border-b border-[#424754] space-y-3 bg-[#1D2022]">
            <h2 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
              Ticket Inbox
            </h2>
            <div className="grid grid-cols-3 gap-2 font-heading text-[10px] uppercase font-bold">
              {["ALL", "OPEN", "CLOSED"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`py-1.5 rounded transition-colors cursor-pointer border-none ${
                    filterTab === tab
                      ? "bg-[#ADC6FF] text-[#002E6A] shadow-sm"
                      : "bg-[#101415] text-[#C2C6D6] hover:text-[#E0E3E5] border border-[#424754]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto divide-y divide-[#424754]/60 flex-1 font-heading">
            {loading ? (
              <div className="p-8 text-center text-[#C2C6D6] text-xs">Loading tickets...</div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-[#C2C6D6] text-xs">
                No tickets matching current filter.
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isSelected = selectedTicket?._id === ticket._id;
                return (
                  <div
                    key={ticket._id}
                    onClick={() => handleTicketSelect(ticket)}
                    className={`p-4 cursor-pointer transition-colors space-y-2 relative ${
                      isSelected
                        ? "bg-[#272A2C] border-l-4 border-l-[#ADC6FF]"
                        : "hover:bg-[#272A2C]/40 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold uppercase tracking-wider text-[#4D8EFF]">
                        {ticket.category}
                      </span>
                      <span className="font-mono text-[#C2C6D6]">{ticket.ticketNumber}</span>
                    </div>
                    <div className="font-semibold text-sm text-[#E0E3E5] leading-snug">
                      {ticket.title}
                    </div>
                    <p className="text-xs text-[#C2C6D6] line-clamp-2 leading-relaxed m-0">
                      {ticket.snippet}
                    </p>
                    <div className="flex justify-between items-center pt-1 text-[10px]">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          STATUS_STYLES[ticket.status] || STATUS_STYLES.pending
                        }`}
                      >
                        {ticket.status.replace(/_/g, " ")}
                      </span>
                      <span className="text-[#C2C6D6] font-mono">{ticket.timeAgo}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: Ticket Details */}
        <div className="lg:col-span-6 bg-[#101415] border border-[#424754] rounded-lg flex flex-col overflow-hidden shadow-xl max-h-[880px]">
          {selectedTicket ? (
            <>
              <div className="bg-[#191C1E] border-b border-[#424754] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-heading font-semibold text-xl text-[#E0E3E5] m-0">
                      {selectedTicket.title}
                    </h2>
                    <span className="bg-[#03B5D3] text-[#00424E] font-heading font-bold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded">
                      {selectedTicket.ticketNumber}
                    </span>
                  </div>
                  <div className="font-heading text-xs text-[#C2C6D6] mt-1.5 flex items-center gap-2">
                    <span className="font-semibold text-[#E0E3E5]">{selectedTicket.studentName}</span>
                    <span>•</span>
                    <span className="font-mono">{selectedTicket.timeAgo}</span>
                    <span>•</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                        STATUS_STYLES[selectedTicket.status] || STATUS_STYLES.pending
                      }`}
                    >
                      {selectedTicket.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
                  <div className="text-right">
                    <label className="block font-heading text-[10px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-1">
                      Assign to Advisor
                    </label>
                    <select
                      value={selectedTicket.assignedId || ""}
                      onChange={handleAgentSelect}
                      className="bg-[#1D2022] border border-[#424754] rounded px-3 py-1.5 text-xs text-[#E0E3E5] focus:outline-none focus:border-[#4D8EFF] cursor-pointer min-w-[140px]"
                    >
                      <option value="">Unassigned</option>
                      {advisors.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.name || a.universityId}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedTicket.status !== "resolved" && selectedTicket.status !== "rejected" && (
                    <button
                      onClick={handleResolveClick}
                      className="px-4 py-2.5 rounded font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border-none shadow-md bg-[#ADC6FF] hover:bg-[#8CAEFF] text-[#002E6A] active:scale-95"
                    >
                      <CheckCircle size={15} strokeWidth={2.5} />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1 font-heading">
                <div className="text-center">
                  <span className="px-4 py-1.5 bg-[#1D2022] border border-[#424754] rounded-full text-[11px] text-[#C2C6D6] uppercase tracking-wider inline-block">
                    Submitted by {selectedTicket.studentName} via Student Portal
                  </span>
                </div>

                <div className="bg-[#191C1E] border border-[#424754] rounded-lg p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded shrink-0 flex items-center justify-center bg-[#1D2022] border border-[#424754] text-[#ADC6FF]">
                      <User size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-[#E0E3E5]">{selectedTicket.studentName}</span>
                        <span className="font-mono text-xs text-[#C2C6D6]">{selectedTicket.timeAgo}</span>
                      </div>
                      <p className="text-sm text-[#C2C6D6] leading-relaxed m-0 whitespace-pre-wrap">
                        {selectedTicket.snippet}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedTicket.assignedTo && (
                  <div className="bg-[#1D2022] border border-[#424754] rounded-lg p-4 flex items-center gap-3">
                    <User size={16} className="text-[#4D8EFF]" />
                    <span className="text-sm text-[#C2C6D6]">
                      Assigned to: <strong className="text-[#E0E3E5]">{selectedTicket.assignedTo}</strong>
                    </span>
                  </div>
                )}

                {selectedTicket.resolutionNote && (
                  <div className="bg-[#064E3B]/20 border border-[#6EE7B7]/30 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={16} className="text-[#6EE7B7]" />
                      <span className="font-heading font-bold text-sm text-[#6EE7B7]">Resolution Note</span>
                    </div>
                    <p className="text-sm text-[#C2C6D6] leading-relaxed m-0 whitespace-pre-wrap">
                      {selectedTicket.resolutionNote}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-12 text-[#C2C6D6]">
              Select a ticket from the inbox to view details.
            </div>
          )}
        </div>

        {/* COLUMN 3: Student Profile */}
        <div className="lg:col-span-3 bg-[#191C1E] border border-[#424754] rounded-lg p-6 flex flex-col justify-between space-y-6 overflow-y-auto shadow-xl max-h-[880px] font-heading">
          {selectedTicket ? (
            <div className="space-y-6">
              <div>
                <div className="text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-4">
                  Student Profile
                </div>
                <div className="flex flex-col items-center text-center pb-6 border-b border-[#424754]/60">
                  <div className="w-20 h-20 rounded-lg flex items-center justify-center border-2 border-[#4D8EFF] mb-3 shadow-md bg-[#1D2022]">
                    <span className="text-2xl font-bold text-[#ADC6FF]">
                      {selectedTicket.studentName?.charAt(0)?.toUpperCase() || "S"}
                    </span>
                  </div>
                  <div className="font-bold text-lg text-[#E0E3E5]">
                    {selectedTicket.studentName}
                  </div>
                </div>
              </div>

              <div className="bg-[#1D2022] border border-[#424754] rounded p-4 space-y-2.5 text-xs">
                <div className="text-[10px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-3 block">
                  Complaint Details
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#C2C6D6]">Status</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                      STATUS_STYLES[selectedTicket.status] || STATUS_STYLES.pending
                    }`}
                  >
                    {selectedTicket.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#C2C6D6]">Assigned To</span>
                  <span className="text-[#E0E3E5] font-medium">
                    {selectedTicket.assignedTo || "Unassigned"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#C2C6D6]">Submitted</span>
                  <span className="text-[#E0E3E5]">{selectedTicket.timeAgo}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-[#C2C6D6] text-xs py-8">
              No profile loaded.
            </div>
          )}

          <div className="pt-4 border-t border-[#424754]/60">
            <button
              onClick={() => {
                if (confirm(`Flag ticket #${selectedTicket?.ticketNumber} as fraudulent?`)) {
                  setToast({ type: "success", message: "Ticket flagged for security audit." });
                }
              }}
              className="w-full py-2.5 bg-[#1D2022] hover:bg-[#93000A]/20 border border-[#93000A]/60 rounded text-[#FFB4AB] font-heading font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <ShieldAlert size={14} />
              <span>Flag as Fraudulent</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComplaintManagement;
