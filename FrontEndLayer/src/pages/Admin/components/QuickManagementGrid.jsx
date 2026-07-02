import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Calendar } from "lucide-react";

const iconsMap = {
  "/admin/users": Users,
  "/admin/courses": BookOpen,
  "/admin/semesters": Calendar,
};

const QuickManagementGrid = ({ actions }) => {
  const navigate = useNavigate();

  const list = actions || [
    {
      title: "User Management",
      subtitle: "Manage all platform users",
      iconColor: "#ADC6FF",
      iconBg: "rgba(173, 198, 255, 0.1)",
      route: "/admin/users",
    },
    {
      title: "Course Management",
      subtitle: "Configure course offerings",
      iconColor: "#4CD7F6",
      iconBg: "rgba(76, 215, 246, 0.1)",
      route: "/admin/courses",
    },
    {
      title: "Semester Config",
      subtitle: "Spring 2025 active",
      iconColor: "#BCC7DE",
      iconBg: "rgba(188, 199, 222, 0.1)",
      route: "/admin/semesters",
    },
  ];

  return (
    <div className="box-border flex flex-col items-start p-6 gap-6 w-full h-[389px] bg-admin-card border border-admin-border rounded">
      <h4 className="font-heading font-semibold text-lg leading-6 text-admin-text m-0">
        Quick Management
      </h4>

      <div className="flex flex-col items-start gap-3 w-full flex-1">
        {list.map((item, idx) => {
          const IconComponent = iconsMap[item.route] || Users;
          return (
            <button
              key={idx}
              onClick={() => navigate(item.route)}
              className="box-border flex flex-row items-center p-4 gap-4 w-full h-[74px] bg-admin-card-active border border-admin-border rounded cursor-pointer transition-all duration-150 hover:bg-[#323537] text-left"
            >
              {/* Icon container */}
              <div
                className="flex flex-col items-center justify-center w-9 h-9 rounded flex-shrink-0"
                style={{ background: item.iconBg || "rgba(173, 198, 255, 0.1)" }}
              >
                <IconComponent size={18} style={{ color: item.iconColor || "#ADC6FF" }} />
              </div>

              {/* Text */}
              <div className="flex flex-col items-start gap-1">
                <span
                  className="font-heading font-bold text-[11px] leading-4 text-admin-text"
                  style={{ letterSpacing: "0.55px" }}
                >
                  {item.title}
                </span>
                <span className="font-heading font-normal text-[10px] leading-[15px] text-admin-text-muted">
                  {item.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickManagementGrid;
