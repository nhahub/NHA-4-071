import { useEffect, useState } from "react";
import { useComplaint } from "../../hooks/useComplaint";
import PageHeader from "../../shared/components/PageHeader";
import StatusBadge from "../../shared/components/StatusBadge";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Plus, MessageSquare } from "lucide-react";
import { format } from "date-fns";

const btnPrimary = "flex items-center p-[9px_16px] gap-2 bg-primary rounded-lg border-none text-white font-body text-base cursor-pointer";

const StudentComplaintPage = () => {
  const { complaints, loadComplaints, submitComplaint, loading, error } = useComplaint();
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) return;
    setSubmitting(true);
    await submitComplaint({ subject, description });
    setSubject("");
    setDescription("");
    setShowForm(false);
    setSubmitting(false);
    loadComplaints();
  };

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="flex flex-col gap-8 max-w-[960px] mx-auto">
      <PageHeader title="Complaints" subtitle="Submit and track your complaints">
        <button className={btnPrimary} onClick={() => setShowForm(!showForm)}>
          <Plus size={16} />
          New Complaint
        </button>
      </PageHeader>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">{error}</div>
      )}

      {showForm && (
        <div className="bg-white border border-primary rounded-xl p-6 shadow-sm">
          <h3 className="font-heading font-semibold text-lg m-0 mb-4 text-text-primary">
            Submit a Complaint
          </h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="p-[10px_12px] border border-border-color rounded-lg font-heading text-sm"
            />
            <textarea
              placeholder="Describe your complaint in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="p-3 border border-border-color rounded-lg font-heading text-sm resize-vertical"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSubmit}
              disabled={!subject.trim() || !description.trim() || submitting}
              className={`${btnPrimary} ${!subject.trim() || !description.trim() ? "opacity-50" : ""}`}
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
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
          My Complaints
        </h3>

        {(!complaints || complaints.length === 0) ? (
          <div className="p-8 text-center font-heading text-text-muted">
            No complaints yet.
          </div>
        ) : (
          complaints.map((complaint) => (
            <div key={complaint._id} className="bg-white border border-border-color rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <MessageSquare size={20} color="#4F378A" />
                  <h4 className="font-heading font-semibold text-base m-0 text-text-primary">
                    {complaint.subject}
                  </h4>
                </div>
                <StatusBadge status={complaint.status} />
              </div>
              <p className="font-heading text-sm text-text-secondary m-0 ml-8">
                {complaint.description}
              </p>
              {complaint.createdAt && (
                <p className="font-heading text-xs text-text-muted mt-2 ml-8">
                  Submitted {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentComplaintPage;
