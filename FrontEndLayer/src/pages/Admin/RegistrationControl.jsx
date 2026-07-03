import { useState } from "react";
import {
  User, Check, Info, X, Filter, Download,
  AlertCircle, RotateCcw, ChevronLeft, ChevronRight,
  ShieldCheck, CheckCircle2, XCircle
} from "lucide-react";
import { initialOverrides, registrationStats as initialStats } from "../../dummyData";

const RegistrationControl = () => {
  const [overrides, setOverrides] = useState(initialOverrides);
  const [stats, setStats] = useState(initialStats);
  const [isWindowOpen, setIsWindowOpen] = useState(initialStats.isWindowOpen);
  const [filterDept, setFilterDept] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dynamic recent activity logs
  const [activities, setActivities] = useState([
    { id: 1, text: "Override #882 Approved", time: "10 mins ago" },
    { id: 2, text: "Registration Window Toggled", time: "1 hour ago" },
  ]);

  const addActivity = (text) => {
    setActivities((prev) => [
      { id: Date.now(), text, time: "Just now" },
      ...prev.slice(0, 4),
    ]);
  };

  const handleToggleWindow = () => {
    const newState = !isWindowOpen;
    setIsWindowOpen(newState);
    addActivity(`Registration Window Toggled (${newState ? "OPEN" : "CLOSED"})`);
  };

  const handleApprove = (item) => {
    setOverrides((prev) => prev.filter((o) => o._id !== item._id));
    setStats((prev) => ({
      ...prev,
      pendingApproval: Math.max(0, prev.pendingApproval - 1),
      autoEnrolled: prev.autoEnrolled + 1,
    }));
    addActivity(`Override for ${item.studentName} Approved`);
  };

  const handleReject = (item) => {
    const reason = prompt(`Reason for rejecting override for ${item.studentName}:`, "Prerequisite criteria not met.");
    if (reason !== null) {
      setOverrides((prev) => prev.filter((o) => o._id !== item._id));
      setStats((prev) => ({
        ...prev,
        pendingApproval: Math.max(0, prev.pendingApproval - 1),
        rejected: prev.rejected + 1,
      }));
      addActivity(`Override for ${item.studentName} Rejected`);
    }
  };

  const handleInfo = (item) => {
    alert(`AUDIT TRAIL FOR OVERRIDE #${item._id}\n\nStudent: ${item.studentName} (${item.studentId})\nCourse: ${item.courseCode}\nReason: ${item.reason}\nStatus: Pending Dean Review\nSubmitted: 2 hours ago`);
  };

  const filteredOverrides = overrides.filter((o) => {
    if (filterDept === "ALL") return true;
    if (filterDept === "CS") return o.courseCode.includes("CS-");
    if (filterDept === "MATH") return o.courseCode.includes("MATH-");
    if (filterDept === "ENG") return o.courseCode.includes("ENG-");
    return true;
  });

  const cycleFilter = () => {
    const next = { ALL: "CS", CS: "MATH", MATH: "ENG", ENG: "ALL" };
    setFilterDept(next[filterDept] || "ALL");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Global Control Header */}
      <div className="bg-[#1D2022] border border-[#424754] rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-[#ADC6FF] tracking-[-0.24px] m-0">
            Active Registration Control
          </h1>
          <p className="font-heading text-sm text-[#C2C6D6] mt-1 m-0">
            Manage the global state of the {stats.semesterName} semester enrollment window.
          </p>
        </div>

        {/* Toggle Switch Card */}
        <div className="bg-[#101415] border border-[#424754] rounded-md p-4 flex items-center justify-between sm:justify-end gap-6 self-stretch sm:self-auto min-w-[240px]">
          <div className="text-right">
            <div className="font-heading font-bold text-[11px] uppercase tracking-[0.55px] text-[#ADC6FF]">
              Registration Status
            </div>
            <div className={`font-heading font-semibold text-lg leading-tight mt-0.5 ${isWindowOpen ? "text-[#E0E3E5]" : "text-[#FFB4AB]"}`}>
              {isWindowOpen ? "OPEN" : "CLOSED"}
            </div>
          </div>

          {/* Toggle Switch Button */}
          <button
            type="button"
            onClick={handleToggleWindow}
            aria-label="Toggle Registration Status"
            className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isWindowOpen ? "bg-[#4D8EFF]" : "bg-[#424754]"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isWindowOpen ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Box 1 */}
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4 flex flex-col justify-between h-[94px]">
          <div className="font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
            Total Requests
          </div>
          <div className="font-heading font-bold text-3xl text-[#E0E3E5] leading-tight">
            {(stats.totalRequests + (1280 - initialStats.autoEnrolled)).toLocaleString()}
          </div>
        </div>

        {/* Box 2 */}
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4 flex flex-col justify-between h-[94px]">
          <div className="font-heading font-bold text-[11px] text-[#4CD7F6] uppercase tracking-[0.55px]">
            Pending Approval
          </div>
          <div className="font-heading font-bold text-3xl text-[#E0E3E5] leading-tight">
            {stats.pendingApproval}
          </div>
        </div>

        {/* Box 3 */}
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4 flex flex-col justify-between h-[94px]">
          <div className="font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
            Auto-Enrolled
          </div>
          <div className="font-heading font-bold text-3xl text-[#E0E3E5] leading-tight">
            {stats.autoEnrolled.toLocaleString()}
          </div>
        </div>

        {/* Box 4 */}
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4 flex flex-col justify-between h-[94px]">
          <div className="font-heading font-bold text-[11px] text-[#FFB4AB] uppercase tracking-[0.55px]">
            Rejected
          </div>
          <div className="font-heading font-bold text-3xl text-[#E0E3E5] leading-tight">
            {stats.rejected}
          </div>
        </div>
      </div>

      {/* Pending Enrollment Overrides Table Card */}
      <div className="bg-[#1D2022] border border-[#424754] rounded-lg overflow-hidden shadow-xl">
        {/* Table Header Bar */}
        <div className="bg-[#272A2C] border-b border-[#424754] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
            Pending Enrollment Overrides
          </h3>

          <div className="flex items-center gap-3">
            <button
              onClick={cycleFilter}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#323537] hover:bg-[#3D4144] border border-[#424754] rounded text-[#E0E3E5] font-heading font-bold text-[11px] uppercase tracking-[0.55px] cursor-pointer transition-colors shadow-sm"
            >
              <Filter size={13} />
              <span>Filter{filterDept !== "ALL" ? `: ${filterDept}` : ""}</span>
            </button>

            <button
              onClick={() => alert("Exporting registration overrides log to CSV...")}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#323537] hover:bg-[#3D4144] border border-[#424754] rounded text-[#E0E3E5] font-heading font-bold text-[11px] uppercase tracking-[0.55px] cursor-pointer transition-colors shadow-sm"
            >
              <Download size={13} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-[#191C1E] border-b border-[#424754]">
                <th className="py-3.5 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                  Student Details
                </th>
                <th className="py-3.5 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                  Course
                </th>
                <th className="py-3.5 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                  Override Reason
                </th>
                <th className="py-3.5 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                  Stakeholders
                </th>
                <th className="py-3.5 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#424754]/40 font-heading">
              {filteredOverrides.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#C2C6D6] text-sm">
                    No pending enrollment overrides matching current filters!
                  </td>
                </tr>
              ) : (
                filteredOverrides.map((item) => (
                  <tr key={item._id} className="hover:bg-[#272A2C]/40 transition-colors">
                    {/* Student Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-[#4D8EFF]/20 flex items-center justify-center text-[#4D8EFF] shrink-0">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#E0E3E5] leading-tight">
                            {item.studentName}
                          </div>
                          <div className="font-mono text-xs text-[#C2C6D6] mt-0.5">
                            SID: {item.studentId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-sm text-[#E0E3E5] leading-tight">
                        {item.courseCode}
                      </div>
                      <div className="text-xs text-[#C2C6D6] mt-0.5">
                        {item.courseSection}
                      </div>
                    </td>

                    {/* Override Reason */}
                    <td className="py-4 px-6">
                      <div className="bg-[#ADC6FF]/10 border border-[#ADC6FF]/20 rounded p-2.5 max-w-xs">
                        <p className="font-heading italic text-xs text-[#ADC6FF] leading-relaxed m-0">
                          "{item.reason}"
                        </p>
                      </div>
                    </td>

                    {/* Stakeholders */}
                    <td className="py-4 px-6">
                      <div className="flex items-center -space-x-2">
                        {item.stakeholders.map((sh, i) => (
                          <div
                            key={i}
                            title={`Stakeholder: ${sh.initials}`}
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] border-2 border-[#1D2022] ${sh.color}`}
                          >
                            {sh.initials}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Approve Button */}
                        <button
                          onClick={() => handleApprove(item)}
                          title="Approve Override"
                          className="w-8 h-8 bg-[#ADC6FF] hover:bg-[#8CAEFF] text-[#002E6A] rounded border-none cursor-pointer flex items-center justify-center transition-transform active:scale-90 shadow-sm"
                        >
                          <Check size={16} strokeWidth={3} />
                        </button>

                        {/* Info Button */}
                        <button
                          onClick={() => handleInfo(item)}
                          title="View Details"
                          className="w-8 h-8 bg-[#323537] hover:bg-[#3D4144] text-[#E0E3E5] rounded border border-[#424754] cursor-pointer flex items-center justify-center transition-colors"
                        >
                          <Info size={16} />
                        </button>

                        {/* Reject Button */}
                        <button
                          onClick={() => handleReject(item)}
                          title="Reject Override"
                          className="w-8 h-8 bg-[#93000A] hover:bg-[#B3000C] text-[#FFDAD6] rounded border-none cursor-pointer flex items-center justify-center transition-transform active:scale-90 shadow-sm"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Bar */}
        <div className="bg-[#191C1E] px-6 py-4 border-t border-[#424754] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#C2C6D6]">
          <div>
            Showing {filteredOverrides.length} of {stats.pendingApproval} pending requests
          </div>

          <div className="flex items-center gap-1.5 font-heading">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 bg-[#323537] hover:bg-[#3D4144] border border-[#424754] rounded text-[#E0E3E5] cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-1 font-bold rounded border-none cursor-pointer ${
                currentPage === 1 ? "bg-[#ADC6FF] text-[#002E6A]" : "bg-[#323537] text-[#E0E3E5]"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(2)}
              className={`px-3 py-1 font-bold rounded border-none cursor-pointer ${
                currentPage === 2 ? "bg-[#ADC6FF] text-[#002E6A]" : "bg-[#323537] text-[#E0E3E5]"
              }`}
            >
              2
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className={`px-3 py-1 font-bold rounded border-none cursor-pointer ${
                currentPage === 3 ? "bg-[#ADC6FF] text-[#002E6A]" : "bg-[#323537] text-[#E0E3E5]"
              }`}
            >
              3
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
              className="px-2.5 py-1 bg-[#323537] hover:bg-[#3D4144] border border-[#424754] rounded text-[#E0E3E5] cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Information 2-Col Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Overriding Policies */}
        <div className="bg-[#1D2022] border border-[#424754] rounded-lg p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="text-[#4CD7F6] w-5 h-5 shrink-0" />
              <h4 className="font-heading font-semibold text-base text-[#E0E3E5] m-0">
                Overriding Policies
              </h4>
            </div>
            <p className="font-heading text-[13px] text-[#C2C6D6] leading-relaxed m-0">
              Manual overrides should only be performed after verifying supporting documentation from the respective Department Head. All registration changes are logged for academic audit purposes.
            </p>
          </div>
        </div>

        {/* Right Card: Recent Activity */}
        <div className="bg-[#1D2022] border border-[#424754] rounded-lg p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <RotateCcw className="text-[#ADC6FF] w-5 h-5 shrink-0" />
            <h4 className="font-heading font-semibold text-base text-[#E0E3E5] m-0">
              Recent Activity
            </h4>
          </div>

          <div className="space-y-3 font-heading text-xs">
            {activities.map((act) => (
              <div key={act.id} className="flex justify-between items-center py-2 border-b border-[#424754]/40 last:border-0">
                <span className="text-[#E0E3E5] font-medium truncate pr-4">
                  {act.text}
                </span>
                <span className="text-[#C2C6D6] shrink-0 font-mono text-[11px]">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationControl;
