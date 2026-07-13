import { useEffect } from "react";
import { useAttendance } from "../../hooks/useAttendance";
import PageHeader from "../../shared/components/PageHeader";
import ProgressBar from "../../shared/components/ProgressBar";
import KPICard from "../../shared/components/KPICard";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Clock } from "lucide-react";

const StudentAttendancePage = () => {
  const { attendance, loadAttendance, loading, error } = useAttendance();

  useEffect(() => { loadAttendance(); }, []);

  if (loading) return <LoadingSkeleton count={3} />;

  const courseAttendance = attendance?.courses || [];
  const totalAttended = courseAttendance.reduce((s, c) => s + c.attended, 0);
  const totalClasses = courseAttendance.reduce((s, c) => s + c.total, 0);
  const overallPercent = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[960px] mx-auto">
      <PageHeader title="Attendance" subtitle="Track your class attendance" />

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <KPICard label="OVERALL ATTENDANCE" borderColor="#4F378A">
          <div className="flex items-end gap-2">
            <span className="font-heading font-normal text-2xl sm:text-[36px] leading-tight sm:leading-[36px] text-primary">
              {overallPercent}%
            </span>
            <span className={`font-body text-sm sm:text-base pb-1 ${overallPercent >= 80 ? "text-primary" : "text-danger"}`}>
              {overallPercent >= 80 ? "Good" : "Needs Improvement"}
            </span>
          </div>
          <ProgressBar value={overallPercent} max={100} color={overallPercent >= 80 ? "#4F378A" : "#BA1A1A"} height={6} />
        </KPICard>
        <KPICard label="CLASSES HELD" value={totalClasses} subtitle="total sessions" borderColor="#63597C" />
        <KPICard label="CLASSES ATTENDED" value={totalAttended} subtitle="attended" borderColor="#CFBCFF" />
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        <h3 className="font-heading font-semibold text-lg sm:text-xl m-0 text-text-primary">
          Course Breakdown
        </h3>

        {courseAttendance.length === 0 ? (
          <div className="p-8 text-center font-heading text-text-muted">
            No attendance data available.
          </div>
        ) : courseAttendance.map((course) => (
          <div key={course.code} className="bg-white border border-border-color rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div className="min-w-0">
                <span className="font-heading font-semibold text-sm sm:text-base text-primary">
                  {course.code}
                </span>
                <span className="font-heading text-sm sm:text-base text-text-primary ml-2">
                  {course.name}
                </span>
              </div>
              <span className={`font-heading font-bold text-sm sm:text-base ${course.percent >= 80 ? "text-primary" : "text-danger"} shrink-0`}>
                {course.percent}%
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Clock size={14} color="#7A7582" />
              <span className="font-heading text-xs sm:text-sm text-text-secondary">
                {course.attended} / {course.total} classes
              </span>
            </div>
            <ProgressBar value={course.attended} max={course.total} color={course.percent >= 80 ? "#4F378A" : "#BA1A1A"} height={10} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAttendancePage;
