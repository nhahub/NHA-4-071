import { useEffect } from "react";
import { useTranscript } from "../../hooks/useTranscript";
import { useStudent } from "../../hooks/useStudent";
import PageHeader from "../../shared/components/PageHeader";
import KPICard from "../../shared/components/KPICard";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Download } from "lucide-react";

const TranscriptPage = () => {
  const { transcript, loadTranscript, loading: loadingT, error: errorT } = useTranscript();
  const { profile, loadProfile, loading: loadingP, error: errorP } = useStudent();

  useEffect(() => {
    loadTranscript();
    loadProfile();
  }, []);

  if (loadingT || loadingP) return <LoadingSkeleton count={3} />;
  const error = errorT || errorP;

  const semesters = transcript?.semesters || [];
  const totalCredits = semesters.reduce((sum, s) => sum + (s.courses || []).reduce((cs, c) => cs + (c.credits || 0), 0), 0);
  const cumulativeGpa = semesters.length > 0 ? (semesters.reduce((sum, s) => sum + (s.gpa || 0) * (s.totalCredits || 0), 0) / semesters.reduce((sum, s) => sum + (s.totalCredits || 0), 0)).toFixed(2) : "0.00";

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[960px] mx-auto">
      <PageHeader title="Transcript" subtitle="Academic record and semester breakdown">
        <button onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 border border-text-muted rounded-lg bg-transparent text-primary font-body text-sm sm:text-base cursor-pointer">
          <Download size={14} color="#4F378A" />
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </PageHeader>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <KPICard label="CUMULATIVE GPA" value={cumulativeGpa} subtitle={cumulativeGpa >= 3.5 ? "Outstanding" : cumulativeGpa >= 3.0 ? "Good" : cumulativeGpa >= 2.0 ? "Satisfactory" : "—"} borderColor="#4F378A" />
        <KPICard label="TOTAL CREDITS" value={totalCredits} subtitle="earned" borderColor="#63597C" />
        <KPICard label="PROGRAM" value={profile?.program || transcript?.program || transcript?.degree || "—"} subtitle={profile?.departmentName || transcript?.department || "—"} borderColor="#CFBCFF" />
      </div>

      <div className="flex flex-col gap-4 sm:gap-6">
        {semesters.map((sem, si) => (
          <div key={sem.name} className="bg-white border border-border-color rounded-xl overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-8 py-3 bg-bg-light gap-2">
              <span className="font-heading font-bold text-sm sm:text-base text-primary">{sem.name}</span>
              <div className="flex items-center gap-4 sm:gap-6">
                <span className="font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                  GPA: {(sem.gpa || 0).toFixed(2)}
                </span>
                <span className="font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">
                  Credits: {(sem.courses || []).reduce((s, c) => s + (c.credits || 0), 0)}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[360px]">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="text-left px-4 sm:px-8 py-3 sm:py-4 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">Code</th>
                    <th className="text-left px-4 sm:px-8 py-3 sm:py-4 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">Course</th>
                    <th className="text-left px-4 sm:px-8 py-3 sm:py-4 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">Credits</th>
                    <th className="text-right px-4 sm:px-8 py-3 sm:py-4 font-heading font-semibold text-[10px] sm:text-xs tracking-wider uppercase text-text-secondary">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {(sem.courses || []).map((course, ci) => (
                    <tr key={course.code} className={ci > 0 ? "border-t border-border-color" : ""}>
                      <td className="px-4 sm:px-8 py-3 sm:py-[18.5px] font-body text-sm sm:text-base text-primary">{course.code}</td>
                      <td className="px-4 sm:px-8 py-3 sm:py-4 font-heading text-sm sm:text-base text-text-primary">{course.name}</td>
                      <td className="px-4 sm:px-8 py-3 sm:py-4 font-heading text-sm sm:text-base text-text-primary">{course.credits}</td>
                      <td className="px-4 sm:px-8 py-3 sm:py-[18.5px] font-heading font-bold text-sm sm:text-base text-warning text-right">{course.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptPage;
