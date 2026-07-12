import { useEffect, useState } from 'react';
import { useAdvisor } from '../../hooks/useAdvisor';
import LoadingSkeleton from '../../shared/components/LoadingSkeleton';

const GraduationRequirements = () => {
  const { graduationAudit, loading, loadGraduationAudit } = useAdvisor();
  const [searchId, setSearchId] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      loadGraduationAudit(searchId.trim());
    }
  };

  if (loading) {
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
        <input
          type="text"
          placeholder="Enter Student ID or University ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-1 px-4 py-2 bg-[#1D2022] border border-[#424754] rounded text-[#E0E3E5] text-sm focus:outline-none focus:border-[#ADC6FF]"
        />
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
        </div>
      )}

      {!graduationAudit && !loading && (
        <div className="text-center py-12 text-[#C2C6D6]">Enter a student ID above to view their graduation audit.</div>
      )}
    </div>
  );
};

export default GraduationRequirements;
