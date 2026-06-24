import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="flex flex-col items-start p-2 rounded-full cursor-pointer relative"
      >
        <Bell size={20} color="#4F378A" />
        <span className="absolute top-[4px] right-[4px] w-2 h-2 rounded-full bg-danger" />
      </div>

      {open && (
        <div className="absolute top-full right-0 w-80 bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.15)] border border-border z-[100] overflow-hidden">
          <div className="px-4 py-3 border-b border-border font-heading font-semibold text-sm text-text-primary">
            Notifications
          </div>
          <div className="p-4 font-heading text-text-muted text-sm text-center">
            No new notifications
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
