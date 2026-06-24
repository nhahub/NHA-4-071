import { useState, useEffect } from "react";
import { useExam } from "../../hooks/useExam";
import PageHeader from "../../shared/components/PageHeader";
import StatusBadge from "../../shared/components/StatusBadge";
import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
import { Search, Calendar, MapPin, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";

const ExamSchedulePage = () => {
  const { exams, loadExams, loading, error } = useExam();
  const [search, setSearch] = useState("");

  useEffect(() => { loadExams(); }, []);

  if (loading) return <LoadingSkeleton count={3} />;

  const filtered = (exams || []).filter(
    (e) =>
      (e.courseCode || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.courseName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 max-w-[960px] mx-auto">
      <PageHeader title="Exam Schedule" subtitle="View upcoming and past exams" />

      {error && (
        <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">{error}</div>
      )}

      <div className="flex items-center gap-3 px-4 py-3 bg-white border border-border rounded-lg shadow-sm">
        <Search size={20} color="#7A7582" />
        <input
          type="text"
          placeholder="Search exams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-none outline-none font-heading text-base text-text-primary bg-transparent"
        />
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="p-8 text-center font-heading text-text-muted">
            No exams found matching your search.
          </div>
        ) : (
          filtered.map((exam) => (
            <div
              key={exam._id}
              className="bg-white border border-border rounded-xl p-6 shadow-sm flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-heading font-semibold text-lg m-0 text-primary">
                    {exam.courseCode || exam.course}
                  </h3>
                  <StatusBadge status={exam.status} />
                </div>
                <h4 className="font-heading font-normal text-base m-0 mb-2 text-text-primary">
                  {exam.courseName || exam.name}
                </h4>
                <div className="flex gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 font-heading text-sm text-text-secondary">
                    <Calendar size={14} color="#4F378A" />
                    {exam.date ? format(parseISO(exam.date), "MMM dd, yyyy") : "TBD"}
                  </span>
                  <span className="flex items-center gap-1.5 font-heading text-sm text-text-secondary">
                    <Clock size={14} color="#4F378A" />
                    {exam.startTime} - {exam.endTime}
                  </span>
                  <span className="flex items-center gap-1.5 font-heading text-sm text-text-secondary">
                    <MapPin size={14} color="#4F378A" />
                    {exam.room} (Seat {exam.seat})
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExamSchedulePage;
