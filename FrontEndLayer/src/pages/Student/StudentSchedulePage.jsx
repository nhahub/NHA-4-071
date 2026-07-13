import { useEffect } from "react";
import { useSchedule } from "../../hooks/useSchedule";
import PageHeader from "../../shared/components/PageHeader";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Clock, MapPin, User } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const palette = ["#E8DEF8", "#D0BCFF", "#F3EDF7", "#FFD8E4", "#CEE6FD", "#E6E0E9", "#F5D0D0", "#D4E4D4"];
const getCourseColor = (code) => {
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = code.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
};

const StudentSchedulePage = () => {
  const { schedule, loadSchedule, loading, error } = useSchedule();

  useEffect(() => { loadSchedule(); }, []);

  const scheduleData = schedule || [];

  if (loading) return <LoadingSkeleton count={3} />;
  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[960px] mx-auto">
      <PageHeader title="My Schedule" subtitle="Weekly class schedule" />

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">{error}</div>
      )}

      <div className="overflow-x-auto bg-white border border-border rounded-xl shadow-sm">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-bg-light">
              <th className="px-3 sm:px-4 py-3 text-left font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary border-b border-border w-16 sm:w-20">
                Time
              </th>
              {days.map((day) => (
                <th key={day} className="px-3 sm:px-4 py-3 text-center font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary border-b border-border">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className="px-3 sm:px-4 py-2 font-heading text-[10px] sm:text-xs text-text-muted border-b border-bg-light align-top">
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    {time}
                  </div>
                </td>
                {days.map((day) => {
                  const course = scheduleData.find((s) => s.day === day && s.start === time);
                  return (
                    <td
                      key={`${day}-${time}`}
                      className={`${course ? "p-1.5 sm:p-2" : "p-0"} border-b border-bg-light align-top min-h-[48px] sm:min-h-[60px]`}
                    >
                      {course && (
                        <div
                          className="rounded-lg p-1.5 sm:p-2 h-full"
                          style={{ background: getCourseColor(course.code) }}
                        >
                          <div className="font-heading font-semibold text-[11px] sm:text-[13px] text-text-primary">
                            {course.code}
                          </div>
                          <div className="font-heading text-[9px] sm:text-[11px] text-text-secondary mt-0.5 hidden sm:block">
                            {course.name}
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-[8px] sm:text-[10px] text-text-muted">
                            <MapPin size={8} /> <span className="hidden md:inline">{course.room}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[8px] sm:text-[10px] text-text-muted">
                            <User size={8} /> <span className="hidden md:inline">{course.professor}</span>
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentSchedulePage;
