import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlertCircle, Info, MessageSquare, CheckCheck } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useAuth } from "../../hooks/useAuth";
import { getMyNotifications, markNotificationRead } from "../../services/studentService";
import { getProfessorNotifications, markProfessorNotificationRead } from "../../services/professorService";
import { ROUTES } from "../../routes/RoutePaths";

const typeIcons = {
  urgent: AlertCircle,
  academic: Bell,
  info: Info,
  system: MessageSquare,
};

const typeColors = {
  urgent: "#BA1A1A",
  academic: "#4F378A",
  info: "#4F378A",
  system: "#7A7582",
};

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || "student";

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const notificationsRoute =
    role === "student" ? ROUTES.STUDENT.NOTIFICATIONS
    : role === "professor" ? ROUTES.PROFESSOR.NOTIFICATIONS
    : ROUTES.ADVISOR.DASHBOARD;

  const loadNotifications = useCallback(async () => {
    try {
      let result;
      if (role === "professor") {
        result = await getProfessorNotifications();
      } else if (role === "student" || role === "advisor") {
        result = await getMyNotifications();
      }
      if (result?.success && Array.isArray(result.data)) {
        setNotifications(result.data);
      }
    } catch {
      // Silently fail - notifications are non-critical
    }
  }, [role]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkRead = async (e, id) => {
    e.stopPropagation();
    try {
      if (role === "professor") {
        await markProfessorNotificationRead(id);
      } else {
        await markNotificationRead(id);
      }
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {
      // Silent fail
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate(notificationsRoute);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const recent = notifications.slice(0, 5);

  const TypeIcon = typeIcons[notifications[0]?.type] || Bell;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full cursor-pointer bg-transparent border-none"
      >
        {role === "admin" ? (
          <Bell size={20} className="text-admin-accent" />
        ) : role === "professor" ? (
          <Bell size={20} className="text-sidebar-text hover:text-white transition-colors" />
        ) : (
          <Bell size={20} color="#4F378A" />
        )}
        {unreadCount > 0 && (
          <span className="absolute top-[2px] right-[2px] min-w-[16px] h-4 px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 w-80 bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.15)] border border-border z-[100] overflow-hidden">
          <div className="px-4 py-3 border-b border-border font-heading font-semibold text-sm text-text-primary flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs text-text-muted font-normal">{unreadCount} unread</span>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 font-heading text-text-muted text-sm text-center">
                No notifications yet
              </div>
            ) : (
              recent.map((n) => {
                const Icon = typeIcons[n.type] || Bell;
                const color = typeColors[n.type] || "#7A7582";
                return (
                  <div
                    key={n._id}
                    onClick={(e) => !n.read && handleMarkRead(e, n._id)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-bg-light ${
                      !n.read ? "bg-[#F5F0FF]" : ""
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <Icon size={16} color={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`font-heading text-xs leading-4 m-0 truncate ${
                          !n.read ? "font-semibold text-text-primary" : "font-normal text-text-secondary"
                        }`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <button
                            onClick={(e) => handleMarkRead(e, n._id)}
                            className="shrink-0 p-0.5 rounded bg-transparent border-none cursor-pointer hover:bg-gray-100"
                            title="Mark as read"
                          >
                            <CheckCheck size={14} color="#4F378A" />
                          </button>
                        )}
                      </div>
                      <p className="font-heading text-[11px] text-text-muted m-0 mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="font-heading text-[10px] text-text-muted/60 m-0 mt-1">
                        {n.date ? formatDistanceToNow(parseISO(n.date), { addSuffix: true }) : ""}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div
              onClick={handleViewAll}
              className="px-4 py-3 border-t border-border font-heading text-xs font-semibold text-center text-primary cursor-pointer hover:bg-bg-light transition-colors"
            >
              View all notifications
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
