import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { roleNavConfig } from "../config/roleNavConfig";
import { LogOut, X } from "lucide-react";

const roleSubtitles = {
  admin: "Admin Portal",
  student: "Student Portal",
  professor: "Faculty Portal",
  advisor: "Advisor Portal",
};

const DashboardSidebar = ({ mobileOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = user?.role || "student";
  const navLinks = roleNavConfig[role] || roleNavConfig.student;
  const isAdmin = role === "admin";

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`box-border flex flex-col justify-between items-start py-4 w-[240px] h-screen overflow-y-auto bg-sidebar-bg border-r border-border fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand + Subtitle + Mobile Close */}
        <div className="flex flex-col items-start w-full">
          <div className="flex flex-col items-start px-6 pb-8 w-full">
            <div className="flex items-center justify-between w-full">
              <span
                className="font-heading font-bold text-[32px] leading-[40px] text-sidebar-active flex items-center"
                style={{ letterSpacing: "-0.64px" }}
              >
                <span className="text-white">Morshed</span>
                <span className="text-sidebar-active">.</span>
              </span>
              <button
                onClick={onClose}
                className="lg:hidden p-1 bg-transparent border-none cursor-pointer text-sidebar-text hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <span
              className="font-heading font-bold text-[11px] leading-4 text-sidebar-text opacity-70 uppercase tracking-widest mt-1"
              style={{ letterSpacing: "1px" }}
            >
              {roleSubtitles[role] || "Portal"}
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col items-start gap-1 w-full flex-1 mt-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end
                  onClick={onClose}
                  className={`box-border flex flex-row items-center px-6 py-3 gap-3 w-full no-underline font-heading font-bold text-[13px] leading-4 transition-all duration-150 ease-in-out border-l-[3px] ${
                    active
                      ? "bg-[rgba(255,255,255,0.03)] border-l-sidebar-active text-white"
                      : "border-l-transparent text-sidebar-text hover:text-white hover:bg-[rgba(255,255,255,0.02)]"
                  }`}
                  style={{ letterSpacing: "0.55px" }}
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
            <div className="flex flex-col items-start gap-2 w-full px-3">
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
              <button
                onClick={logout}
                className="flex flex-row items-center px-3 py-2 gap-3 w-full bg-transparent border-none cursor-pointer font-heading font-semibold text-[13px] leading-4 text-sidebar-text hover:text-white transition-colors mb-6"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-2 w-full px-3">
              <button
                onClick={logout}
                className="flex flex-row items-center px-3 py-2 gap-3 w-full bg-transparent border-none cursor-pointer font-heading font-semibold text-[13px] leading-4 text-sidebar-text hover:text-white transition-colors mb-6"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
