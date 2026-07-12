import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSemester } from "../../hooks/useSemester";
import { useEnrollment } from "../../hooks/useEnrollment";
import { ROUTES } from "../../routes/RoutePaths";
import PageHeader from "../../shared/components/PageHeader";
import StatusBadge from "../../shared/components/StatusBadge";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Check, ChevronRight } from "lucide-react";

const steps = ["Select Courses", "Review Selection", "Sign Agreement", "Confirm"];

const SemesterRegistrationPage = () => {
  const navigate = useNavigate();
  const { currentSemester, loadCurrentSemester, loading, submitting, error, submitRegistration } = useSemester();
  const { enrollments, loadEnrollments } = useEnrollment();
  const [currentStep, setCurrentStep] = useState(0);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    loadCurrentSemester();
    loadEnrollments();
  }, []);

  const enrolledCourses = enrollments?.filter((e) => e.status === "enrolled") || [];

  if (loading) return <LoadingSkeleton count={3} />;

  const registrationStatus = currentSemester?.registrationStatus || "closed";

  const handleConfirm = async () => {
    if (currentStep === 2 && !agreed) return;
    if (currentStep === 2) {
      await submitRegistration();
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[960px] mx-auto">
      <PageHeader
        title="Semester Registration"
        subtitle="Follow the steps below to finalize your course selection and confirm your enrollment for the upcoming semester."
      />

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">{error}</div>
      )}

      <div className={`flex flex-col p-4 sm:p-6 gap-3 sm:gap-4 ${registrationStatus === "open" ? "bg-primary/5 border-primary" : "bg-bg-light border-border"} rounded-xl border`}>
        <div className="flex justify-between items-center">
          <span className="font-heading font-semibold text-base sm:text-lg text-text-primary">
            Registration Status
          </span>
          <StatusBadge status={registrationStatus} />
        </div>
        {registrationStatus === "open" && (
          <p className="font-heading text-sm text-text-secondary m-0">
            Enrollment for {currentSemester?.name || "this semester"} is now available.
          </p>
        )}
      </div>

      <div className="flex gap-2 sm:gap-4 items-center flex-wrap">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-1.5 sm:gap-2">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${i < currentStep ? "bg-primary" : i === currentStep ? "bg-primary-light" : "bg-bg-light"} flex items-center justify-center ${i <= currentStep ? "text-white" : "text-text-muted"} font-heading font-semibold text-xs sm:text-sm`}>
              {i < currentStep ? <Check size={16} /> : i + 1}
            </div>
            <span className={`font-heading text-xs sm:text-sm ${i <= currentStep ? "text-text-primary" : "text-text-muted"}`}>
              {step}
            </span>
            {i < steps.length - 1 && <ChevronRight size={16} color="#CBC4D2" className="hidden sm:block" />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-xl p-4 sm:p-8 shadow-sm">
        {currentStep === 0 && (
          <div>
            <h3 className="font-heading font-semibold text-lg sm:text-xl m-0 mb-4 text-text-primary">
              Select Your Courses
            </h3>
            <p className="font-heading text-sm sm:text-base text-text-secondary m-0">
              {enrolledCourses.length > 0
                ? `You currently have ${enrolledCourses.length} course(s) enrolled for this semester.`
                : "Browse and select courses you want to register for this semester."}
            </p>
            {enrolledCourses.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {enrolledCourses.map((e) => (
                  <div key={e._id} className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
                    <Check size={16} color="#4F378A" />
                    <span className="font-heading text-sm text-text-primary">
                      {e.courseId?.code || e.courseId?.name || e.courseId?._id || "Unknown"}
                    </span>
                    <StatusBadge status={e.status} />
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate(ROUTES.STUDENT.ENROLLMENT)}
              className="mt-4 px-4 py-[9px] bg-primary text-white border-none rounded-lg font-body text-sm sm:text-base cursor-pointer"
            >
              {enrolledCourses.length > 0 ? "Add More Courses" : "Browse Courses"}
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h3 className="font-heading font-semibold text-lg sm:text-xl m-0 mb-4 text-text-primary">
              Review Your Selection
            </h3>
            {enrolledCourses.length === 0 ? (
              <>
                <p className="font-heading text-sm sm:text-base text-text-muted">
                  No courses enrolled yet. Go to Course Enrollment to select courses first.
                </p>
                <button
                  onClick={() => navigate(ROUTES.STUDENT.ENROLLMENT)}
                  className="mt-4 px-4 py-[9px] bg-primary text-white border-none rounded-lg font-body text-sm sm:text-base cursor-pointer"
                >
                  Go to Course Enrollment
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="font-heading text-sm sm:text-base text-text-secondary m-0 mb-2">
                  You have {enrolledCourses.length} course(s) selected for registration:
                </p>
                {enrolledCourses.map((e) => (
                  <div key={e._id} className="flex items-center gap-2 px-4 py-3 bg-white border border-border rounded-lg">
                    <Check size={16} color="#4F378A" />
                    <div className="flex-1">
                      <span className="font-heading text-sm text-text-primary">
                        {e.courseId?.code || e.courseId?.name || e.courseId?._id || "Unknown"}
                      </span>
                    </div>
                    <StatusBadge status={e.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 className="font-heading font-semibold text-lg sm:text-xl m-0 mb-4 text-text-primary">
              Semester Enrollment Agreement
            </h3>
            <p className="font-heading text-sm sm:text-base text-text-secondary leading-normal">
              By signing this agreement, you confirm that you have reviewed the course selections, understand the tuition
              obligations, and agree to abide by the academic policies and regulations of the university for the upcoming
              semester.
            </p>
            <label className="flex items-center gap-3 mt-4 font-heading cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 accent-primary"
              />
              <span className="text-sm sm:text-base">I have read and agree to the terms above.</span>
            </label>
          </div>
        )}

        {currentStep === 3 && (
          <div className="text-center">
            <Check size={48} color="#4F378A" className="mb-4" />
            <h3 className="font-heading font-semibold text-xl sm:text-2xl m-0 mb-2 text-text-primary">
              Registration Submitted!
            </h3>
            <p className="font-heading text-sm sm:text-base text-text-secondary m-0">
              Your semester registration has been submitted successfully.
            </p>
          </div>
        )}

        <div className="flex justify-between mt-6 sm:mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`px-4 py-2 border border-text-muted rounded-lg bg-transparent ${currentStep === 0 ? "text-border cursor-not-allowed" : "text-primary cursor-pointer"} font-body text-sm sm:text-base`}
          >
            Previous
          </button>

          <button
            onClick={handleConfirm}
            disabled={currentStep === 2 && (!agreed || submitting)}
            className={`px-4 py-[9px] ${currentStep === 3 ? "bg-bg-light text-text-muted" : "bg-primary text-white"} border-none rounded-lg font-body text-sm sm:text-base ${currentStep === 3 || (currentStep === 2 && (!agreed || submitting)) ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {currentStep === 3 ? "Completed" : currentStep === 2 ? "Confirm & Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SemesterRegistrationPage;
