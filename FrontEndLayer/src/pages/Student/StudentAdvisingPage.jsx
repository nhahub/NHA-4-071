import { useEffect, useState } from "react";
import { useAdvisingSession } from "../../hooks/useAdvisingSession";
import { useAuth } from "../../hooks/useAuth";
import PageHeader from "../../shared/components/PageHeader";
import StatusBadge from "../../shared/components/StatusBadge";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Calendar, Plus, MessageSquare } from "lucide-react";
import { format } from "date-fns";

const btnPrimary = "flex items-center p-[9px_16px] gap-2 bg-primary rounded-lg border-none text-white font-body text-base cursor-pointer";

const StudentAdvisingPage = () => {
  const { sessions, loadSessions, createSession, loading, error } = useAdvisingSession();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const handleCreate = async () => {
    if (!notes.trim()) return;
    setSubmitting(true);
    await createSession({ notes, semesterId: "current", studentId: user?._id });
    setNotes("");
    setShowForm(false);
    setSubmitting(false);
    loadSessions();
  };

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="flex flex-col gap-8 max-w-[960px] mx-auto">
      <PageHeader title="Advising" subtitle="Schedule and manage advising sessions">
        <button className={btnPrimary} onClick={() => setShowForm(!showForm)}>
          <Plus size={16} />
          New Session
        </button>
      </PageHeader>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">{error}</div>
      )}

      {showForm && (
        <div className="bg-white border border-primary rounded-xl p-6">
          <h3 className="font-heading font-semibold text-lg m-0 mb-4 text-text-primary">
            Schedule Advising Session
          </h3>
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
              disabled={!notes.trim() || submitting}
              className={`${btnPrimary} ${!notes.trim() || submitting ? "opacity-50" : ""}`}
            >
              {submitting ? "Submitting..." : "Request Session"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-text-muted rounded-lg bg-transparent text-primary font-body text-base cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-semibold text-xl m-0 text-text-primary">
          Session History
        </h3>

        {(!sessions || sessions.length === 0) ? (
          <div className="p-8 text-center font-heading text-text-muted">
            No advising sessions found.
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session._id} className="bg-white border border-border-color rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <Calendar size={20} color="#4F378A" />
                  <span className="font-heading font-semibold text-base text-text-primary">
                    {session.createdAt ? format(new Date(session.createdAt), "MMM dd, yyyy") : "Date TBD"}
                  </span>
                </div>
                <StatusBadge status={session.status} />
              </div>
              {session.notes && (
                <div className="flex gap-2 items-start">
                  <MessageSquare size={16} color="#7A7582" className="mt-0.5" />
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
