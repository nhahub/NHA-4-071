import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdvisor } from '../../hooks/useAdvisor';
import LoadingSkeleton from '../../shared/components/LoadingSkeleton';
import { ROUTES } from '../../routes/RoutePaths';

const StudentListPage = () => {
  const { assignedStudents, loading, loadStudents } = useAdvisor();
  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, []);

  if (loading) {
    return (
      <div className="p-8" style={{ background: '#121415', minHeight: 'calc(100vh - 64px)' }}>
        <LoadingSkeleton type="table" count={5} />
      </div>
    );
  }

  const students = Array.isArray(assignedStudents) ? assignedStudents : [];

  return (
    <div className="space-y-6 p-8" style={{ background: '#121415', minHeight: 'calc(100vh - 64px)' }}>
      <div>
        <h1 className="font-heading font-semibold text-2xl text-[#E0E3E5] m-0">Assigned Students</h1>
        <p className="font-heading text-sm text-[#C2C6D6] mt-1 m-0">
          View and manage your assigned advisees.
        </p>
      </div>

      <div className="bg-[#1D2022] border border-[#424754] rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#272A2C]/60 border-b border-[#424754]">
              <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">University ID</th>
              <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">GPA</th>
              <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Level</th>
              <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#424754]/40">
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#C2C6D6] text-sm">No assigned students found.</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id || student.id} className="hover:bg-[#272A2C]/40 transition-colors">
                  <td className="py-3 px-4 text-[#E0E3E5] text-sm">{student.name || student.userId?.name || 'Unknown'}</td>
                  <td className="py-3 px-4 text-[#C2C6D6] text-sm font-mono">{student.universityId || student.userId?.universityId || 'N/A'}</td>
                  <td className="py-3 px-4 text-[#ADC6FF] text-sm font-mono">{student.GPA?.toFixed(2) ?? 'N/A'}</td>
                  <td className="py-3 px-4 text-[#C2C6D6] text-sm">{student.level ?? 'N/A'}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate(`${ROUTES.ADVISOR.STUDENT_PROGRESS.replace(':studentId', student._id || student.id)}`)}
                      className="px-3 py-1 bg-[#ADC6FF]/20 text-[#ADC6FF] rounded text-xs font-bold uppercase tracking-wider hover:bg-[#ADC6FF]/30 border-none cursor-pointer transition-colors"
                    >
                      View Progress
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentListPage;
