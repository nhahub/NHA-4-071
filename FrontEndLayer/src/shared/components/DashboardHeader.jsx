import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Bell, User, LogOut, Search } from "lucide-react";
import { ROUTES } from "../../routes/RoutePaths";

const pageTitles = {
  "/admin/dashboard": "System Dashboard",
  "/admin/users": "User Management",
  "/admin/courses": "Course Management",
  "/admin/departments": "Department Management",
  "/admin/semesters": "Semester Configuration",
  "/admin/complaints": "Complaint Management",
  "/admin/registration": "Registration Control",
  "/admin/reports": "Reports & Analytics",
  "/admin/policies": "Academic Policies",
  "/admin/settings": "System Settings",
  "/student/dashboard": "Dashboard",
  "/professor/dashboard": "Dashboard",
  "/advisor/dashboard": "Dashboard",
};

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const role = user?.role || "student";
  const isAdmin = role === "admin";

  const pageTitle =
    pageTitles[location.pathname] ||
    location.pathname.split("/").pop()?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
    "Dashboard";

  const profileRoute =
    role === "student" ? ROUTES.STUDENT.PROFILE
    : role === "professor" ? ROUTES.PROFESSOR.DASHBOARD
    : role === "advisor" ? ROUTES.ADVISOR.DASHBOARD
    : ROUTES.ADMIN.DASHBOARD;

  const notificationsRoute =
    role === "student" ? ROUTES.STUDENT.NOTIFICATIONS
    : role === "professor" ? ROUTES.PROFESSOR.NOTIFICATIONS
    : ROUTES.ADVISOR.DASHBOARD;

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate(ROUTES.LOGIN);
  };

  if (isAdmin) {
    return (
      <header
        className="box-border flex flex-row justify-between items-center px-8 h-[64px] bg-header-bg border-b border-border"
      >
        {/* Left: Title + Search */}
        <div className="flex flex-row items-center gap-4">
          <h2
            className="font-heading font-bold text-2xl leading-8 text-text-primary m-0"
            style={{ letterSpacing: "-0.24px" }}
          >
            {pageTitle}
          </h2>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted"
            />
            <input
              type="text"
              placeholder="Search system records..."
              className="w-[256px] h-8 pl-10 pr-4 py-1.5 font-heading font-normal text-[13px] leading-[17px] text-text-primary placeholder-admin-placeholder bg-admin-input border border-border rounded"
            />
          </div>
        </div>

        {/* Right: Bell + Divider + User + Status Badge */}
        <div className="flex flex-row items-center gap-4">
          <button className="p-2 bg-transparent border-none cursor-pointer">
            <Bell size={20} className="text-admin-accent" />
          </button>

          <div className="w-px h-8" style={{ background: "#424754" }} />

          <div className="flex flex-row items-center gap-2">
            <span
              className="font-heading font-bold text-[11px] leading-4 text-sidebar-text"
              style={{ letterSpacing: "0.55px" }}
            >
              System Status:
            </span>
            <div
              className="flex flex-row items-center px-2 py-0.5 gap-1.5 rounded-xl"
              style={{
                background: "rgba(20, 83, 45, 0.3)",
                border: "1px solid rgba(34, 197, 94, 0.5)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "#22C55E" }}
              />
              <span
                className="font-heading font-bold text-[10px] leading-[15px] uppercase"
                style={{ letterSpacing: "0.5px", color: "#4ADE80" }}
              >
                Active
              </span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Non-admin header (student, professor, advisor)
  return (
    <header className="flex flex-row justify-between items-center px-6 h-[64px] bg-header-bg border-b border-border">
      <div className="flex items-center gap-4">
        <h2 className="font-heading font-bold text-2xl text-primary m-0">
          {pageTitle}
        </h2>
      </div>

      <div className="flex flex-row items-center gap-4">
        <button
          onClick={() => navigate(notificationsRoute)}
          className="relative p-2 rounded-full cursor-pointer bg-transparent border-none"
        >
          <Bell size={20} color="#4F378A" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-none"
          >
            <span className="font-heading text-sm text-text-secondary">{user?.name || "User"}</span>
            <div className="w-8 h-8 rounded-full border border-border bg-sidebar-text flex items-center justify-center overflow-hidden">
              <span className="text-sm text-primary font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50">
              <button
                onClick={() => { setDropdownOpen(false); navigate(profileRoute); }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-heading text-text-primary hover:bg-bg-light transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                <User size={16} color="#4F378A" />
                Profile
              </button>
              <div className="h-[1px] bg-border mx-3" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-heading text-danger hover:bg-bg-light transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                <LogOut size={16} color="#BA1A1A" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
