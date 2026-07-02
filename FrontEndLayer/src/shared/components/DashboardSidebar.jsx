import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { roleNavConfig } from "../config/roleNavConfig";
import { LogOut, HelpCircle } from "lucide-react";

const roleSubtitles = {
  admin: "Admin Portal",
  student: "Student Portal",
  professor: "Faculty Portal",
  advisor: "Advisor Portal",
};

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = user?.role || "student";
  const navLinks = roleNavConfig[role] || roleNavConfig.student;
  const isAdmin = role === "admin";

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <aside
      className="box-border flex flex-col justify-between items-start py-4 w-[240px] h-screen overflow-y-auto bg-sidebar-bg border-r border-border fixed top-0 left-0 z-10"
    >
      {/* Brand + Subtitle */}
      <div className="flex flex-col items-start w-full">
        <div className="flex flex-col items-start px-6 pb-8 w-full">
          <span
            className="font-heading font-bold text-[32px] leading-[40px] text-sidebar-active"
            style={{ letterSpacing: "-0.64px" }}
          >
            Morshed
          </span>
          <span
            className="font-heading font-bold text-[11px] leading-4 text-sidebar-text opacity-70"
            style={{ letterSpacing: "0.55px" }}
          >
            {roleSubtitles[role] || "Portal"}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col items-start gap-1 w-full flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={`box-border flex flex-row items-center px-3 py-2 gap-3 w-full no-underline font-heading font-bold text-[11px] leading-4 transition-all duration-150 ease-in-out border-l-4 ${
                  active
                    ? "bg-bg-light border-l-sidebar-active text-sidebar-active"
                    : "border-l-transparent text-sidebar-text"
                }`}
                style={{ letterSpacing: "0.55px" }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={18} className={active ? "text-sidebar-active" : "text-sidebar-text"} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-start w-full border-t border-border pt-6 px-3">
        {isAdmin ? (
          /* Admin: user profile card */
          <div className="flex flex-row items-center px-3 py-4 gap-3 w-full">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-xl text-white font-heading font-bold text-sm flex-shrink-0"
              style={{ background: "#4D8EFF" }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex flex-col items-start">
              <span className="font-heading font-bold text-xs leading-[18px] text-text-primary">
                {user?.name || "Admin Supervisor"}
              </span>
              <span className="font-heading font-normal text-[10px] leading-[15px] text-sidebar-text">
                {user?.email || "admin@morshed.edu"}
              </span>
            </div>
          </div>
        ) : (
          /* Other roles: Help + Logout */
          <div className="flex flex-col items-start gap-1 w-full">
            <button
              onClick={() => {}}
              className="flex flex-row items-center px-3 py-2 gap-3 w-full bg-transparent border-none cursor-pointer font-heading font-bold text-[11px] leading-4 text-sidebar-text"
              style={{ letterSpacing: "0.55px" }}
            >
              <HelpCircle size={18} className="text-sidebar-text" />
              <span>Help</span>
            </button>
            <button
              onClick={logout}
              className="flex flex-row items-center px-3 py-2 gap-3 w-full bg-transparent border-none cursor-pointer font-heading font-bold text-[11px] leading-4 text-danger mb-6"
              style={{ letterSpacing: "0.55px" }}
            >
              <LogOut size={18} className="text-danger" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
