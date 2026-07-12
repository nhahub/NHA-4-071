import { useEffect } from 'react';
import { useAdvisor } from '../../hooks/useAdvisor';
import LoadingSkeleton from '../../shared/components/LoadingSkeleton';

const IssueResolutionPage = () => {
  const { issues, loading, loadIssues, updateIssue } = useAdvisor();

  useEffect(() => {
    loadIssues();
  }, []);

  const handleStatusChange = async (issueId, status) => {
    await updateIssue(issueId, status);
    loadIssues();
  };

  if (loading) {
    return (
      <div className="p-8" style={{ background: '#121415', minHeight: 'calc(100vh - 64px)' }}>
        <LoadingSkeleton type="table" count={5} />
      </div>
    );
  }

  const complaints = issues?.complaints || [];

  return (
    <div className="space-y-6 p-8" style={{ background: '#121415', minHeight: 'calc(100vh - 64px)' }}>
      <div>
        <h1 className="font-heading font-semibold text-2xl text-[#E0E3E5] m-0">Issue Resolution</h1>
        <p className="font-heading text-sm text-[#C2C6D6] mt-1 m-0">Review and resolve student complaints and issues.</p>
      </div>

      <div className="bg-[#1D2022] border border-[#424754] rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#272A2C]/60 border-b border-[#424754]">
              <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Subject</th>
              <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#424754]/40">
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#C2C6D6] text-sm">No issues found.</td>
              </tr>
            ) : (
              complaints.map((issue) => (
                <tr key={issue._id} className="hover:bg-[#272A2C]/40 transition-colors">
                  <td className="py-3 px-4 text-[#E0E3E5] text-sm font-medium">{issue.subject || 'Untitled'}</td>
                  <td className="py-3 px-4 text-[#C2C6D6] text-sm max-w-[300px] truncate">{issue.description || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      issue.status === 'resolved' ? 'bg-[#323537] text-[#C2C6D6]' :
                      issue.status === 'in_progress' ? 'bg-[#4CD7F6]/20 text-[#4CD7F6]' :
                      issue.status === 'rejected' ? 'bg-[#93000A]/20 text-[#FFB4AB]' :
                      'bg-[#ADC6FF]/20 text-[#ADC6FF]'
                    }`}>
                      {issue.status || 'pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {issue.status !== 'resolved' && (
                        <button onClick={() => handleStatusChange(issue._id, 'resolved')} className="px-2 py-1 bg-[#323537] text-[#C2C6D6] rounded text-[10px] font-bold uppercase border-none cursor-pointer hover:bg-[#3D4144]">
                          Resolve
                        </button>
                      )}
                      {issue.status === 'pending' && (
                        <button onClick={() => handleStatusChange(issue._id, 'in_progress')} className="px-2 py-1 bg-[#4CD7F6]/20 text-[#4CD7F6] rounded text-[10px] font-bold uppercase border-none cursor-pointer hover:bg-[#4CD7F6]/30">
                          In Progress
                        </button>
                      )}
                    </div>
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

export default IssueResolutionPage;
