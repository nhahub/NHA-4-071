import { useState } from "react";
import {
  Building2, Users, GraduationCap, AlertCircle, Filter,
  Plus, Code, Settings as CogIcon, Palette, Briefcase,
  MoreVertical, UserCheck
} from "lucide-react";
import { departments as initialDepts, pendingAllocations as initialAllocations } from "../../dummyData";
import DepartmentModal from "./components/DepartmentModal";

const DepartmentManagement = () => {
  const [localDepts, setLocalDepts] = useState(initialDepts);
  const [localAllocations, setLocalAllocations] = useState(initialAllocations);
  const [filterCategory, setFilterCategory] = useState("ALL");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const handleOpenAddModal = () => {
    setSelectedDept(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dept) => {
    setSelectedDept(dept);
    setIsModalOpen(true);
  };

  const handleSaveDept = (deptData) => {
    if (selectedDept) {
      setLocalDepts((prev) =>
        prev.map((d) => (d._id === selectedDept._id ? { ...d, ...deptData } : d))
      );
    } else {
      const newDept = {
        _id: `d_${Date.now()}`,
        ...deptData,
      };
      setLocalDepts((prev) => [...prev, newDept]);
    }
  };

  const handleChangeHead = (deptName) => {
    const newHead = prompt(`Enter new Department Head name for ${deptName}:`, "Dr. Alexander Wright");
    if (newHead) {
      setLocalDepts((prev) =>
        prev.map((d) => {
          if (d.name === deptName) {
            const initials = newHead.replace("Dr. ", "").replace("Prof. ", "").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
            return {
              ...d,
              head: {
                name: newHead,
                title: "PhD, Department Chair",
                avatar: initials || "DH",
                avatarColor: "bg-[#03B5D3]/20 text-[#4CD7F6] border border-[#4CD7F6]/20",
                status: "assigned",
              },
            };
          }
          return d;
        })
      );
    }
  };

  const handleAssignDept = (allocId, facultyName) => {
    const targetDept = prompt(`Assign ${facultyName} to which department?`, "Computer Science");
    if (targetDept) {
      alert(`${facultyName} successfully assigned to ${targetDept}!`);
      setLocalAllocations((prev) => prev.filter((a) => a._id !== allocId));
      // Increment faculty count in target dept if matched
      setLocalDepts((prev) =>
        prev.map((d) => (d.name.toLowerCase() === targetDept.toLowerCase() ? { ...d, facultyCount: d.facultyCount + 1 } : d))
      );
    }
  };

  const filteredDepts = localDepts.filter((dept) => {
    if (filterCategory === "ALL") return true;
    return dept.badge?.toUpperCase() === filterCategory;
  });

  // Helper for department icon
  const renderDeptIcon = (type, className = "w-5 h-5") => {
    switch (type) {
      case "code":
        return <Code className={className} />;
      case "gear":
        return <CogIcon className={className} />;
      case "palette":
        return <Palette className={className} />;
      default:
        return <Briefcase className={className} />;
    }
  };

  // Helper for badge colors
  const getBadgeStyle = (badge) => {
    switch (badge?.toUpperCase()) {
      case "STEM CORE":
        return "bg-[#4D8EFF]/20 text-[#4D8EFF] border border-[#4D8EFF]/30";
      case "RESEARCH LEAD":
        return "bg-[#8691A7]/20 text-[#BCC7DE] border border-[#BCC7DE]/30";
      case "HIGH GROWTH":
        return "bg-[#FFB4AB]/20 text-[#FFB4AB] border border-[#FFB4AB]/30";
      default:
        return "bg-[#ADC6FF]/20 text-[#ADC6FF] border border-[#ADC6FF]/30";
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4 flex items-center gap-4 h-[90px]">
          <div className="w-11 h-11 rounded bg-[#4D8EFF]/20 flex items-center justify-center text-[#4D8EFF] shrink-0">
            <Building2 size={20} />
          </div>
          <div>
            <div className="font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
              Total Depts
            </div>
            <div className="font-heading font-bold text-3xl text-[#ADC6FF] leading-tight mt-0.5">
              {localDepts.length || 12}
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4 flex items-center gap-4 h-[90px]">
          <div className="w-11 h-11 rounded bg-[#03B5D3]/20 flex items-center justify-center text-[#4CD7F6] shrink-0">
            <Users size={20} />
          </div>
          <div>
            <div className="font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
              Faculty Count
            </div>
            <div className="font-heading font-bold text-3xl text-[#4CD7F6] leading-tight mt-0.5">
              482
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4 flex items-center gap-4 h-[90px]">
          <div className="w-11 h-11 rounded bg-[#8691A7]/20 flex items-center justify-center text-[#BCC7DE] shrink-0">
            <GraduationCap size={20} />
          </div>
          <div>
            <div className="font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
              Students
            </div>
            <div className="font-heading font-bold text-3xl text-[#BCC7DE] leading-tight mt-0.5">
              3,120
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4 flex items-center gap-4 h-[90px]">
          <div className="w-11 h-11 rounded bg-[#FFB4AB]/20 flex items-center justify-center text-[#FFB4AB] shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <div className="font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
              Open Requests
            </div>
            <div className="font-heading font-bold text-3xl text-[#FFB4AB] leading-tight mt-0.5">
              {localAllocations.length || 18}
            </div>
          </div>
        </div>
      </div>

      {/* Academic Entities Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-2">
        <div>
          <h2 className="font-heading font-semibold text-2xl text-[#E0E3E5] tracking-[-0.24px] m-0">
            Academic Entities
          </h2>
          <p className="font-heading text-[13px] text-[#C2C6D6] mt-1 m-0">
            Manage department structures, faculty allocation, and administrative heads.
          </p>
        </div>

        <div className="flex items-center gap-4 self-stretch sm:self-auto">
          {/* Filter dropdown/cycle */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-[#323537] hover:bg-[#3D4144] border border-[#424754] rounded text-[#E0E3E5] font-heading font-bold text-[11px] uppercase tracking-[0.55px] cursor-pointer focus:outline-none appearance-none pr-8"
            >
              <option value="ALL">Filter: All Categories</option>
              <option value="STEM CORE">STEM Core</option>
              <option value="RESEARCH LEAD">Research Lead</option>
              <option value="HIGH GROWTH">High Growth</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>
            <Filter size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#E0E3E5] pointer-events-none" />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#ADC6FF] hover:bg-[#8CAEFF] text-[#002E6A] font-heading font-bold text-[11px] uppercase tracking-[0.55px] rounded border-none cursor-pointer shadow-lg shadow-[#ADC6FF]/10 transition-all transform active:scale-95 whitespace-nowrap"
          >
            <Plus size={15} />
            <span>New Department</span>
          </button>
        </div>
      </div>

      {/* Department Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts.map((dept) => {
          const badgeClass = getBadgeStyle(dept.badge);
          const isVacant = dept.head?.status === "vacant";

          return (
            <div
              key={dept._id}
              className="relative bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#424754] rounded-lg p-6 flex flex-col justify-between overflow-hidden group hover:border-[#ADC6FF]/50 transition-all shadow-xl min-h-[260px]"
            >
              {/* Background watermark icon */}
              <div className="absolute -right-3 -top-3 opacity-[0.04] text-white group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                {renderDeptIcon(dept.iconType, "w-32 h-32")}
              </div>

              {/* Card Header */}
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#4D8EFF]/20 flex items-center justify-center text-[#4D8EFF] shrink-0">
                      {renderDeptIcon(dept.iconType, "w-5 h-5")}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0 leading-tight">
                        {dept.name}
                      </h3>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${badgeClass}`}>
                        {dept.badge || "GENERAL"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenEditModal(dept)}
                    title="Edit Department"
                    className="p-1 text-[#C2C6D6] hover:text-[#E0E3E5] bg-transparent border-none cursor-pointer rounded hover:bg-white/10 transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-2">
                  <div>
                    <div className="font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                      Faculty
                    </div>
                    <div className="font-mono text-sm font-semibold text-[#E0E3E5] mt-0.5">
                      {dept.facultyCount || 0} Members
                    </div>
                  </div>

                  <div>
                    <div className="font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                      Students
                    </div>
                    <div className="font-mono text-sm font-semibold text-[#E0E3E5] mt-0.5">
                      {dept.studentCount || 0} Enrolled
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Head Footer Box */}
              <div className="mt-6">
                <div className="font-heading font-semibold text-[11px] text-[#C2C6D6] uppercase tracking-wider mb-1.5">
                  Department Head
                </div>
                <div className="bg-[#101415]/80 border border-[#424754] rounded-md p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${dept.head?.avatarColor || "bg-[#8691A7]/20 text-[#BCC7DE]"}`}>
                      {dept.head?.avatar || "DH"}
                    </div>
                    <div className="min-w-0">
                      <div className="font-heading font-semibold text-xs text-[#E0E3E5] truncate leading-tight">
                        {dept.head?.name || "Position Vacant"}
                      </div>
                      <div className="font-heading text-[10px] text-[#C2C6D6] truncate mt-0.5">
                        {dept.head?.title || "Interim: Faculty Board"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleChangeHead(dept.name)}
                    className="px-2.5 py-1 bg-transparent hover:bg-white/5 font-heading font-bold text-[11px] uppercase tracking-wider text-[#ADC6FF] border border-transparent hover:border-[#ADC6FF]/30 rounded cursor-pointer transition-all shrink-0"
                  >
                    {isVacant ? "ASSIGN" : "CHANGE"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Allocations Section */}
      <div className="bg-[#1D2022] border border-[#424754] rounded-lg overflow-hidden shadow-xl mt-8">
        {/* Table Card Header */}
        <div className="bg-[#191C1E] border-b border-[#424754] px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
              Pending Allocations
            </h3>
            <p className="font-heading text-xs text-[#C2C6D6] mt-1 m-0">
              Faculty waiting for primary department assignment.
            </p>
          </div>
          <button
            onClick={() => alert("Opening full faculty registry...")}
            className="font-heading font-bold text-[11px] uppercase tracking-wider text-[#ADC6FF] hover:text-[#8CAEFF] bg-transparent border-none cursor-pointer transition-colors"
          >
            View All Faculty
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#272A2C]/60 border-b border-[#424754]">
                <th className="py-3.5 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                  Faculty Name
                </th>
                <th className="py-3.5 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                  Specialization
                </th>
                <th className="py-3.5 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                  Status
                </th>
                <th className="py-3.5 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px] text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#424754]/40 font-heading">
              {localAllocations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#C2C6D6] text-sm">
                    No pending allocations. All faculty members have been assigned!
                  </td>
                </tr>
              ) : (
                localAllocations.map((alloc) => (
                  <tr key={alloc._id} className="hover:bg-[#272A2C]/40 transition-colors">
                    {/* Faculty Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs shrink-0 ${alloc.avatarColor}`}>
                          {alloc.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#E0E3E5] leading-tight">
                            {alloc.name}
                          </div>
                          <div className="text-[11px] text-[#C2C6D6] mt-0.5">
                            {alloc.title}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="py-4 px-6 font-mono text-sm text-[#E0E3E5]">
                      {alloc.specialization}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        alloc.status === "UNDER REVIEW"
                          ? "bg-[#03B5D3]/20 text-[#4CD7F6] border border-[#4CD7F6]/30"
                          : "bg-[#FFB4AB]/20 text-[#FFB4AB] border border-[#FFB4AB]/30"
                      }`}>
                        {alloc.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleAssignDept(alloc._id, alloc.name)}
                        className="px-3.5 py-1.5 bg-[#323537] hover:bg-[#3D4144] border border-[#424754] rounded font-heading font-bold text-[11px] uppercase tracking-[0.55px] text-[#ADC6FF] cursor-pointer transition-colors shadow-sm"
                      >
                        Assign Dept
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Department Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDept}
        initialData={selectedDept}
      />
    </div>
  );
};

export default DepartmentManagement;
