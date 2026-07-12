import { useEffect, useState } from "react";
import { useAdvisingSession } from "../../hooks/useAdvisingSession";
import { useSemester } from "../../hooks/useSemester";
import { useStudent } from "../../hooks/useStudent";
import PageHeader from "../../shared/components/PageHeader";
import StatusBadge from "../../shared/components/StatusBadge";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Calendar, Plus, MessageSquare, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

const btnPrimary = "flex items-center p-[9px_16px] gap-2 bg-primary rounded-lg border-none text-white font-body text-sm sm:text-base cursor-pointer";

const StudentAdvisingPage = () => {
  const { sessions, loadSessions, createSession, loading, error } = useAdvisingSession();
  const { currentSemester, loadCurrentSemester } = useSemester();
  const { profile, loadProfile } = useStudent();
  const [showForm, setShowForm] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSessions();
    loadCurrentSemester();
    loadProfile();
  }, []);

  const hasAdvisor = !!profile?.advisorId;
  const noAdvisor = !loading && profile && !hasAdvisor;

  const handleCreate = async () => {
    if (!notes.trim() || !currentSemester?._id) return;
    setSubmitting(true);
    try {
      await createSession({ notes, semesterId: currentSemester._id });
      setNotes("");
      setShowForm(false);
      loadSessions();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[960px] mx-auto">
      <PageHeader title="Advising" subtitle="Schedule and manage advising sessions">
        <button
          className={`${btnPrimary} ${!hasAdvisor || !currentSemester?._id ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => hasAdvisor && currentSemester?._id && setShowForm(!showForm)}
          disabled={!hasAdvisor || !currentSemester?._id}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Session</span>
        </button>
      </PageHeader>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">{error}</div>
      )}

      {noAdvisor && (
        <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning rounded-lg">
          <AlertTriangle size={20} color="#B8860B" className="shrink-0 mt-0.5" />
          <div>
            <p className="font-heading font-semibold text-sm text-text-primary m-0">No Advisor Assigned</p>
            <p className="font-heading text-sm text-text-secondary m-0 mt-1">
              You don&apos;t have an academic advisor yet. Please contact the administration office to get an advisor assigned before you can request an advising session.
            </p>
          </div>
        </div>
      )}

      {!currentSemester && !loading && !noAdvisor && (
        <div className="p-4 bg-warning/10 border border-warning rounded-lg text-warning font-heading text-sm">
          No active semester found. Advising sessions cannot be created at this time.
        </div>
      )}

      {showForm && hasAdvisor && (
        <div className="bg-white border border-primary rounded-xl p-4 sm:p-6">
          <h3 className="font-heading font-semibold text-base sm:text-lg m-0 mb-4 text-text-primary">
            Schedule Advising Session
          </h3>
          {currentSemester?.name && (
            <p className="font-heading text-xs text-text-muted m-0 mb-3">
              Semester: {currentSemester.name}
            </p>
          )}
          <textarea
            placeholder="Describe what you would like to discuss..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full p-3 border border-border-color rounded-lg font-heading text-sm resize-vertical box-border"
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreate}
              disabled={!notes.trim() || !currentSemester?._id || submitting}
              className={`${btnPrimary} ${!notes.trim() || !currentSemester?._id || submitting ? "opacity-50" : ""}`}
            >
              {submitting ? "Submitting..." : "Request Session"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-text-muted rounded-lg bg-transparent text-primary font-body text-sm sm:text-base cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:gap-4">
        <h3 className="font-heading font-semibold text-lg sm:text-xl m-0 text-text-primary">
          Session History
        </h3>

        {(!sessions || sessions.length === 0) ? (
          <div className="p-8 text-center font-heading text-text-muted">
            No advising sessions found.
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session._id} className="bg-white border border-border-color rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                <div className="flex items-center gap-3">
                  <Calendar size={20} color="#4F378A" />
                  <span className="font-heading font-semibold text-sm sm:text-base text-text-primary">
                    {session.createdAt ? format(new Date(session.createdAt), "MMM dd, yyyy") : "Date TBD"}
                  </span>
                </div>
                <StatusBadge status={session.status} />
              </div>
              {session.notes && (
                <div className="flex gap-2 items-start">
                  <MessageSquare size={16} color="#7A7582" className="mt-0.5 shrink-0" />
                  <p className="font-heading text-sm text-text-secondary m-0">
                    {session.notes}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentAdvisingPage;
