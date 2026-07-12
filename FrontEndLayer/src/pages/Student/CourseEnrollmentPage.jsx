import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourse } from "../../hooks/useCourse";
import { useEnrollment } from "../../hooks/useEnrollment";
import { ROUTES } from "../../routes/RoutePaths";
import PageHeader from "../../shared/components/PageHeader";
import StatusBadge from "../../shared/components/StatusBadge";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Plus, X, Check, BookOpen, AlertTriangle } from "lucide-react";

const ENROLLMENT_ERRORS = {
  "Course section is full": "This course section has reached its capacity. Please contact your advisor to be added to a waitlist or try another section.",
  "No active semester for registration right now": "Registration is not open at this time. Please check back later or contact your advisor.",
  "This course is not offered in the current semester": "This course is not available for the current semester.",
  "Already enrolled in this course": "You are already enrolled in this course.",
  "Student profile not found": "Could not find your student profile. Please contact the registrar.",
};

const btnPrimary = "flex flex-row items-center px-4 py-[9px] gap-2 bg-primary shadow-sm rounded-lg border-none text-white font-body font-normal text-base cursor-pointer";

const btnOutline = "flex flex-row items-center px-4 py-2 gap-2 border border-text-muted rounded-lg bg-transparent text-primary font-body font-normal text-base cursor-pointer";

const CourseEnrollmentPage = () => {
  const navigate = useNavigate();
  const { availableCourses, loadCourses, loading, error: courseError } = useCourse();
  const { enrollments, loadEnrollments, enroll, drop, error: enrollError } = useEnrollment();
  const [selected, setSelected] = useState([]);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    loadCourses();
    loadEnrollments();
  }, []);

  const isEnrolled = (courseId) => enrollments?.some((e) => (e.courseId?._id || e.courseId) === courseId);
  const isSelected = (courseId) => selected.includes(courseId);

  const toggleSelect = (courseId) => {
    setLocalError(null);
    setSelected((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleEnroll = async (courseId) => {
    const result = await enroll(courseId);
    if (result.meta?.requestStatus === 'fulfilled') {
      loadEnrollments();
    }
  };

  const handleEnrollAll = async () => {
    setLocalError(null);
    for (const id of selected) {
      try {
        await enroll(id).unwrap();
      } catch (err) {
        const course = availableCourses?.find((c) => c._id === id);
        setLocalError({ message: err, course: course?.code || "Unknown" });
        loadEnrollments();
        return;
      }
    }
    setSelected([]);
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

      {(localError || courseError || enrollError) && (
        <div className="flex items-start gap-3 p-4 bg-danger/10 border border-danger/30 rounded-lg">
          <AlertTriangle size={18} color="#BA1A1A" className="mt-0.5 shrink-0" />
          <div className="font-heading text-sm text-danger">
            {localError ? (
              <>
                <span className="font-semibold">{localError.course}:</span>{" "}
                {ENROLLMENT_ERRORS[localError.message] || localError.message}
              </>
            ) : (
              ENROLLMENT_ERRORS[courseError || enrollError] || courseError || enrollError
            )}
          </div>
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
              onClick={handleEnrollAll}
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
                      {enr.courseId?.code || enr.courseId?.name || enr.courseId?._id || "Unknown"}
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
