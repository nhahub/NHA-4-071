import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourse } from "../../hooks/useCourse";
import { useEnrollment } from "../../hooks/useEnrollment";
import { ROUTES } from "../../routes/RoutePaths";
import PageHeader from "../../shared/components/PageHeader";
import StatusBadge from "../../shared/components/StatusBadge";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Plus, X, Check, BookOpen } from "lucide-react";

const btnPrimary = "flex flex-row items-center px-4 py-[9px] gap-2 bg-primary shadow-sm rounded-lg border-none text-white font-body font-normal text-base cursor-pointer";

const btnOutline = "flex flex-row items-center px-4 py-2 gap-2 border border-text-muted rounded-lg bg-transparent text-primary font-body font-normal text-base cursor-pointer";

const CourseEnrollmentPage = () => {
  const navigate = useNavigate();
  const { availableCourses, loadCourses, loading, error: courseError } = useCourse();
  const { enrollments, loadEnrollments, enroll, drop, error: enrollError } = useEnrollment();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    loadCourses();
    loadEnrollments();
  }, []);

  const isEnrolled = (courseId) => enrollments?.some((e) => e.courseId === courseId);
  const isSelected = (courseId) => selected.includes(courseId);

  const toggleSelect = (courseId) => {
    setSelected((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleEnroll = async (courseId) => {
    await enroll(courseId);
    loadEnrollments();
  };

  const handleDrop = async (enrollmentId) => {
    await drop(enrollmentId);
    loadEnrollments();
  };

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="flex flex-col gap-8 max-w-[960px] mx-auto">
      <PageHeader title="Course Enrollment" subtitle="Browse available courses and manage your enrollments">
        <button className={btnOutline} onClick={() => navigate(ROUTES.STUDENT.SCHEDULE)}>
          <BookOpen size={16} color="#4F378A" />
          My Schedule
        </button>
      </PageHeader>

      {(courseError || enrollError) && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">
          {courseError || enrollError}
        </div>
      )}

      <div className="flex gap-6">
        <div className="flex-[2] flex flex-col gap-4">
          <h3 className="font-heading font-semibold text-xl m-0 text-text-primary">
            Available Courses
          </h3>

          {(!availableCourses || availableCourses.length === 0) ? (
            <div className="p-8 text-center font-heading text-text-muted">
              No courses available for enrollment at this time.
            </div>
          ) : (
            availableCourses.map((course) => (
              <div
                key={course._id}
                className={`bg-white ${isSelected(course._id) ? "border-primary" : "border-border"} rounded-xl p-6 shadow-sm`}
                style={{ borderWidth: 1, borderStyle: "solid" }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-heading font-semibold text-lg m-0 text-text-primary">
                      {course.code} - {course.name}
                    </h4>
                    <p className="font-heading font-normal text-sm mt-1 mb-0 text-text-secondary">
                      {course.credits} Credits
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isEnrolled(course._id) ? (
                      <StatusBadge status="enrolled" />
                    ) : isSelected(course._id) ? (
                      <button onClick={() => toggleSelect(course._id)} className={`${btnOutline} px-3 py-1`}>
                        <X size={14} /> Remove
                      </button>
                    ) : (
                      <button onClick={() => toggleSelect(course._id)} className={`${btnOutline} px-3 py-1`}>
                        <Plus size={14} /> Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex-1 bg-white border border-border rounded-xl p-6 shadow-sm self-start sticky top-[100px]">
          <h4 className="font-heading font-semibold text-base m-0 mb-4 text-text-primary">
            Selected Courses ({selected.length})
          </h4>

          {selected.length === 0 ? (
            <p className="font-heading text-text-muted text-sm">
              Click "Add" on courses to select them.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {selected.map((id) => {
                const course = availableCourses?.find((c) => c._id === id);
                return (
                  <div key={id} className="flex justify-between items-center py-2 border-b border-bg-light">
                    <span className="font-heading text-sm text-text-primary">
                      {course?.code || id}
                    </span>
                    <X size={14} color="#BA1A1A" className="cursor-pointer" onClick={() => toggleSelect(id)} />
                  </div>
                );
              })}
            </div>
          )}

          {selected.length > 0 && (
            <button
              onClick={() => selected.forEach((id) => handleEnroll(id))}
              className={`${btnPrimary} w-full mt-4 justify-center`}
            >
              <Check size={16} />
              Confirm Enrollment
            </button>
          )}

          <h4 className="font-heading font-semibold text-base mt-6 mb-4 text-text-primary">
            My Enrollments
          </h4>
          {(!enrollments || enrollments.length === 0) ? (
            <p className="font-heading text-text-muted text-sm">
              No enrollments yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {enrollments.map((enr) => (
                <div key={enr._id} className="flex justify-between items-center py-2 border-b border-bg-light">
                  <div>
                    <span className="font-heading text-sm text-text-primary">
                      {enr.courseName || availableCourses?.find((c) => c._id === enr.courseId)?.code || enr.offeringId}
                    </span>
                    <div className="mt-1">
                      <StatusBadge status={enr.status} />
                    </div>
                  </div>
                  {enr.status === "enrolled" && (
                    <X size={14} color="#BA1A1A" className="cursor-pointer" onClick={() => handleDrop(enr._id)} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEnrollmentPage;
