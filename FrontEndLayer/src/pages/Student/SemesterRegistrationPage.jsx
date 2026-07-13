import { useEffect, useState, useCallback } from "react";
import { useEnrollment } from "../../hooks/useEnrollment";
import { getSemesterRegistrationInfo, submitSemesterRegistration } from "../../services/studentService";
import { useDispatch } from "react-redux";
import { enrollCourse, dropCourse } from "../../store/enrollment/enrollmentThunks";
import PageHeader from "../../shared/components/PageHeader";
import StatusBadge from "../../shared/components/StatusBadge";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Plus, X, Check, AlertTriangle, CalendarCheck, BookOpen, Trash2 } from "lucide-react";

const ENROLLMENT_ERRORS = {
  "Course section is full": "This course section has reached its capacity. Please contact your advisor.",
  "No active semester for registration right now": "Registration is not open at this time.",
  "This course is not offered in the current semester": "This course is not available for the current semester.",
  "This course is not offered in an active semester": "This course is not available for the current semester.",
  "Already enrolled in this course": "You are already enrolled in this course.",
  "You have already completed this course": "You have already completed this course and cannot re-enroll.",
  "Student profile not found": "Could not find your student profile. Please contact the registrar.",
  "Course offering not found": "This course offering was not found.",
  "Enrollment not found or already dropped": "This enrollment was not found.",
};

const SemesterRegistrationPage = () => {
  const dispatch = useDispatch();
  const { loadEnrollments } = useEnrollment();
  const [regInfo, setRegInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [dropConfirm, setDropConfirm] = useState(null);

  const refreshData = useCallback(async () => {
    try {
      const res = await getSemesterRegistrationInfo();
      if (res.success) setRegInfo(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await refreshData();
      loadEnrollments();
      setLoading(false);
    };
    load();
  }, []);

  const semesterName = regInfo?.semester?.name || "this semester";
  const registrationStatus = regInfo?.semester?.registrationStatus || "closed";
  const isRegistered = regInfo?.isRegistered;
  const canRegister = registrationStatus === "open" && !isRegistered;
  const canEnroll = registrationStatus === "open";
  const isClosed = registrationStatus === "closed" || registrationStatus === "ended" || registrationStatus === "ongoing";
  const availableCourses = regInfo?.availableCourses || [];
  const enrolledCourses = regInfo?.enrolledCourses || [];
  const enrolledCredits = regInfo?.enrolledCredits ?? 0;
  const maxCredits = regInfo?.maxCredits ?? 18;

  const isSelected = (offeringId) => selected.includes(offeringId);

  const toggleSelect = (offeringId) => {
    setError(null);
    setSelected((prev) =>
      prev.includes(offeringId) ? prev.filter((id) => id !== offeringId) : [...prev, offeringId]
    );
  };

  const handleRegisterAndEnroll = async () => {
    if (!agreed) return;
    setSubmitting(true);
    setError(null);

    try {
      const regRes = await submitSemesterRegistration();
      if (!regRes.success) {
        setError(regRes.error);
        setSubmitting(false);
        return;
      }

      let failedCourse = null;
      let failMessage = "";

      for (const offeringId of selected) {
        const action = await dispatch(enrollCourse(offeringId));
        if (action.meta?.requestStatus === "rejected") {
          const course = availableCourses.find((c) => c.offeringId === offeringId);
          failedCourse = course?.code || "Course";
          failMessage = ENROLLMENT_ERRORS[action.payload] || action.payload || "Enrollment failed";
          break;
        }
      }

      setSelected([]);
      setAgreed(false);
      await refreshData();
      loadEnrollments();

      if (failedCourse) {
        setError(`Registration complete, but ${failedCourse} failed: ${failMessage}`);
      }
    } catch {
      setError("Failed to complete registration. Please try again.");
    }
    setSubmitting(false);
  };

  const handleEnrollSingle = async (offeringId, courseCode) => {
    setActionId(offeringId);
    setError(null);
    try {
      const action = await dispatch(enrollCourse(offeringId));
      if (action.meta?.requestStatus === "rejected") {
        setError(`${courseCode}: ${ENROLLMENT_ERRORS[action.payload] || action.payload || "Enrollment failed"}`);
      } else {
        await refreshData();
        loadEnrollments();
      }
    } catch {
      setError(`${courseCode}: Enrollment failed`);
    }
    setActionId(null);
  };

  const handleDrop = async (enrollmentId, courseCode) => {
    setActionId(enrollmentId);
    setDropConfirm(null);
    setError(null);
    try {
      const action = await dispatch(dropCourse(enrollmentId));
      if (action.meta?.requestStatus === "rejected") {
        setError(`${courseCode}: ${ENROLLMENT_ERRORS[action.payload] || action.payload || "Drop failed"}`);
      } else {
        await refreshData();
        loadEnrollments();
      }
    } catch {
      setError(`${courseCode}: Drop failed`);
    }
    setActionId(null);
  };

  if (loading) return <LoadingSkeleton count={3} />;

  const renderCourseBox = (course, actions) => (
    <div
      key={course.offeringId || course._id}
      className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-border flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="font-heading font-semibold text-sm text-primary">{course.code}</span>
          <span className="font-heading text-xs text-text-muted whitespace-nowrap">{course.credits} cr</span>
        </div>
        <h4 className="font-heading font-semibold text-base m-0 text-text-primary leading-tight mb-2">
          {course.name}
        </h4>
        <div className="flex flex-col gap-1">
          {course.professor && (
            <p className="font-heading text-xs text-text-secondary m-0">{course.professor}</p>
          )}
          {course.schedule && (
            <p className="font-heading text-xs text-text-secondary m-0">{course.schedule}</p>
          )}
          {course.classroom && (
            <p className="font-heading text-xs text-text-muted m-0">{course.classroom}</p>
          )}
        </div>
        {course.seatsAvailable !== undefined && (
          <p className={`font-heading text-xs font-semibold mt-2 m-0 ${course.seatsAvailable > 5 ? "text-primary" : "text-danger"}`}>
            {course.seatsAvailable} seats left
          </p>
        )}
      </div>
      {actions}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[1100px] mx-auto">
      <PageHeader
        title="Semester Registration"
        subtitle={isRegistered
          ? `Your registration for ${semesterName} is confirmed.`
          : `Select your courses and register for ${semesterName}.`
        }
      />

      {error && (
        <div className="flex items-start gap-3 p-4 bg-danger/10 border border-danger/30 rounded-lg">
          <AlertTriangle size={18} color="#BA1A1A" className="mt-0.5 shrink-0" />
          <span className="font-heading text-sm text-danger">{error}</span>
        </div>
      )}

      <div className={`flex flex-col p-4 sm:p-6 gap-3 sm:gap-4 ${canRegister ? "bg-primary/5 border-primary" : "bg-bg-light border-border"} rounded-xl border`}>
        <div className="flex justify-between items-center">
          <span className="font-heading font-semibold text-base sm:text-lg text-text-primary">{semesterName}</span>
          <StatusBadge status={isRegistered ? "registered" : registrationStatus} />
        </div>
        {isRegistered && regInfo?.registeredAt && (
          <p className="font-heading text-sm text-text-secondary m-0">
            Registered on {new Date(regInfo.registeredAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}
        {canRegister && (
          <p className="font-heading text-sm text-text-secondary m-0">
            Select your courses below, agree to the terms, and click "Register & Enroll" to complete registration.
          </p>
        )}
        {isRegistered && canEnroll && (
          <p className="font-heading text-sm text-text-secondary m-0">
            You can add or drop courses below.
          </p>
        )}
        {isRegistered && isClosed && !canEnroll && (
          <p className="font-heading text-sm text-text-secondary m-0">
            Registration is closed. This is your final enrollment list.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
          <span className="font-heading text-xs text-text-secondary uppercase tracking-wider">Earned</span>
          <p className="font-heading font-semibold text-xl sm:text-2xl text-primary mt-1 m-0">{regInfo?.earnedCredits ?? 0}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
          <span className="font-heading text-xs text-text-secondary uppercase tracking-wider">Remaining</span>
          <p className="font-heading font-semibold text-xl sm:text-2xl text-warning mt-1 m-0">{regInfo?.remainingCredits ?? 0}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
          <span className="font-heading text-xs text-text-secondary uppercase tracking-wider">Credits</span>
          <p className="font-heading font-semibold text-xl sm:text-2xl text-text-primary mt-1 m-0">{enrolledCredits}/{maxCredits}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
          <span className="font-heading text-xs text-text-secondary uppercase tracking-wider">Courses</span>
          <p className="font-heading font-semibold text-xl sm:text-2xl text-text-primary mt-1 m-0">{enrolledCourses.length}</p>
        </div>
      </div>

      {isRegistered && enrolledCourses.length > 0 && (
        <div className="flex flex-col gap-3 md:gap-4">
          <h3 className="font-heading font-semibold text-lg md:text-xl m-0 text-text-primary flex items-center gap-2">
            <Check size={20} color="#4F378A" />
            Enrolled Courses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {enrolledCourses.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-primary/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-heading font-semibold text-sm text-primary">{c.code}</span>
                    <StatusBadge status="enrolled" />
                  </div>
                  <h4 className="font-heading font-semibold text-base m-0 text-text-primary leading-tight mb-2">
                    {c.name}
                  </h4>
                  <div className="flex flex-col gap-1">
                    <p className="font-heading text-xs text-text-secondary m-0">{c.credits} Credits</p>
                    {c.schedule && <p className="font-heading text-xs text-text-secondary m-0">{c.schedule}</p>}
                    {c.classroom && <p className="font-heading text-xs text-text-muted m-0">{c.classroom}</p>}
                  </div>
                </div>
                {canEnroll && (
                  <div className="mt-3 pt-3 border-t border-bg-light">
                    {dropConfirm === c._id ? (
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-xs text-text-secondary">Drop this course?</span>
                        <button
                          onClick={() => handleDrop(c._id, c.code)}
                          disabled={actionId === c._id}
                          className="flex items-center gap-1 px-2 py-1 border border-danger rounded-lg bg-danger/10 text-danger font-body text-xs cursor-pointer"
                        >
                          {actionId === c._id ? "Dropping..." : "Yes"}
                        </button>
                        <button
                          onClick={() => setDropConfirm(null)}
                          className="flex items-center gap-1 px-2 py-1 border border-border rounded-lg bg-transparent text-text-secondary font-body text-xs cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDropConfirm(c._id)}
                        className="flex items-center gap-1 px-2 py-1 border border-border rounded-lg bg-transparent text-danger font-body text-xs cursor-pointer"
                      >
                        <Trash2 size={12} /> Drop
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <span className="font-heading text-sm text-text-secondary">
              Total: <span className="font-semibold text-primary">{enrolledCredits}</span> credits
            </span>
          </div>
        </div>
      )}

      {isRegistered && isClosed && enrolledCourses.length === 0 && (
        <div className="bg-white border border-border rounded-xl p-8 text-center shadow-sm">
          <BookOpen size={48} color="#CBC4D2" className="mx-auto mb-3" />
          <p className="font-heading font-semibold text-base text-text-primary m-0">No Courses Enrolled</p>
          <p className="font-heading text-sm text-text-secondary m-0 mt-1">
            Registration is closed and no courses were enrolled.
          </p>
        </div>
      )}

      {canRegister && (
        <div className="flex flex-col gap-3 md:gap-4">
          <h3 className="font-heading font-semibold text-lg md:text-xl m-0 text-text-primary">
            Available Courses
          </h3>
          {availableCourses.length === 0 ? (
            <div className="p-8 text-center font-heading text-text-muted bg-white rounded-xl border border-border shadow-sm">
              No courses available.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {availableCourses.map((course) =>
                  renderCourseBox(course, (
                    <div className="mt-3 pt-3 border-t border-bg-light">
                      {isSelected(course.offeringId) ? (
                        <button
                          onClick={() => toggleSelect(course.offeringId)}
                          className="flex items-center justify-center gap-1 w-full px-3 py-1.5 border border-danger rounded-lg bg-danger/10 text-danger font-body text-sm cursor-pointer"
                        >
                          <X size={14} /> Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleSelect(course.offeringId)}
                          className="flex items-center justify-center gap-1 w-full px-3 py-1.5 border border-primary rounded-lg bg-primary/10 text-primary font-body text-sm cursor-pointer"
                        >
                          <Plus size={14} /> Add
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {selected.length > 0 && (
                <div className="bg-white border border-border rounded-xl p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-heading font-semibold text-sm sm:text-base m-0 text-text-primary">
                      Selected ({selected.length})
                    </h4>
                    <span className="font-heading text-xs text-text-secondary">
                      {selected.reduce((sum, id) => {
                        const c = availableCourses.find((x) => x.offeringId === id);
                        return sum + (c?.credits || 0);
                      }, 0)} credits
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selected.map((id) => {
                      const course = availableCourses.find((c) => c.offeringId === id);
                      return (
                        <div key={id} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/30 rounded-lg">
                          <span className="font-heading text-xs font-semibold text-primary">{course?.code || id}</span>
                          <X size={12} color="#BA1A1A" className="cursor-pointer" onClick={() => toggleSelect(id)} />
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-bg-light rounded-lg mb-3">
                    <label className="flex items-center gap-3 font-heading cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="w-5 h-5 accent-primary"
                      />
                      <span className="text-xs sm:text-sm">I agree to the academic policies and tuition obligations.</span>
                    </label>
                  </div>

                  <button
                    onClick={handleRegisterAndEnroll}
                    disabled={!agreed || submitting}
                    className={`flex items-center justify-center gap-2 w-full px-4 py-[10px] border-none rounded-lg font-body text-sm sm:text-base ${
                      !agreed || submitting
                        ? "bg-border-color text-text-muted cursor-not-allowed"
                        : "bg-primary text-white cursor-pointer"
                    }`}
                  >
                    <CalendarCheck size={16} />
                    {submitting ? "Processing..." : "Register & Enroll"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {isRegistered && canEnroll && availableCourses.length > 0 && (
        <div className="flex flex-col gap-3 md:gap-4">
          <h3 className="font-heading font-semibold text-lg md:text-xl m-0 text-text-primary">
            Add More Courses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {availableCourses.map((course) =>
              renderCourseBox(course, (
                <div className="mt-3 pt-3 border-t border-bg-light">
                  <button
                    onClick={() => handleEnrollSingle(course.offeringId, course.code)}
                    disabled={actionId === course.offeringId}
                    className={`flex items-center justify-center gap-1 w-full px-3 py-1.5 border rounded-lg font-body text-sm ${
                      actionId === course.offeringId
                        ? "border-border text-text-muted cursor-not-allowed bg-bg-light"
                        : "border-primary bg-primary/10 text-primary cursor-pointer"
                    }`}
                  >
                    <Plus size={14} />
                    {actionId === course.offeringId ? "Enrolling..." : "Enroll"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {!isRegistered && !canRegister && !isClosed && (
        <div className="bg-white border border-border rounded-xl p-8 text-center shadow-sm">
          <Check size={48} color="#CBC4D2" className="mx-auto mb-3" />
          <p className="font-heading font-semibold text-base text-text-primary m-0">Registration Not Available</p>
          <p className="font-heading text-sm text-text-secondary m-0 mt-1">
            Semester registration is currently closed. Please wait for the next registration period.
          </p>
        </div>
      )}
    </div>
  );
};

export default SemesterRegistrationPage;
