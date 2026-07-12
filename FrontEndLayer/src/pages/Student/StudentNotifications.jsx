import { useState, useEffect } from "react";
import { useNotification } from "../../hooks/useNotification";
import PageHeader from "../../shared/components/PageHeader";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Search, AlertCircle, Bell, MessageSquare, Info, CheckCheck, RotateCcw } from "lucide-react";
import { format, parseISO } from "date-fns";

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

const FILTERS = ["All", "Unread", "Read"];
const TYPES = ["All", "urgent", "academic", "info", "system"];

const StudentNotifications = () => {
  const { notifications, loadNotifications, loading, error, markRead, markAllRead, toggleRead } = useNotification();
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [markingId, setMarkingId] = useState(null);

  useEffect(() => { loadNotifications(); }, []);

  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      setMarkingId(notif._id || notif.id);
      markRead(notif._id || notif.id);
    } else {
      toggleRead(notif._id || notif.id);
    }
  };

  const hasUnread = notifications.some((n) => !n.read);

  const filtered = (notifications || []).filter((n) => {
    const matchesSearch =
      (n.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (n.message || "").toLowerCase().includes(search.toLowerCase());
    const matchesRead =
      readFilter === "All" ? true : readFilter === "Unread" ? !n.read : n.read;
    const matchesType =
      typeFilter === "All" ? true : n.type === typeFilter;
    return matchesSearch && matchesRead && matchesType;
  });

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[960px] mx-auto">
      <PageHeader title="Notifications" subtitle="New grades, assignment feedback, and schedule changes." />

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">{error}</div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-white border border-border-color rounded-lg shadow-sm flex-1 min-w-[200px]">
          <Search size={20} color="#7A7582" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-none outline-none font-heading text-sm sm:text-base bg-transparent"
          />
        </div>

        {hasUnread && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-primary text-white font-heading text-xs sm:text-sm font-semibold rounded-lg border-none cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <CheckCheck size={18} />
            <span className="hidden sm:inline">Mark All Read</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setReadFilter(f)}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-heading text-xs sm:text-sm border cursor-pointer transition-colors ${
              readFilter === f
                ? "bg-primary text-white border-primary"
                : "bg-white text-text-secondary border-border-color hover:border-primary"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="w-[1px] h-5 bg-border-color mx-1" />
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-heading text-xs sm:text-sm border cursor-pointer transition-colors ${
              typeFilter === t
                ? "bg-primary text-white border-primary"
                : "bg-white text-text-secondary border-border-color hover:border-primary"
            }`}
          >
            {t === "All" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="p-8 text-center font-heading text-text-muted">
            No notifications found.
          </div>
        ) : (
          filtered.map((notif) => {
            const Icon = typeIcons[notif.type] || Bell;
            const color = typeColors[notif.type] || "#7A7582";
            const nid = notif._id || notif.id;
            const isMarking = markingId === nid;
            return (
              <div
                key={nid}
                onClick={() => handleNotificationClick(notif)}
                className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-border-color rounded-xl shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md select-none"
                style={{
                  background: notif.read ? "#FFFFFF" : "rgba(79, 55, 138, 0.04)",
                  borderLeft: `4px solid ${color}`,
                  opacity: isMarking ? 0.6 : 1,
                }}
              >
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200"
                  style={{ background: `${color}15` }}
                >
                  <Icon size={18} color={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <h4 className="font-heading font-semibold text-sm sm:text-base m-0 text-text-primary truncate">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="text-[10px] sm:text-[11px] font-bold text-white bg-primary px-[5px] sm:px-[6px] py-[1px] rounded-full leading-normal shrink-0">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="font-heading text-[10px] sm:text-xs text-text-muted whitespace-nowrap shrink-0">
                      {notif.date ? format(parseISO(notif.date), "MMM dd") : ""}
                    </span>
                  </div>
                  <p className="font-heading text-xs sm:text-sm text-text-secondary mt-1 line-clamp-2">
                    {notif.message}
                  </p>
                </div>
                {notif.read && (
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleRead(nid); }}
                    className="self-center p-1.5 rounded-lg bg-transparent border-none cursor-pointer hover:bg-border-color/30 transition-colors shrink-0"
                    title="Mark as unread"
                  >
                    <RotateCcw size={14} color="#7A7582" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentNotifications;
