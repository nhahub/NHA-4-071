import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { User, LogOut, Search, Menu } from "lucide-react";
import { ROUTES } from "../../routes/RoutePaths";
import NotificationBell from "./NotificationBell";

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

const DashboardHeader = ({ onMenuToggle }) => {
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
        className="box-border flex flex-row justify-between items-center px-4 md:px-8 h-[64px] bg-header-bg border-b border-border"
      >
        {/* Left: Title + Search */}
        <div className="flex flex-row items-center gap-4">
          <h2
            className="font-heading font-bold text-lg md:text-2xl leading-8 text-text-primary m-0"
            style={{ letterSpacing: "-0.24px" }}
          >
            {pageTitle}
          </h2>
          <div className="relative hidden md:block">
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

        {/* Right: Bell + Divider + User Dropdown */}
        <div className="flex flex-row items-center gap-2 md:gap-4">
          <NotificationBell />

          <div className="w-px h-8 hidden md:block" style={{ background: "#424754" }} />

          <div className="flex flex-row items-center gap-3 relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex flex-row items-center gap-3 cursor-pointer bg-transparent border-none"
            >
              <div className="flex-col items-end text-right hidden md:flex">
                <span className="font-heading font-bold text-sm leading-5 text-white">
                  {user?.name || "Admin"}
                </span>
                <span className="font-heading font-normal text-[11px] leading-4 text-sidebar-text">
                  System Administrator
                </span>
              </div>
              <div className="w-9 h-9 rounded-md bg-bg-light border border-border flex items-center justify-center overflow-hidden">
                <span className="text-white font-heading font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </span>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-bg-light rounded-xl shadow-lg border border-border overflow-hidden z-50">
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

  if (role === "professor") {
    return (
      <header className="box-border flex flex-row justify-between items-center px-4 md:px-8 h-[64px] bg-header-bg border-b border-border">
        {/* Left: Hamburger + Search */}
        <div className="flex flex-row items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 bg-transparent border-none cursor-pointer text-sidebar-text hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="relative hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sidebar-text" />
            <input
              type="text"
              placeholder="Search courses or student files..."
              className="w-[200px] md:w-[320px] h-9 pl-10 pr-4 py-2 font-heading font-normal text-[13px] leading-[17px] text-text-primary placeholder-text-muted bg-bg-page border border-border rounded-lg outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Right: Bell + User */}
        <div className="flex flex-row items-center gap-4 md:gap-6">
          <NotificationBell />

          <div className="w-px h-8 bg-border hidden md:block" />

          <div className="flex flex-row items-center gap-3 relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex flex-row items-center gap-3 cursor-pointer bg-transparent border-none"
            >
              <div className="flex-col items-end text-right hidden md:flex">
                <span className="font-heading font-bold text-sm leading-5 text-white">
                  {user?.name || "Dr. Arsalan Morshed"}
                </span>
                <span className="font-heading font-normal text-[11px] leading-4 text-sidebar-text">
                  Senior Faculty
                </span>
              </div>
              <div className="w-9 h-9 rounded-md bg-bg-light border border-border flex items-center justify-center overflow-hidden">
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
    <header className="flex flex-row justify-between items-center px-4 md:px-6 h-[64px] bg-header-bg border-b border-border">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 bg-transparent border-none cursor-pointer text-sidebar-text hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="font-heading font-bold text-lg md:text-2xl text-primary m-0">
          {pageTitle}
        </h2>
      </div>

      <div className="flex flex-row items-center gap-3 md:gap-4">
        <NotificationBell />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-none"
          >
            <span className="font-heading text-sm text-text-secondary hidden sm:inline">{user?.name || "User"}</span>
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
