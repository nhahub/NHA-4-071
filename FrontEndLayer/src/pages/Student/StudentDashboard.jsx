import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudent } from "../../hooks/useStudent";
import { useEnrollment } from "../../hooks/useEnrollment";
import { useSettings } from "../../hooks/useSettings";
import { ROUTES } from "../../routes/RoutePaths";
import KPICard from "../../shared/components/KPICard";
import ProgressBar from "../../shared/components/ProgressBar";
import PageHeader from "../../shared/components/PageHeader";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, ArrowUpRight, Calendar } from "lucide-react";

const btnPrimary = "flex flex-row items-center px-4 py-[9px] gap-2 bg-primary shadow-sm rounded-lg border-none text-white font-body font-normal text-sm sm:text-base leading-normal cursor-pointer";

const btnOutline = "flex flex-row items-center px-4 py-2 gap-2 border border-text-muted rounded-lg bg-transparent text-primary font-body font-normal text-sm sm:text-base leading-normal cursor-pointer";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { dashboard, loading, loadDashboard, error: dashError } = useStudent();
  const { enrollments, loadEnrollments, error: enrollErr } = useEnrollment();
  const { preferences, loadSettings } = useSettings();
  const [gpaRange, setGpaRange] = useState("6");

  useEffect(() => {
    loadDashboard();
    loadEnrollments();
    loadSettings();
  }, []);

  if (loading) return <LoadingSkeleton type="card" count={4} />;

  const gpa = dashboard?.student?.GPA;
  const semesterCourses = dashboard?.currentCourses || [];
  const enrolledCount = semesterCourses.length || enrollments?.length || 0;
  const trendData = (dashboard?.gpaTrend || []).slice(-parseInt(gpaRange));
  const courseProgressData = dashboard?.courseProgress || [];

  return (
    <div className="flex flex-col gap-6 md:gap-[44px] max-w-[960px] mx-auto">
      <PageHeader title="Academic Overview" subtitle={`Welcome back, ${dashboard?.student?.name || dashboard?.student?.name || "Student"}. You have ${enrolledCount} courses this semester.`}>
        <button className={btnOutline} onClick={() => navigate(ROUTES.STUDENT.SCHEDULE)}>
          <Calendar size={12} color="#4F378A" />
          <span className="hidden sm:inline">View Schedule</span>
        </button>
        <button className={btnPrimary} onClick={() => navigate(ROUTES.STUDENT.ENROLLMENT)}>
          <Plus size={13.5} color="#FFFFFF" />
          Enroll
        </button>
      </PageHeader>

      {(dashError || enrollErr) && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">
          {dashError || enrollErr}
        </div>
      )}

      <div className="grid grid-cols-2 lg:flex lg:gap-4 w-full gap-3">
        {preferences?.showGpa !== false && (
          <KPICard label="CUMULATIVE GPA" value={gpa} subtitle="Outstanding" borderColor="#4F378A" />
        )}
        <KPICard label="TOTAL CREDITS EARNED" borderColor="#63597C">
          <span className="font-heading font-semibold text-2xl sm:text-[36px] leading-tight sm:leading-[36px] text-text-primary">
            {courseProgressData.reduce((s, c) => s + (c.creditsEarned || 0), 0)}
          </span>
        </KPICard>
        <KPICard label="ACADEMIC STANDING" borderColor="#765B00">
          <div className="flex flex-row items-center gap-2 w-full">
            <span className="flex flex-col items-start px-3 py-1 bg-[rgba(201,167,77,0.2)] rounded-full font-body font-normal text-sm sm:text-base leading-normal text-warning">
              Good Standing
            </span>
          </div>
        </KPICard>
        {preferences?.showGpa !== false && (
          <KPICard label="MAJOR GPA" value={gpa} subtitle="Major" borderColor="#CFBCFF" />
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full">
        <div className="flex-[2] flex flex-col p-4 sm:p-8 pb-8 sm:pb-[112px] gap-4 sm:gap-6 bg-white shadow-sm rounded-xl">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-semibold text-lg sm:text-2xl m-0 text-text-primary">
              GPA Trend
            </h3>
            <select className="px-3 py-1 bg-bg-light border-none rounded-lg font-heading font-semibold text-xs text-text-primary"
              value={gpaRange} onChange={(e) => setGpaRange(e.target.value)}>
              <option value="6">Last 6 Semesters</option>
              <option value="4">Last 4 Semesters</option>
              <option value="2">Last 2 Semesters</option>
            </select>
          </div>

          {trendData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] sm:h-[240px] font-heading text-text-muted">
              No GPA trend data available.
            </div>
          ) : (
            <div className="h-[200px] sm:h-[240px] w-full">
              <ResponsiveContainer>
                <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(203,196,210,0.3)" />
                  <XAxis dataKey="semester" tick={{ fontFamily: "Hanken Grotesk", fontSize: 12, fill: "rgba(73,69,81,0.6)" }} />
                  <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontFamily: "Hanken Grotesk", fontSize: 12, fill: "rgba(73,69,81,0.6)" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="gpa" stroke="#4F378A" strokeWidth={3} dot={{ fill: "#4F378A", r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 gap-4 sm:gap-6 bg-primary rounded-xl shadow-md min-h-[340px] sm:min-h-[440px]">
          <div className="flex flex-col gap-2">
            <h3 className="font-heading font-semibold text-lg sm:text-2xl m-0 text-white">
              Major Completion
            </h3>
            <p className="font-heading font-normal text-sm sm:text-base m-0 text-[rgba(233,221,255,0.8)]">
              B.S. in {dashboard?.student?.departmentName || "Computer Science"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 py-4 sm:py-8">
            {courseProgressData.length > 0 ? courseProgressData.map((course) => (
              <div key={course.code}>
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm sm:text-base text-white/80">{course.name}</span>
                  <span className="font-body text-sm sm:text-base text-white">{course.percent}%</span>
                </div>
                <ProgressBar value={course.percent} max={100} color="#FFFFFF" height={8} />
              </div>
            )) : (
              <div className="font-body text-sm sm:text-base text-white/60 text-center py-4">
                No course progress data available.
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(ROUTES.STUDENT.STUDY_PLAN)}
            className="flex justify-center items-center py-3 w-full bg-white rounded-lg border-none text-primary font-heading font-bold text-sm sm:text-base cursor-pointer"
          >
            View Full Plan <ArrowUpRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-heading font-semibold text-lg sm:text-2xl m-0 text-text-primary">
            Current Semester
          </h3>
          <span
            className="font-body font-normal text-sm sm:text-base text-primary cursor-pointer"
            onClick={() => navigate(ROUTES.STUDENT.TRANSCRIPT)}
          >
            View Full Transcript
          </span>
        </div>

        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="flex flex-row justify-between items-center px-4 sm:px-8 py-3 bg-bg-light">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="font-heading font-bold text-sm sm:text-base text-primary">
                {dashboard?.currentSemester?.name || "Current Semester"}
              </span>
              <span className="flex flex-col items-start px-3 py-0.5 bg-primary/10 rounded-full font-heading font-semibold text-xs tracking-wider text-primary">
                Current
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[400px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 sm:px-8 py-3 sm:py-4 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                    Code
                  </th>
                  <th className="text-left px-4 sm:px-8 py-3 sm:py-4 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                    Course Name
                  </th>
                  <th className="text-left px-4 sm:px-8 py-3 sm:py-4 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                    Credits
                  </th>
                  <th className="text-right px-4 sm:px-8 py-3 sm:py-4 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {semesterCourses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 sm:px-8 py-8 text-center font-heading text-text-muted">
                      No courses this semester.
                    </td>
                  </tr>
                ) : (
                  semesterCourses.map((course, i) => (
                    <tr key={course.code} className={i > 0 ? "border-t border-border" : ""}>
                      <td className="px-4 sm:px-8 py-3 sm:py-[18.5px] font-body font-normal text-sm sm:text-base text-primary">
                        {course.code}
                      </td>
                      <td className="px-4 sm:px-8 py-3 sm:py-4 font-heading font-normal text-sm sm:text-base text-text-primary">
                        {course.name}
                      </td>
                      <td className="px-4 sm:px-8 py-3 sm:py-4 font-heading font-normal text-sm sm:text-base text-text-primary">
                        {course.credits}
                      </td>
                      <td className="px-4 sm:px-8 py-3 sm:py-[18px] font-heading font-bold text-sm sm:text-base text-warning text-right">
                        {course.grade}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
