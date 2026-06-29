import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Bell, User, LogOut } from "lucide-react";
import { ROUTES } from "../../routes/RoutePaths";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const role = user?.role || "student";

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

  return (
    <header className="flex flex-row justify-between items-center px-6 h-[64px] bg-header-bg shadow-sm fixed top-0 left-0 right-0 z-[2]">
      <div className="flex items-center gap-4">
        <h1 className="font-heading font-bold text-2xl text-primary m-0">
          Morshed
        </h1>
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
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-border overflow-hidden">
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
