import { useEffect } from "react";
import { useStudyPlan } from "../../hooks/useStudyPlan";
import { useStudent } from "../../hooks/useStudent";
import PageHeader from "../../shared/components/PageHeader";
import ProgressBar from "../../shared/components/ProgressBar";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { CheckCircle, Circle } from "lucide-react";

const StudyPlanPage = () => {
  const { studyPlan, loadStudyPlan, loading, error } = useStudyPlan();
  const { profile, loadProfile } = useStudent();

  useEffect(() => {
    loadStudyPlan();
    loadProfile();
  }, []);

  if (loading) return <LoadingSkeleton count={3} />;

  const years = studyPlan?.years || [];
  const totalRequired = studyPlan?.totalRequired || years.reduce((sum, y) =>
    sum + (y.semesters || []).reduce((ss, sem) =>
      ss + (sem.courses || []).reduce((cs, c) => cs + (c.credits || 0), 0), 0), 0);
  const totalEarned = years.reduce((sum, y) =>
    sum + (y.semesters || []).reduce((ss, sem) =>
      ss + (sem.courses || []).reduce((cs, c) => cs + (c.completed ? (c.credits || 0) : 0), 0), 0), 0);

  return (
    <div className="flex flex-col gap-8 max-w-[960px] mx-auto">
      <PageHeader title="Study Plan" subtitle="Degree requirements and course roadmap" />

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">{error}</div>
      )}

      <div className="bg-primary rounded-xl p-8 flex flex-col gap-4">
        <h3 className="font-heading font-semibold text-2xl m-0 text-white">
          {studyPlan?.degreeName || profile?.program || "Degree Program"}
        </h3>
        <p className="font-heading text-sm text-[#E0D2FF] opacity-80 m-0">
          {profile?.departmentName || studyPlan?.department || ""}
        </p>
        <div className="flex gap-4 items-center">
          <span className="font-body text-base text-[#E0D2FF] opacity-80">
            {totalEarned} / {totalRequired} credits completed
          </span>
          <span className="font-heading font-semibold text-sm text-[#E0D2FF]">
            {Math.round((totalEarned / totalRequired) * 100)}%
          </span>
        </div>
        <ProgressBar value={totalEarned} max={totalRequired} color="#FFFFFF" height={10} />
      </div>

      {years.map((year) => (
        <div key={year.year}>
          <h3 className="font-heading font-semibold text-xl m-0 mb-4 text-text-primary">
            {year.year}
          </h3>
          <div className="flex flex-col gap-4">
            {year.semesters.map((sem) => (
              <div key={sem.name} className="bg-white border border-border-color rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-3 bg-bg-light">
                  <span className="font-heading font-bold text-base text-primary">
                    {sem.name}
                  </span>
                </div>
                <div className="p-4">
                  {sem.courses.map((course) => (
                    <div key={course.code} className="flex items-center gap-3 py-2 border-b border-bg-light">
                      {course.completed ? (
                        <CheckCircle size={20} color="#4F378A" />
                      ) : (
                        <Circle size={20} color="#CBC4D2" />
                      )}
                      <div className="flex-1">
                        <span className="font-heading font-semibold text-sm text-text-primary">
                          {course.code}
                        </span>
                        <span className="font-heading text-sm text-text-secondary ml-2">
                          {course.name}
                        </span>
                      </div>
                      <span className="font-heading text-sm text-text-muted">
                        {course.credits} cr
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyPlanPage;
