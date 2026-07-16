import { useEffect, useState } from 'react';
import { useAdvisor } from '../../hooks/useAdvisor';
import LoadingSkeleton from '../../shared/components/LoadingSkeleton';

const GraduationRequirements = () => {
  const { graduationAudit, loading, assignedStudents, loadStudents, loadGraduationAudit } = useAdvisor();
  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const students = assignedStudents?.students || [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedStudentId) {
      loadGraduationAudit(selectedStudentId);
    }
  };

  if (loading && !graduationAudit) {
    return (
      <div className="p-8" style={{ background: '#121415', minHeight: 'calc(100vh - 64px)' }}>
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8" style={{ background: '#121415', minHeight: 'calc(100vh - 64px)' }}>
      <div>
        <h1 className="font-heading font-semibold text-2xl text-[#E0E3E5] m-0">Graduation Requirements</h1>
        <p className="font-heading text-sm text-[#C2C6D6] mt-1 m-0">Audit student graduation progress.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <select
          required
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          className="flex-1 px-4 py-2 bg-[#1D2022] border border-[#424754] rounded text-[#E0E3E5] text-sm focus:outline-none focus:border-[#ADC6FF]"
        >
          <option value="">Select a student...</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.userId?.name || s.name || 'Unknown'} — {s.userId?.universityId || s.universityId || ''}
            </option>
          ))}
        </select>
        <button type="submit" className="px-6 py-2 bg-[#ADC6FF] hover:bg-[#8CAEFF] text-[#002E6A] font-bold text-xs uppercase rounded border-none cursor-pointer transition-all">
          Search
        </button>
      </form>

      {graduationAudit && (
        <div className="bg-[#1D2022] border border-[#424754] rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-heading font-semibold text-xl text-[#E0E3E5] m-0">{graduationAudit.studentName || 'Student'}</h2>
              <p className="text-sm text-[#C2C6D6] mt-1">{graduationAudit.universityId || ''} - {graduationAudit.departmentName || ''}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#ADC6FF]">{graduationAudit.progress ?? 0}%</div>
              <div className="text-xs text-[#C2C6D6] uppercase tracking-wider">Complete</div>
            </div>
          </div>

          <div className="w-full bg-[#333536] rounded-full h-3">
            <div style={{ width: `${graduationAudit.progress ?? 0}%` }} className="bg-[#E7C365] rounded-full h-3 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#191C1E] border border-[#424754] rounded p-4">
              <div className="text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-2">Courses</div>
              <div className="text-2xl font-bold text-[#E0E3E5]">
                {graduationAudit.completedCount ?? 0} / {graduationAudit.totalRequiredCourses ?? 0}
              </div>
              <div className="text-xs text-[#C2C6D6] mt-1">Completed</div>
            </div>
            <div className="bg-[#191C1E] border border-[#424754] rounded p-4">
              <div className="text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-2">Credits</div>
              <div className="text-2xl font-bold text-[#E0E3E5]">
                {graduationAudit.completedCredits ?? 0} / {graduationAudit.totalRequiredCredits ?? 0}
              </div>
              <div className="text-xs text-[#C2C6D6] mt-1">Earned</div>
            </div>
          </div>

          {graduationAudit.completedCourses && graduationAudit.completedCourses.length > 0 && (
            <div>
              <h3 className="font-heading font-semibold text-sm text-[#C2C6D6] uppercase tracking-wider mb-3">Completed Courses</h3>
              <div className="bg-[#191C1E] border border-[#424754] rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#272A2C]/60 border-b border-[#424754]">
                      <th className="py-2 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Code</th>
                      <th className="py-2 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Name</th>
                      <th className="py-2 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Credits</th>
                      <th className="py-2 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#424754]/40">
                    {graduationAudit.completedCourses.map((c, idx) => (
                      <tr key={idx} className="hover:bg-[#272A2C]/40 transition-colors">
                        <td className="py-2 px-4 text-[#ADC6FF] text-sm font-mono">{c.code || '-'}</td>
                        <td className="py-2 px-4 text-[#E0E3E5] text-sm">{c.name || '-'}</td>
                        <td className="py-2 px-4 text-[#C2C6D6] text-sm">{c.credits ?? '-'}</td>
                        <td className="py-2 px-4 text-[#ADC6FF] text-sm font-mono">{c.grade || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {!graduationAudit && !loading && (
        <div className="text-center py-12 text-[#C2C6D6]">Select a student above to view their graduation audit.</div>
      )}
    </div>
  );
};

export default GraduationRequirements;
