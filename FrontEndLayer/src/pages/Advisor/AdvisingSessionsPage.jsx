import { useEffect, useState } from 'react';
import { useAdvisor } from '../../hooks/useAdvisor';
import LoadingSkeleton from '../../shared/components/LoadingSkeleton';

const AdvisingSessionsPage = () => {
  const { sessions, loading, loadSessions, createSession, updateSession } = useAdvisor();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', semesterId: '', notes: '' });

  useEffect(() => {
    loadSessions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.semesterId) return;
    await createSession(formData);
    setFormData({ studentId: '', semesterId: '', notes: '' });
    setShowForm(false);
    loadSessions();
  };

  const handleStatusUpdate = async (sessionId, status) => {
    await updateSession(sessionId, { status });
    loadSessions();
  };

  if (loading) {
    return (
      <div className="p-8" style={{ background: '#121415', minHeight: 'calc(100vh - 64px)' }}>
        <LoadingSkeleton type="card" count={3} />
      </div>
    );
  }

  const sessionList = Array.isArray(sessions) ? sessions : [];

  return (
    <div className="space-y-6 p-8" style={{ background: '#121415', minHeight: 'calc(100vh - 64px)' }}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-[#E0E3E5] m-0">Advising Sessions</h1>
          <p className="font-heading text-sm text-[#C2C6D6] mt-1 m-0">Manage your advising sessions with students.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#ADC6FF] hover:bg-[#8CAEFF] text-[#002E6A] font-heading font-bold text-[11px] uppercase tracking-wider rounded border-none cursor-pointer transition-all"
        >
          {showForm ? 'Cancel' : 'New Session'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1D2022] border border-[#424754] rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-1">Student ID</label>
              <input
                type="text"
                required
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 bg-[#101415] border border-[#424754] rounded text-[#E0E3E5] text-sm focus:outline-none focus:border-[#ADC6FF]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-1">Semester ID</label>
              <input
                type="text"
                required
                value={formData.semesterId}
                onChange={(e) => setFormData({ ...formData, semesterId: e.target.value })}
                className="w-full px-3 py-2 bg-[#101415] border border-[#424754] rounded text-[#E0E3E5] text-sm focus:outline-none focus:border-[#ADC6FF]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-[#101415] border border-[#424754] rounded text-[#E0E3E5] text-sm focus:outline-none focus:border-[#ADC6FF] h-20 resize-none"
              placeholder="Session notes..."
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-[#ADC6FF] hover:bg-[#8CAEFF] text-[#002E6A] font-bold text-xs uppercase rounded border-none cursor-pointer">
            Create Session
          </button>
        </form>
      )}

      <div className="bg-[#1D2022] border border-[#424754] rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#272A2C]/60 border-b border-[#424754]">
              <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Student</th>
              <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Notes</th>
              <th className="py-3 px-4 font-heading font-bold text-[11px] text-[#C2C6D6] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#424754]/40">
            {sessionList.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#C2C6D6] text-sm">No advising sessions found.</td>
              </tr>
            ) : (
              sessionList.map((session) => (
                <tr key={session._id} className="hover:bg-[#272A2C]/40 transition-colors">
                  <td className="py-3 px-4 text-[#E0E3E5] text-sm">
                    {typeof session.studentId === 'object' ? (session.studentId.name || session.studentId._id) : session.studentId}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      session.status === 'completed' ? 'bg-[#323537] text-[#C2C6D6]' :
                      session.status === 'scheduled' ? 'bg-[#4CD7F6]/20 text-[#4CD7F6]' :
                      session.status === 'cancelled' ? 'bg-[#93000A]/20 text-[#FFB4AB]' :
                      'bg-[#ADC6FF]/20 text-[#ADC6FF]'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#C2C6D6] text-sm max-w-[200px] truncate">{session.notes || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {session.status === 'scheduled' && (
                        <>
                          <button onClick={() => handleStatusUpdate(session._id, 'completed')} className="px-2 py-1 bg-[#323537] text-[#C2C6D6] rounded text-[10px] font-bold uppercase border-none cursor-pointer hover:bg-[#3D4144]">
                            Complete
                          </button>
                          <button onClick={() => handleStatusUpdate(session._id, 'cancelled')} className="px-2 py-1 bg-[#93000A]/20 text-[#FFB4AB] rounded text-[10px] font-bold uppercase border-none cursor-pointer hover:bg-[#93000A]/30">
                            Cancel
                          </button>
                        </>
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

export default AdvisingSessionsPage;
