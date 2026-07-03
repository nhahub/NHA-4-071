import { useState, useEffect } from "react";
import { X } from "lucide-react";

const SemesterModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    displayName: "",
    semesterId: "",
    startDate: "",
    endDate: "",
    academicYear: "2024-2025",
    status: "ACTIVE",
    enrolledCount: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        displayName: initialData.displayName || initialData.name || "",
        semesterId: initialData.semesterId || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        academicYear: initialData.academicYear || "2024-2025",
        status: initialData.status || "ACTIVE",
        enrolledCount: initialData.enrolledCount || 0,
      });
    } else {
      setFormData({
        displayName: "",
        semesterId: "",
        startDate: "",
        endDate: "",
        academicYear: "2024-2025",
        status: "UPCOMING",
        enrolledCount: 0,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let timelineStr = "Custom Timeline";
    if (formData.startDate && formData.endDate) {
      const startObj = new Date(formData.startDate);
      const endObj = new Date(formData.endDate);
      if (!isNaN(startObj) && !isNaN(endObj)) {
        const startM = months[startObj.getMonth()];
        const endM = months[endObj.getMonth()];
        const startD = String(startObj.getDate()).padStart(2, "0");
        const endD = String(endObj.getDate()).padStart(2, "0");
        timelineStr = `${startM} ${startD} - ${endM} ${endD}`;
      }
    }

    const savedSemester = {
      ...formData,
      name: formData.displayName,
      timeline: timelineStr,
      enrolled: `${formData.enrolledCount.toLocaleString()} Students`,
    };

    onSave(savedSemester);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="box-border w-full max-w-md bg-admin-card border border-admin-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-admin-border bg-[#272A2C]">
          <h3 className="font-heading font-semibold text-lg text-admin-text m-0">
            {initialData ? "Edit Semester Configuration" : "New Semester Setup"}
          </h3>
          <button
            onClick={onClose}
            className="text-admin-text-muted hover:text-admin-text bg-transparent border-none cursor-pointer p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              required
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="e.g. Fall Semester 2025"
              className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                Semester ID
              </label>
              <input
                type="text"
                required
                value={formData.semesterId}
                onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })}
                placeholder="e.g. FALL-25"
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent uppercase font-mono"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent uppercase"
              >
                <option value="ACTIVE">Active</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                End Date
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                Academic Year
              </label>
              <select
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
              >
                <option value="2025-2026">2025-2026</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
              </select>
            </div>

            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                Enrolled Students
              </label>
              <input
                type="number"
                min="0"
                value={formData.enrolledCount}
                onChange={(e) => setFormData({ ...formData, enrolledCount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-admin-border mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-heading font-bold text-xs uppercase tracking-wider text-admin-text-muted bg-transparent hover:bg-white/5 border border-admin-border rounded cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-heading font-bold text-xs uppercase tracking-wider text-[#002E6A] bg-[#ADC6FF] hover:bg-[#8CAEFF] border-none rounded cursor-pointer transition-colors shadow-lg shadow-[#ADC6FF]/20"
            >
              {initialData ? "Save Changes" : "+ Add Semester"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SemesterModal;
