import { useState, useEffect } from "react";
import { X } from "lucide-react";

const UserModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    universityId: "",
    idNumber: "",
    role: "student",
    department: "Computer Science",
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        email: "",
        universityId: `2025${Math.floor(1000 + Math.random() * 9000)}`,
        idNumber: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
        role: "student",
        department: "Computer Science",
        isActive: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="box-border w-full max-w-md bg-admin-card border border-admin-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-admin-border bg-[#272A2C]">
          <h3 className="font-heading font-semibold text-lg text-admin-text m-0">
            {initialData ? "Edit User Account" : "Add New User Account"}
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
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. John Doe"
              className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
            />
          </div>

          <div>
            <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. john.doe@morshed.edu"
              className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent capitalize"
              >
                <option value="student">Student</option>
                <option value="professor">Professor</option>
                <option value="advisor">Advisor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Business Admin">Business Admin</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="IT Services">IT Services</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                University ID
              </label>
              <input
                type="text"
                required
                value={formData.universityId}
                onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-[11px] uppercase tracking-wider text-admin-text-muted mb-1.5">
                Status
              </label>
              <select
                value={formData.isActive ? "active" : "suspended"}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                className="w-full px-3 py-2 bg-admin-input border border-admin-border rounded font-heading text-sm text-admin-text focus:outline-none focus:border-admin-accent"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
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
              className="px-5 py-2 font-heading font-bold text-xs uppercase tracking-wider text-[#00285D] bg-[#4D8EFF] hover:bg-[#3D7EEE] border-none rounded cursor-pointer transition-colors shadow-lg shadow-[#4D8EFF]/20"
            >
              {initialData ? "Save Changes" : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
