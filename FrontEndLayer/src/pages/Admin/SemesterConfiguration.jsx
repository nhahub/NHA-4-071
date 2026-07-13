import { useState, useEffect } from "react";
import {
  Calendar, Plus, ChevronLeft, ChevronRight, Edit2,
  Link2, Settings as CogIcon, RotateCcw, Clock, CheckCircle
} from "lucide-react";
import { getAllSemesters, createSemester } from "../../services/adminService";
import SemesterModal from "./components/SemesterModal";

const SemesterConfiguration = () => {
  const [localSemesters, setLocalSemesters] = useState([]);
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(0);

  useEffect(() => {
    getAllSemesters().then((result) => {
      if (result.success && Array.isArray(result.data)) {
        setLocalSemesters(
          result.data.map((sem) => ({
            ...sem,
            status: sem.status || sem.registrationStatus || "UPCOMING",
          }))
        );
      }
    });
  }, []);
  
  // Quick Config Form State
  const [quickForm, setQuickForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    academicYear: "2024-2025",
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const handleOpenAddModal = () => {
    setSelectedSemester(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sem) => {
    setSelectedSemester(sem);
    setIsModalOpen(true);
  };

  const handleSaveSemester = (semData) => {
    if (selectedSemester) {
      setLocalSemesters((prev) =>
        prev.map((s) => (s._id === selectedSemester._id ? { ...s, ...semData } : s))
      );
    } else {
      const newSem = {
        _id: `sem_${Date.now()}`,
        ...semData,
      };
      setLocalSemesters((prev) => [newSem, ...prev]);
    }
  };

  const handleQuickInitialize = (e) => {
    e.preventDefault();
    if (!quickForm.name) {
      alert("Please enter a Semester Name (e.g. Spring 2025)");
      return;
    }

    // Generate code from name e.g. Spring 2025 -> SPR-25
    const parts = quickForm.name.split(" ");
    let code = "SEM-00";
    if (parts.length >= 2) {
      const term = parts[0].slice(0, 3).toUpperCase();
      const yr = parts[parts.length - 1].slice(-2);
      code = `${term}-${yr}`;
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let timelineStr = "Custom Timeline";
    if (quickForm.startDate && quickForm.endDate) {
      const startObj = new Date(quickForm.startDate);
      const endObj = new Date(quickForm.endDate);
      if (!isNaN(startObj) && !isNaN(endObj)) {
        timelineStr = `${months[startObj.getMonth()]} ${String(startObj.getDate()).padStart(2, "0")} - ${months[endObj.getMonth()]} ${String(endObj.getDate()).padStart(2, "0")}`;
      }
    }

    const newSem = {
      _id: `sem_${Date.now()}`,
      semesterId: code,
      displayName: quickForm.name,
      name: quickForm.name,
      timeline: timelineStr,
      startDate: quickForm.startDate,
      endDate: quickForm.endDate,
      enrolled: "0 Students",
      enrolledCount: 0,
      status: "UPCOMING",
      registrationStatus: "upcoming",
      academicYear: quickForm.academicYear,
    };

    setLocalSemesters((prev) => [newSem, ...prev]);
    setQuickForm({ name: "", startDate: "", endDate: "", academicYear: "2024-2025" });
    alert(`Semester "${quickForm.name}" (${code}) initialized successfully!`);
  };

  const currentTimelineSem = localSemesters[activeTimelineIdx] || localSemesters[0] || {
    displayName: "Fall Semester 2024",
    timeline: "Sept - Jan",
  };

  const cycleTimeline = (direction) => {
    if (direction === "next") {
      setActiveTimelineIdx((prev) => (prev + 1) % localSemesters.length);
    } else {
      setActiveTimelineIdx((prev) => (prev - 1 + localSemesters.length) % localSemesters.length);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-[#E0E3E5] tracking-[-0.24px] m-0">
            Semester Configuration
          </h1>
          <p className="font-heading text-sm sm:text-base text-[#C2C6D6] mt-1 m-0">
            Define academic timelines, registration windows, and milestone dates.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#ADC6FF] hover:bg-[#8CAEFF] text-[#002E6A] font-heading font-bold text-[11px] uppercase tracking-[0.55px] rounded border-none cursor-pointer shadow-lg shadow-[#ADC6FF]/20 transition-all transform active:scale-95 whitespace-nowrap"
        >
          <Plus size={16} />
          <span>New Semester</span>
        </button>
      </div>

      {/* Top Bento Layout: Timeline View & Quick Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Semester Timeline */}
        <div className="lg:col-span-2 bg-[#1D2022] border border-[#424754] rounded-lg p-6 flex flex-col justify-between shadow-xl">
          {/* Timeline Header */}
          <div className="flex justify-between items-center border-b border-[#424754] pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#ADC6FF]/20 flex items-center justify-center text-[#ADC6FF]">
                <Calendar size={18} />
              </div>
              <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
                Active Semester Timeline: {currentTimelineSem.displayName}
              </h3>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-[#E0E3E5] bg-[#101415] border border-[#424754] rounded px-3 py-1">
              <button
                onClick={() => cycleTimeline("prev")}
                className="text-[#C2C6D6] hover:text-white bg-transparent border-none cursor-pointer p-0.5"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="uppercase tracking-wider px-1">
                {currentTimelineSem.timeline?.split("-")[0]?.trim() || "SEPT"} - {currentTimelineSem.timeline?.split("-")[1]?.trim() || "JAN"}
              </span>
              <button
                onClick={() => cycleTimeline("next")}
                className="text-[#C2C6D6] hover:text-white bg-transparent border-none cursor-pointer p-0.5"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Months Header Row */}
          <div className="grid grid-cols-4 text-center border-b border-[#424754]/60 pb-2 mb-4 font-heading text-[10px] uppercase font-semibold tracking-wider text-[#C2C6D6]">
            <div>September</div>
            <div>October</div>
            <div>November</div>
            <div>December</div>
          </div>

          {/* Visual Bar Chart Timeline Rows */}
          <div className="space-y-5 pt-2 pb-4 font-heading">
            {/* Registration Row */}
            <div className="flex items-center gap-4">
              <div className="w-32 shrink-0 font-bold text-xs text-[#C2C6D6] uppercase tracking-wider">
                Registration
              </div>
              <div className="flex-1 bg-[#191C1E] rounded-full h-4 relative flex items-center overflow-hidden">
                <div className="absolute left-[10%] w-[26%] h-full bg-[#4CD7F6] rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(76,215,246,0.5)]">
                  <span className="text-[8px] font-bold uppercase text-[#003640] tracking-wider">
                    Open
                  </span>
                </div>
              </div>
            </div>

            {/* Add/Drop Row */}
            <div className="flex items-center gap-4">
              <div className="w-32 shrink-0 font-bold text-xs text-[#C2C6D6] uppercase tracking-wider">
                Add/Drop
              </div>
              <div className="flex-1 bg-[#191C1E] rounded-full h-4 relative flex items-center overflow-hidden">
                <div className="absolute left-[28%] w-[18%] h-full bg-[#ADC6FF] rounded-full shadow" />
              </div>
            </div>

            {/* Midterms Row */}
            <div className="flex items-center gap-4">
              <div className="w-32 shrink-0 font-bold text-xs text-[#C2C6D6] uppercase tracking-wider">
                Midterms
              </div>
              <div className="flex-1 bg-[#191C1E] rounded-full h-4 relative flex items-center overflow-hidden">
                <div className="absolute left-[54%] w-[15%] h-full bg-[#8691A7] rounded-full" />
              </div>
            </div>

            {/* Finals Row */}
            <div className="flex items-center gap-4">
              <div className="w-32 shrink-0 font-bold text-xs text-[#C2C6D6] uppercase tracking-wider">
                Finals
              </div>
              <div className="flex-1 bg-[#191C1E] rounded-full h-4 relative flex items-center overflow-hidden">
                <div className="absolute left-[78%] w-[18%] h-full bg-[#93000A] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Config Form */}
        <div className="bg-[#1D2022] border border-[#424754] border-l-4 border-l-[#ADC6FF] rounded-lg p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0 mb-4">
              Quick Config: New Semester
            </h3>

            <form onSubmit={handleQuickInitialize} className="space-y-4">
              <div>
                <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-[#C2C6D6] mb-1.5">
                  Semester Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spring 2025"
                  value={quickForm.name}
                  onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#101415] border border-[#424754] rounded font-heading text-xs text-[#E0E3E5] placeholder:text-gray-500 focus:outline-none focus:border-[#ADC6FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-[#C2C6D6] mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={quickForm.startDate}
                    onChange={(e) => setQuickForm({ ...quickForm, startDate: e.target.value })}
                    className="w-full px-2.5 py-2 bg-[#101415] border border-[#424754] rounded font-heading text-xs text-[#E0E3E5] focus:outline-none focus:border-[#ADC6FF]"
                  />
                </div>

                <div>
                  <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-[#C2C6D6] mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={quickForm.endDate}
                    onChange={(e) => setQuickForm({ ...quickForm, endDate: e.target.value })}
                    className="w-full px-2.5 py-2 bg-[#101415] border border-[#424754] rounded font-heading text-xs text-[#E0E3E5] focus:outline-none focus:border-[#ADC6FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-[#C2C6D6] mb-1.5">
                  Academic Year
                </label>
                <select
                  value={quickForm.academicYear}
                  onChange={(e) => setQuickForm({ ...quickForm, academicYear: e.target.value })}
                  className="w-full px-3 py-2 bg-[#101415] border border-[#424754] rounded font-heading text-xs text-[#E0E3E5] focus:outline-none focus:border-[#ADC6FF] cursor-pointer"
                >
                  <option value="2024-2025" className="bg-[#101415]">2024-2025</option>
                  <option value="2025-2026" className="bg-[#101415]">2025-2026</option>
                  <option value="2023-2024" className="bg-[#101415]">2023-2024</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#323537] hover:bg-[#3D4144] border border-[#424754] rounded font-heading font-bold text-[11px] uppercase tracking-[0.55px] text-[#E0E3E5] hover:text-[#ADC6FF] cursor-pointer transition-colors shadow"
                >
                  Initialize Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Card: Semester Inventory Table */}
      <div className="bg-[#1D2022] border border-[#424754] rounded-lg overflow-hidden shadow-xl">
        {/* Table Header & Legend */}
        <div className="bg-[#191C1E] border-b border-[#424754] px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
            Semester Inventory
          </h3>

          <div className="flex items-center gap-5 text-xs font-heading">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4CD7F6] shadow-[0_0_6px_rgba(76,215,246,0.6)]" />
              <span className="text-[#E0E3E5]">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ADC6FF]" />
              <span className="text-[#C2C6D6]">Upcoming</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8691A7]" />
              <span className="text-gray-500">Archived</span>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#272A2C]/60 border-b border-[#424754]">
                <th className="py-4 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                  Semester ID
                </th>
                <th className="py-4 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                  Display Name
                </th>
                <th className="py-4 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                  Timeline
                </th>
                <th className="py-4 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                  Enrolled
                </th>
                <th className="py-4 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px]">
                  Status
                </th>
                <th className="py-4 px-6 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-[0.55px] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#424754]/40 font-heading">
              {localSemesters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#C2C6D6] text-sm">
                    No semesters defined yet. Use the Quick Config form to initialize one!
                  </td>
                </tr>
              ) : (
                localSemesters.map((sem) => {
                  let badgeClass = "bg-[#8691A7]/20 text-[#8691A7] border border-[#8691A7]/30";
                  if (sem.status === "ACTIVE") {
                    badgeClass = "bg-[#03B5D3]/20 text-[#4CD7F6] border border-[#4CD7F6]/30";
                  } else if (sem.status === "UPCOMING") {
                    badgeClass = "bg-[#ADC6FF]/20 text-[#ADC6FF] border border-[#ADC6FF]/30";
                  }

                  return (
                    <tr key={sem._id} className="hover:bg-[#272A2C]/40 transition-colors group">
                      {/* Semester ID */}
                      <td className="py-4 px-6 font-mono text-sm font-bold text-[#ADC6FF]">
                        {sem.semesterId || sem._id}
                      </td>

                      {/* Display Name */}
                      <td className="py-4 px-6 font-semibold text-base text-[#E0E3E5]">
                        {sem.displayName || sem.name}
                      </td>

                      {/* Timeline */}
                      <td className="py-4 px-6 font-mono text-sm text-[#C2C6D6]">
                        {sem.timeline || "N/A"}
                      </td>

                      {/* Enrolled */}
                      <td className="py-4 px-6 text-sm text-[#E0E3E5]">
                        {sem.enrolled || `${sem.enrolledCount || 0} Students`}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                          {sem.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(sem)}
                            title="Edit Semester"
                            className="p-1.5 text-[#C2C6D6] hover:text-[#E0E3E5] hover:bg-white/10 rounded border-none bg-transparent cursor-pointer transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>

                          {sem.status === "ACTIVE" && (
                            <button
                              onClick={() => alert(`Managing registration links for ${sem.displayName}...`)}
                              title="Registration Link"
                              className="p-1.5 text-[#C2C6D6] hover:text-[#4CD7F6] hover:bg-[#4CD7F6]/10 rounded border-none bg-transparent cursor-pointer transition-colors"
                            >
                              <Link2 size={16} />
                            </button>
                          )}

                          {sem.status === "UPCOMING" && (
                            <button
                              onClick={() => alert(`Opening milestone parameters for ${sem.displayName}...`)}
                              title="Configure Milestones"
                              className="p-1.5 text-[#C2C6D6] hover:text-[#ADC6FF] hover:bg-[#ADC6FF]/10 rounded border-none bg-transparent cursor-pointer transition-colors"
                            >
                              <CogIcon size={16} />
                            </button>
                          )}

                          {sem.status === "ARCHIVED" && (
                            <button
                              onClick={() => alert(`Viewing archived logs for ${sem.displayName}...`)}
                              title="View History"
                              className="p-1.5 text-gray-500 hover:text-[#E0E3E5] hover:bg-white/10 rounded border-none bg-transparent cursor-pointer transition-colors"
                            >
                              <RotateCcw size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <SemesterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSemester}
        initialData={selectedSemester}
      />
    </div>
  );
};

export default SemesterConfiguration;
