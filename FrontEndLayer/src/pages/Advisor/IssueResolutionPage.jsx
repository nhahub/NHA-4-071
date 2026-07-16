import { useEffect, useState } from 'react';
import { useAdvisor } from '../../hooks/useAdvisor';
import LoadingSkeleton from '../../shared/components/LoadingSkeleton';

const IssueResolutionPage = () => {
  const { issues, loading, loadIssues, updateIssue } = useAdvisor();

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveIssueId, setResolveIssueId] = useState(null);

  useEffect(() => {
    loadIssues();
  }, []);

  const handleResolveClick = (issueId) => {
    setResolutionNote("");
    setResolveIssueId(issueId);
    setShowResolveModal(true);
  };

  const confirmResolve = async () => {
    await updateIssue(resolveIssueId, "resolved", resolutionNote);
    setShowResolveModal(false);
    setResolveIssueId(null);
    loadIssues();
  };

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
    <div className="flex gap-6 p-8" style={{ background: '#121415', minHeight: 'calc(100vh - 64px)' }}>
      <div className="flex-1 space-y-6 min-w-0">
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
                  <tr
                    key={issue._id}
                    className={`hover:bg-[#272A2C]/40 transition-colors cursor-pointer ${selectedIssue?._id === issue._id ? 'bg-[#272A2C]/60' : ''}`}
                    onClick={() => setSelectedIssue(issue)}
                  >
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
                          <button
                            onClick={(e) => { e.stopPropagation(); handleResolveClick(issue._id); }}
                            className="px-2 py-1 bg-[#323537] text-[#C2C6D6] rounded text-[10px] font-bold uppercase border-none cursor-pointer hover:bg-[#3D4144]"
                          >
                            Resolve
                          </button>
                        )}
                        {issue.status === 'pending' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(issue._id, 'in_progress'); }}
                            className="px-2 py-1 bg-[#4CD7F6]/20 text-[#4CD7F6] rounded text-[10px] font-bold uppercase border-none cursor-pointer hover:bg-[#4CD7F6]/30"
                          >
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

      {selectedIssue && (
        <div className="w-96 shrink-0 bg-[#1D2022] border border-[#424754] rounded-lg p-5 space-y-4 h-fit sticky top-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-[#E0E3E5] m-0">Issue Details</h2>
            <button onClick={() => setSelectedIssue(null)} className="text-[#6B7280] hover:text-[#C2C6D6] bg-transparent border-none cursor-pointer text-lg leading-none">&times;</button>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Subject</span>
              <p className="text-sm text-[#E0E3E5] m-0 mt-0.5">{selectedIssue.subject}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Description</span>
              <p className="text-sm text-[#C2C6D6] m-0 mt-0.5 leading-relaxed">{selectedIssue.description}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Status</span>
              <p className="text-sm text-[#E0E3E5] m-0 mt-0.5 capitalize">{selectedIssue.status}</p>
            </div>
            {selectedIssue.resolutionNote && (
              <div className="bg-[#064E3B]/20 border border-[#6EE7B7]/30 rounded-lg p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6EE7B7]">Resolution Note</span>
                <p className="text-sm text-[#C2C6D6] m-0 mt-1 leading-relaxed whitespace-pre-wrap">{selectedIssue.resolutionNote}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowResolveModal(false)}>
          <div className="bg-[#1D2022] border border-[#424754] rounded-xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#424754]/60">
              <h3 className="font-heading font-bold text-base text-[#E0E3E5] m-0">Resolve Complaint</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="font-heading text-sm text-[#C2C6D6] m-0 leading-relaxed">Provide a resolution summary for the student:</p>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Describe how the complaint was resolved..."
                className="w-full bg-[#101415] border border-[#424754] rounded-lg p-3 text-sm text-[#E0E3E5] focus:outline-none focus:border-[#4D8EFF] resize-none h-24 placeholder:text-[#6B7280] font-heading"
              />
            </div>
            <div className="px-6 py-4 border-t border-[#424754]/60 flex justify-end gap-3">
              <button onClick={() => setShowResolveModal(false)} className="px-4 py-2 bg-transparent text-[#C2C6D6] rounded-lg text-sm font-bold border border-[#424754] cursor-pointer hover:bg-[#272A2C]">Cancel</button>
              <button onClick={confirmResolve} className="px-4 py-2 bg-[#4D8EFF] text-white rounded-lg text-sm font-bold border-none cursor-pointer hover:bg-[#3D7AE8]">Confirm Resolve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueResolutionPage;
