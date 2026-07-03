import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../store/admin/adminThunks";
import {
  Search, UserPlus, Filter, Download, Printer, Edit2,
  Ban, CheckCircle, RotateCcw, ChevronLeft, ChevronRight,
  GraduationCap, Users, Shield, UserCheck
} from "lucide-react";
import UserModal from "./components/UserModal";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);

  // Local state for filtering, pagination, and modal
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("Any Status");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [localUsers, setLocalUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users && users.length > 0) {
      setLocalUsers(users);
    }
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return localUsers.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.idNumber && user.idNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.universityId && user.universityId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole =
        roleFilter === "All Roles" ||
        user.role?.toLowerCase() === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "Any Status" ||
        (statusFilter === "Active" && user.isActive) ||
        (statusFilter === "Suspended" && !user.isActive);

      const matchesDept =
        deptFilter === "All Departments" ||
        user.department?.toLowerCase() === deptFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus && matchesDept;
    });
  }, [localUsers, searchQuery, roleFilter, statusFilter, deptFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      setLocalUsers((prev) =>
        prev.map((u) => (u._id === selectedUser._id ? { ...u, ...userData } : u))
      );
    } else {
      const newUser = {
        _id: `u_${Date.now()}`,
        idNumber: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
        ...userData,
      };
      setLocalUsers((prev) => [newUser, ...prev]);
    }
  };

  const handleToggleStatus = (userId) => {
    setLocalUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const handleResetPassword = (userName) => {
    alert(`Password reset link sent to ${userName || "user"}'s registered email address.`);
  };

  // Helper for role badges
  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "professor":
        return {
          bg: "bg-[#ADC6FF]/10",
          border: "border-[#ADC6FF]/20",
          text: "text-[#ADC6FF]",
        };
      case "student":
        return {
          bg: "bg-[#8691A7]/20",
          border: "border-[#BCC7DE]/20",
          text: "text-[#BCC7DE]",
        };
      case "advisor":
        return {
          bg: "bg-[#ADC6FF]/15",
          border: "border-[#ADC6FF]/30",
          text: "text-[#ADC6FF]",
        };
      case "admin":
        return {
          bg: "bg-[#4CD7F6]/10",
          border: "border-[#4CD7F6]/20",
          text: "text-[#4CD7F6]",
        };
      default:
        return {
          bg: "bg-white/10",
          border: "border-white/20",
          text: "text-white",
        };
    }
  };

  // Helper for avatar colors
  const getAvatarStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "professor":
        return "bg-[#03B5D3]/20 text-[#4CD7F6] border border-[#4CD7F6]/20";
      case "admin":
        return "bg-[#4F378A]/30 text-[#E9DDFF] border border-[#E9DDFF]/20";
      case "advisor":
        return "bg-[#ADC6FF]/20 text-[#ADC6FF] border border-[#ADC6FF]/20";
      default:
        return "bg-[#322F35] text-[#E0E3E5] border border-admin-border";
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Header & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-admin-text tracking-[-0.24px] m-0">
            User Management
          </h1>
          <p className="font-heading text-sm text-admin-text-muted mt-1 m-0">
            Configure and manage institutional roles, access levels, and account statuses.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#4D8EFF] hover:bg-[#3D7EEE] text-[#00285D] font-heading font-bold text-[11px] uppercase tracking-[0.55px] rounded border-none cursor-pointer shadow-lg shadow-[#4D8EFF]/20 transition-all transform active:scale-95"
        >
          <UserPlus size={16} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filters & Controls */}
      <div className="bg-admin-card border border-admin-border rounded-lg p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Role Filter */}
          <div className="flex items-center gap-2 bg-[#101415] border border-admin-border rounded px-3 py-1.5 min-w-[180px]">
            <span className="font-heading font-bold text-[11px] text-admin-text-muted uppercase tracking-[0.55px] whitespace-nowrap">
              Filter by Role:
            </span>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none font-heading font-semibold text-xs text-admin-text focus:outline-none cursor-pointer flex-1"
            >
              <option value="All Roles" className="bg-[#101415]">All Roles</option>
              <option value="student" className="bg-[#101415]">Student</option>
              <option value="professor" className="bg-[#101415]">Professor</option>
              <option value="advisor" className="bg-[#101415]">Advisor</option>
              <option value="admin" className="bg-[#101415]">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-[#101415] border border-admin-border rounded px-3 py-1.5 min-w-[160px]">
            <span className="font-heading font-bold text-[11px] text-admin-text-muted uppercase tracking-[0.55px] whitespace-nowrap">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none font-heading font-semibold text-xs text-admin-text focus:outline-none cursor-pointer flex-1"
            >
              <option value="Any Status" className="bg-[#101415]">Any Status</option>
              <option value="Active" className="bg-[#101415]">Active</option>
              <option value="Suspended" className="bg-[#101415]">Suspended</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2 bg-[#101415] border border-admin-border rounded px-3 py-1.5 min-w-[220px]">
            <span className="font-heading font-bold text-[11px] text-admin-text-muted uppercase tracking-[0.55px] whitespace-nowrap">
              Department:
            </span>
            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none font-heading font-semibold text-xs text-admin-text focus:outline-none cursor-pointer flex-1"
            >
              <option value="All Departments" className="bg-[#101415]">All Departments</option>
              <option value="Computer Science" className="bg-[#101415]">Computer Science</option>
              <option value="Business Admin" className="bg-[#101415]">Business Admin</option>
              <option value="Mathematics" className="bg-[#101415]">Mathematics</option>
              <option value="Physics" className="bg-[#101415]">Physics</option>
              <option value="IT Services" className="bg-[#101415]">IT Services</option>
            </select>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 bg-[#101415] border border-admin-border rounded font-heading text-xs text-admin-text placeholder:text-admin-text-muted focus:outline-none focus:border-admin-accent transition-colors"
            />
          </div>

          <button
            onClick={() => alert("Exporting user table as CSV...")}
            title="Download CSV"
            className="p-2 bg-[#101415] hover:bg-[#272A2C] border border-admin-border rounded text-admin-text-muted hover:text-admin-text cursor-pointer transition-colors"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => window.print()}
            title="Print List"
            className="p-2 bg-[#101415] hover:bg-[#272A2C] border border-admin-border rounded text-admin-text-muted hover:text-admin-text cursor-pointer transition-colors"
          >
            <Printer size={16} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-admin-card border border-admin-border rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#272A2C] border-b border-admin-border">
                <th className="py-4 px-6 font-heading font-bold text-[11px] text-admin-text-muted uppercase tracking-[0.55px] w-[260px]">
                  User Profile
                </th>
                <th className="py-4 px-6 font-heading font-bold text-[11px] text-admin-text-muted uppercase tracking-[0.55px] w-[130px]">
                  ID Number
                </th>
                <th className="py-4 px-6 font-heading font-bold text-[11px] text-admin-text-muted uppercase tracking-[0.55px] w-[130px]">
                  Role
                </th>
                <th className="py-4 px-6 font-heading font-bold text-[11px] text-admin-text-muted uppercase tracking-[0.55px] w-[160px]">
                  Department
                </th>
                <th className="py-4 px-6 font-heading font-bold text-[11px] text-admin-text-muted uppercase tracking-[0.55px] w-[130px]">
                  Status
                </th>
                <th className="py-4 px-6 font-heading font-bold text-[11px] text-admin-text-muted uppercase tracking-[0.55px] text-right w-[160px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border/40 font-heading">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-admin-text-muted">
                    <div className="inline-block w-6 h-6 border-2 border-[#4D8EFF] border-t-transparent rounded-full animate-spin mb-2" />
                    <div>Loading users...</div>
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-admin-text-muted">
                    No users found matching your search criteria.
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => {
                  const badge = getRoleBadgeStyle(user.role);
                  const avatarClass = getAvatarStyle(user.role);
                  const initials = user.name
                    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
                    : "U";

                  return (
                    <tr key={user._id} className="hover:bg-[#272A2C]/50 transition-colors group">
                      {/* User Profile */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${avatarClass}`}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-base text-admin-text leading-tight truncate">
                              {user.name || "Unnamed User"}
                            </div>
                            <div className="text-[11px] text-admin-text-muted mt-0.5 truncate">
                              {user.email || "no-email@morshed.edu"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ID Number */}
                      <td className="py-4 px-6 font-mono text-sm text-admin-text whitespace-nowrap">
                        {user.idNumber || user.universityId || `USR-${user._id}`}
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.55px] border ${badge.bg} ${badge.border} ${badge.text}`}>
                          {user.role || "student"}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-4 px-6 text-sm text-admin-text whitespace-nowrap">
                        {user.department || "General"}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <>
                              <div className="w-2 h-2 rounded-full bg-[#4CD7F6] shadow-[0_0_8px_rgba(76,215,246,0.6)] shrink-0" />
                              <span className="text-sm text-admin-text">Active</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 rounded-full bg-gray-500 shrink-0" />
                              <span className="text-sm text-gray-400">Suspended</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            title="Edit User"
                            className="p-1.5 text-admin-text-muted hover:text-admin-text hover:bg-white/10 rounded border-none bg-transparent cursor-pointer transition-colors"
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(user._id)}
                            title={user.isActive ? "Suspend Account" : "Activate Account"}
                            className={`p-1.5 rounded border-none bg-transparent cursor-pointer transition-colors ${
                              user.isActive
                                ? "text-admin-text-muted hover:text-red-400 hover:bg-red-500/10"
                                : "text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            }`}
                          >
                            {user.isActive ? <Ban size={15} /> : <CheckCircle size={15} />}
                          </button>

                          <button
                            onClick={() => handleResetPassword(user.name)}
                            title="Send Password Reset"
                            className="p-1.5 text-admin-text-muted hover:text-admin-accent hover:bg-admin-accent/10 rounded border-none bg-transparent cursor-pointer transition-colors"
                          >
                            <RotateCcw size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-[#1D2022] border-t border-admin-border gap-4 text-xs">
          <div className="text-admin-text-muted font-heading">
            Showing <span className="font-semibold text-admin-text">{filteredUsers.length > 0 ? indexOfFirstItem + 1 : 0}</span> to{" "}
            <span className="font-semibold text-admin-text">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of{" "}
            <span className="font-semibold text-admin-text">{filteredUsers.length}</span> users
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-admin-text-muted hover:text-admin-text disabled:opacity-30 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded font-heading font-bold text-xs border-none cursor-pointer transition-colors ${
                  currentPage === page
                    ? "bg-[#4D8EFF] text-[#00285D] shadow"
                    : "bg-transparent text-admin-text-muted hover:bg-white/5 hover:text-admin-text"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-admin-text-muted hover:text-admin-text disabled:opacity-30 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Card 1 */}
        <div className="relative bg-admin-card border border-admin-border rounded-lg p-5 overflow-hidden flex flex-col justify-between h-24 group hover:border-[#4CD7F6]/30 transition-colors">
          <div className="font-heading font-bold text-[11px] text-admin-text-muted uppercase tracking-[0.55px]">
            Total Verified Students
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <div className="font-heading font-bold text-3xl text-[#4CD7F6]">
              3,842
            </div>
            <div className="font-heading text-xs font-semibold text-[#4ADE80]">
              ↗ +12% this year
            </div>
          </div>
          <GraduationCap className="absolute right-3 bottom-2 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none" size={64} />
        </div>

        {/* Card 2 */}
        <div className="relative bg-admin-card border border-admin-border rounded-lg p-5 overflow-hidden flex flex-col justify-between h-24 group hover:border-[#ADC6FF]/30 transition-colors">
          <div className="font-heading font-bold text-[11px] text-admin-text-muted uppercase tracking-[0.55px]">
            Faculty Strength
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <div className="font-heading font-bold text-3xl text-admin-text">
              284
            </div>
            <div className="font-heading text-xs text-admin-text-muted">
              Active Professors
            </div>
          </div>
          <Users className="absolute right-3 bottom-2 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none" size={64} />
        </div>

        {/* Card 3 */}
        <div className="relative bg-admin-card border border-admin-border rounded-lg p-5 overflow-hidden flex flex-col justify-between h-24 group hover:border-[#E9DDFF]/30 transition-colors">
          <div className="font-heading font-bold text-[11px] text-admin-text-muted uppercase tracking-[0.55px]">
            Admin Logins (24h)
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <div className="font-heading font-bold text-3xl text-admin-text">
              18
            </div>
            <div className="font-heading text-xs text-admin-text-muted">
              Global locations
            </div>
          </div>
          <Shield className="absolute right-3 bottom-2 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none" size={64} />
        </div>
      </div>

      {/* Add / Edit Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        initialData={selectedUser}
      />
    </div>
  );
};

export default UserManagement;
