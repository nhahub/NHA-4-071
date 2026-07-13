import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAdvisor } from '../../hooks/useAdvisor';
import LoadingSkeleton from '../../shared/components/LoadingSkeleton';

const StudentProgressDetail = () => {
  const { id } = useParams();
  const { studentProgress, loading, loadStudentProgress } = useAdvisor();

  useEffect(() => {
    if (id) {
      loadStudentProgress(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-8" style={{ background: '#121415', minHeight: 'calc(100vh - 64px)' }}>
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  if (!studentProgress) {
    return (
      <div className="p-8" style={{ background: '#121415', minHeight: 'calc(100vh - 64px)' }}>
        <div className="text-center py-12 text-[#C2C6D6]">No student progress data available.</div>
      </div>
    );
  }

  const { student, enrollments, attendanceSummary, totalCreditsEarned, completedCoursesCount } = studentProgress;

  return (
    <div className="space-y-6 p-8" style={{ background: '#121415', minHeight: 'calc(100vh - 64px)' }}>
      <div>
        <h1 className="font-heading font-semibold text-2xl text-[#E0E3E5] m-0">Student Progress</h1>
        <p className="font-heading text-sm text-[#C2C6D6] mt-1 m-0">
          {student?.name || 'Student'} — {student?.universityId || ''} — {student?.departmentName || ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4">
          <div className="text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider">GPA</div>
          <div className="text-2xl font-bold text-[#ADC6FF] mt-1">{student?.GPA?.toFixed(2) ?? 'N/A'}</div>
        </div>
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4">
          <div className="text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider">Level</div>
          <div className="text-2xl font-bold text-[#E0E3E5] mt-1">{student?.level ?? 'N/A'}</div>
        </div>
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4">
          <div className="text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider">Credits Earned</div>
          <div className="text-2xl font-bold text-[#4CD7F6] mt-1">{totalCreditsEarned ?? 0}</div>
        </div>
        <div className="bg-[#1D2022] border border-[#424754] rounded p-4">
          <div className="text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider">Courses Completed</div>
          <div className="text-2xl font-bold text-[#E7C365] mt-1">{completedCoursesCount ?? 0}</div>
        </div>
      </div>

      {enrollments && enrollments.length > 0 && (
        <div className="bg-[#1D2022] border border-[#424754] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#424754]">
            <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">Enrollments</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#272A2C]/60 border-b border-[#424754]">
                <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Course</th>
                <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#424754]/40">
              {enrollments.map((e, idx) => (
                <tr key={idx} className="hover:bg-[#272A2C]/40 transition-colors">
                  <td className="py-3 px-4 text-[#E0E3E5] text-sm">{e.courseCode || 'Unknown'} — {e.courseName || ''}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      e.status === 'completed' ? 'bg-[#323537] text-[#C2C6D6]' :
                      e.status === 'enrolled' ? 'bg-[#4CD7F6]/20 text-[#4CD7F6]' :
                      'bg-[#93000A]/20 text-[#FFB4AB]'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#ADC6FF] text-sm font-mono">{e.grade || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {attendanceSummary && attendanceSummary.length > 0 && (
        <div className="bg-[#1D2022] border border-[#424754] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#424754]">
            <h3 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">Attendance Records</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#272A2C]/60 border-b border-[#424754]">
                <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#424754]/40">
              {attendanceSummary.map((att, idx) => (
                <tr key={idx} className="hover:bg-[#272A2C]/40 transition-colors">
                  <td className="py-3 px-4 text-[#E0E3E5] text-sm">{att.date ? new Date(att.date).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      att.status === 'present' ? 'bg-[#323537] text-[#C2C6D6]' :
                      att.status === 'late' ? 'bg-[#4CD7F6]/20 text-[#4CD7F6]' :
                      'bg-[#93000A]/20 text-[#FFB4AB]'
                    }`}>
                      {att.status || 'unknown'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentProgressDetail;
