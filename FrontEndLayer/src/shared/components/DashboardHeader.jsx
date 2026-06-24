import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useStudent } from "../../hooks/useStudent";
import { useNotification } from "../../hooks/useNotification";
import { Bell, User, LogOut } from "lucide-react";
import { ROUTES } from "../../routes/RoutePaths";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const { profile, loadProfile } = useStudent();
  const { notifications, loadNotifications } = useNotification();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    loadProfile();
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [loadNotifications]);

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
          onClick={() => navigate(ROUTES.STUDENT.NOTIFICATIONS)}
          className="relative p-2 rounded-full cursor-pointer bg-transparent border-none"
        >
          <Bell size={20} color="#4F378A" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-[5px] rounded-full bg-danger text-white text-[11px] font-bold flex items-center justify-center leading-none">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-none"
          >
            <span className="font-heading text-sm text-text-secondary">{profile?.name || user?.name || "Student"}</span>
            <div className="w-8 h-8 rounded-full border border-border bg-sidebar-text flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm text-primary font-semibold">
                  {(profile?.name || user?.name)?.charAt(0)?.toUpperCase() || "S"}
                </span>
              )}
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-border overflow-hidden">
              <button
                onClick={() => { setDropdownOpen(false); navigate(ROUTES.STUDENT.PROFILE); }}
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
