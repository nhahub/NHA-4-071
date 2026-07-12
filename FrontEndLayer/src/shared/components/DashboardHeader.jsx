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

  if (role === "professor") {
    return (
      <header className="box-border flex flex-row justify-between items-center px-8 h-[64px] bg-header-bg border-b border-border">
        {/* Left: Search */}
        <div className="flex flex-row items-center">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sidebar-text" />
            <input
              type="text"
              placeholder="Search courses or student files..."
              className="w-[320px] h-9 pl-10 pr-4 py-2 font-heading font-normal text-[13px] leading-[17px] text-text-primary placeholder-text-muted bg-bg-page border border-border rounded-lg outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Right: Bell + Settings + User */}
        <div className="flex flex-row items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(notificationsRoute)}
              className="relative p-2 rounded-full cursor-pointer bg-transparent border-none text-sidebar-text hover:text-white transition-colors"
            >
              <Bell size={20} />
            </button>
            <button
              onClick={() => {}}
              className="relative p-2 rounded-full cursor-pointer bg-transparent border-none text-sidebar-text hover:text-white transition-colors"
            >
              {/* Note: Settings is not imported in this file, we should import it or use a fallback. We'll use a standard icon if Settings isn't imported, but let's assume we can import it. */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
          </div>

          <div className="w-px h-8 bg-border" />

          <div className="flex flex-row items-center gap-3 relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex flex-row items-center gap-3 cursor-pointer bg-transparent border-none"
            >
              <div className="flex flex-col items-end text-right">
                <span className="font-heading font-bold text-sm leading-5 text-white">
                  {user?.name || "Dr. Arsalan Morshed"}
                </span>
                <span className="font-heading font-normal text-[11px] leading-4 text-sidebar-text">
                  Senior Faculty
                </span>
              </div>
              <div className="w-9 h-9 rounded-md bg-bg-light border border-border flex items-center justify-center overflow-hidden">
                {/* Fallback avatar image or initial */}
                <span className="text-white font-heading font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "AM"}
                </span>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-bg-light rounded-xl shadow-lg border border-border overflow-hidden z-50">
                <button
                  onClick={() => { setDropdownOpen(false); navigate(profileRoute); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-heading text-text-primary hover:bg-[rgba(255,255,255,0.05)] transition-colors bg-transparent border-none cursor-pointer text-left"
                >
                  <User size={16} className="text-primary" />
                  Profile
                </button>
                <div className="h-[1px] bg-border mx-3" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-heading text-danger hover:bg-[rgba(255,255,255,0.05)] transition-colors bg-transparent border-none cursor-pointer text-left"
                >
                  <LogOut size={16} className="text-danger" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Non-admin, non-professor header (student, advisor)
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
