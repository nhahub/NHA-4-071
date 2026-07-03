import { useState, useEffect } from "react";
import { X } from "lucide-react";

const DepartmentModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    badge: "STEM CORE",
    badgeColor: "blue",
    iconType: "code",
    facultyCount: 20,
    studentCount: 300,
    headName: "",
    headTitle: "PhD, Professor",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
        badge: initialData.badge || "STEM CORE",
        badgeColor: initialData.badgeColor || "blue",
        iconType: initialData.iconType || "code",
        facultyCount: initialData.facultyCount || 20,
        studentCount: initialData.studentCount || 300,
        headName: initialData.head?.name || "",
        headTitle: initialData.head?.title || "PhD, Professor",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        badge: "NEW DEPT",
        badgeColor: "blue",
        iconType: "code",
        facultyCount: 15,
        studentCount: 250,
        headName: "Dr. Alexander Wright",
        headTitle: "PhD, Department Chair",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const initials = formData.headName
      ? formData.headName
          .replace("Dr. ", "")
          .replace("Prof. ", "")
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "DH";

    const savedDept = {
      name: formData.name,
      code: formData.code || formData.name.slice(0, 2).toUpperCase(),
      badge: formData.badge,
      badgeColor: formData.badgeColor,
      iconType: formData.iconType,
      facultyCount: Number(formData.facultyCount),
      studentCount: Number(formData.studentCount),
      head: {
        name: formData.headName || "Position Vacant",
        title: formData.headTitle || "Interim: Faculty Board",
        avatar: initials,
        avatarColor: "bg-[#03B5D3]/20 text-[#4CD7F6] border border-[#4CD7F6]/20",
        status: formData.headName && formData.headName !== "Position Vacant" ? "assigned" : "vacant",
      },
    };

    onSave(savedDept);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="box-border w-full max-w-md bg-admin-card border border-admin-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-admin-border bg-[#272A2C]">
          <h3 className="font-heading font-semibold text-lg text-admin-text m-0">
            {initialData ? "Edit Department Structure" : "Create New Department"}
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
              Department Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Electrical Engineering"
              className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                Dept Code
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. EE"
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent uppercase"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                Category Badge
              </label>
              <select
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent uppercase"
              >
                <option value="STEM CORE">STEM Core</option>
                <option value="RESEARCH LEAD">Research Lead</option>
                <option value="HIGH GROWTH">High Growth</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                Faculty Members
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.facultyCount}
                onChange={(e) => setFormData({ ...formData, facultyCount: e.target.value })}
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                Enrolled Students
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.studentCount}
                onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-admin-border">
            <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
              Department Head Name
            </label>
            <input
              type="text"
              value={formData.headName}
              onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
              placeholder="e.g. Dr. Elias Thorne (or leave blank for Vacant)"
              className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent mb-3"
            />

            <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
              Department Head Title / Credentials
            </label>
            <input
              type="text"
              value={formData.headTitle}
              onChange={(e) => setFormData({ ...formData, headTitle: e.target.value })}
              placeholder="e.g. PhD, Machine Learning"
              className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
            />
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
              {initialData ? "Save Structure" : "+ Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;
