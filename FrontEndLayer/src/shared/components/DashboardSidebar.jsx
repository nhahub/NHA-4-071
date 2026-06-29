import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { roleNavConfig } from "../config/roleNavConfig";
import { LogOut, HelpCircle } from "lucide-react";

const linkBaseClass =
  "flex flex-row items-center pl-4 py-[10px] gap-2 w-full h-11 no-underline font-heading font-normal text-base text-sidebar-text border-l-4 border-l-transparent transition-all duration-150 ease-in-out";

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = user?.role || "student";
  const navLinks = roleNavConfig[role] || roleNavConfig.student;

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <aside className="box-border flex flex-col items-start py-8 w-[255px] h-screen overflow-y-auto bg-sidebar-bg border-r border-border shadow-md fixed top-[64px] left-0 z-[1]">
      <nav className="flex flex-col items-start gap-1 w-[254px] flex-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={`${linkBaseClass} ${active ? "bg-primary/10 border-l-sidebar-active" : ""}`}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <div className="flex flex-col items-start w-[18px] h-[18px]">
                <Icon size={18} color="#E6E0E9" />
              </div>
              <div className="flex flex-col items-start">
                <span>{link.label}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>

      <div className="flex flex-col items-start pt-8 w-full">
        <div className="flex flex-col items-start px-4 gap-6 w-full">
          <div className="box-border flex flex-col items-start pt-4 gap-1 w-full border-t border-white/10">
            <button
              onClick={() => {}}
              className={`${linkBaseClass} bg-transparent border-none cursor-pointer w-full text-left`}
            >
              <div className="flex flex-col items-start">
                <HelpCircle size={20} color="#E6E0E9" />
              </div>
              <span>Help</span>
            </button>

            <button
              onClick={logout}
              className={`${linkBaseClass} bg-transparent border-none cursor-pointer w-full text-left mb-6`}
            >
              <div className="flex flex-col items-start">
                <LogOut size={18} color="#BA1A1A" />
              </div>
              <span className="text-danger">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
