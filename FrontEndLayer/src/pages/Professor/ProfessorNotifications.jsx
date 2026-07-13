import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../store/professor/professorThunks";
import { 
  Download, Flag, Trash2, Paperclip, Smile, MoreHorizontal, 
  FileText 
} from "lucide-react";

const ProfessorNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.professor);
  const [activeMessage, setActiveMessage] = useState(1);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  if (error) {
    return <div className="p-8 text-danger font-heading font-bold text-xl flex items-center justify-center h-full">{error}</div>;
  }

  if (loading || !notifications) {
    return <div className="p-8 text-white font-heading font-bold text-xl flex items-center justify-center h-full">Loading notifications...</div>;
  }

  const metrics = notifications.metrics || {};
  const messages = notifications.messages || [];

  const selectedMsg = messages.find(m => m.id === activeMessage) || messages[0];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-text-primary h-[calc(100vh-120px)]">
      
      {/* Header */}
      <div className="flex flex-col flex-shrink-0">
        <h1 className="font-heading font-bold text-[32px] m-0 text-white leading-tight">Communications Center</h1>
        <p className="font-heading text-sm text-text-secondary mt-1">Manage student interactions, administrative broadcasts, and automated system alerts in a unified high-density workspace.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-shrink-0">
        <div className="bg-bg-light border border-border border-l-4 border-l-primary rounded-r-xl p-5 flex flex-col justify-between">
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-2">Unread Messages</span>
          <span className="text-3xl font-bold text-primary">{metrics.unreadMessages}</span>
        </div>

        <div className="bg-bg-light border border-border border-l-4 border-l-danger rounded-r-xl p-5 flex flex-col justify-between">
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-2">Pending Grade Appeals</span>
          <span className="text-3xl font-bold text-danger">0{metrics.pendingAppeals}</span>
        </div>

        <div className="bg-bg-light border border-border border-l-4 border-l-primary rounded-r-xl p-5 flex flex-col justify-between">
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-2">Department Alerts</span>
          <span className="text-3xl font-bold text-primary">0{metrics.departmentAlerts}</span>
        </div>

        <div className="bg-bg-light border border-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">View Filter</span>
            <button className="bg-transparent border-none text-[10px] text-primary font-bold uppercase tracking-wider cursor-pointer hover:text-white transition-colors">Clear All</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary text-bg-page font-bold text-xs rounded-full cursor-pointer">All</span>
            <span className="px-3 py-1 bg-[rgba(255,255,255,0.05)] text-text-secondary font-bold text-xs rounded-full cursor-pointer hover:text-white transition-colors">Students</span>
            <span className="px-3 py-1 bg-[rgba(255,255,255,0.05)] text-text-secondary font-bold text-xs rounded-full cursor-pointer hover:text-white transition-colors">Admin</span>
            <span className="px-3 py-1 bg-[rgba(255,255,255,0.05)] text-text-secondary font-bold text-xs rounded-full cursor-pointer hover:text-white transition-colors">System</span>
          </div>
        </div>
      </div>

      {/* Main Content: Two Columns */}
      <div className="flex gap-6 h-full min-h-[500px] overflow-hidden">
        
        {/* Left Column: Message List */}
        <div className="w-[350px] flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              onClick={() => setActiveMessage(msg.id)}
              className={`flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                activeMessage === msg.id 
                  ? 'bg-bg-light border border-primary relative' 
                  : 'bg-bg-light border border-border hover:bg-[rgba(255,255,255,0.02)]'
              }`}
            >
              {activeMessage === msg.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"></div>
              )}
              <div className="flex justify-between items-center mb-2 pl-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  msg.type === 'Student Message' ? 'text-primary' : 
                  msg.type === 'Department' ? 'text-primary' : 'text-danger'
                }`}>{msg.type}</span>
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">{msg.time}</span>
              </div>
              <span className="font-heading font-bold text-base text-white mb-2 pl-1">{msg.sender}</span>
              <p className="text-xs text-text-secondary line-clamp-2 m-0 pl-1 leading-relaxed">
                {msg.snippet}
              </p>
            </div>
          ))}
        </div>

        {/* Right Column: Active Message Thread */}
        <div className="flex-1 bg-bg-light border border-border rounded-xl flex flex-col overflow-hidden">
          {selectedMsg && (
            <>
              {/* Thread Header */}
              <div className="flex justify-between items-center p-6 border-b border-[rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${selectedMsg.color}`}>
                    {selectedMsg.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading font-bold text-xl text-white">{selectedMsg.sender}</span>
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-1">{selectedMsg.course}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-text-secondary">
                  <button className="bg-transparent border-none text-text-secondary cursor-pointer hover:text-white transition-colors"><Download size={18} /></button>
                  <button className="bg-transparent border-none text-text-secondary cursor-pointer hover:text-white transition-colors"><Flag size={18} /></button>
                  <button className="bg-transparent border-none text-text-secondary cursor-pointer hover:text-danger transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>

              {/* Thread Subject */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)]">
                <span className="text-xs text-white font-bold uppercase tracking-wider">Subject: <span className="text-text-secondary font-normal">{selectedMsg.subject}</span></span>
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider font-mono">Received: {selectedMsg.date}</span>
              </div>

              {/* Thread Body */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 text-sm text-white leading-relaxed">
                {selectedMsg.content?.map((paragraph, idx) => (
                  <p key={idx} className="m-0 whitespace-pre-wrap">{paragraph}</p>
                ))}

                {/* Attachment */}
                {selectedMsg.attachment && (
                  <div className="mt-4 p-4 border border-[rgba(255,255,255,0.1)] rounded-lg flex justify-between items-center bg-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-[#121620] flex items-center justify-center text-text-secondary border border-border">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-white">{selectedMsg.attachment.name}</span>
                        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mt-1">{selectedMsg.attachment.size} • {selectedMsg.attachment.type}</span>
                      </div>
                    </div>
                    <button className="bg-transparent border-none text-text-secondary cursor-pointer hover:text-white transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Compose Box */}
          <div className="p-6 border-t border-[rgba(255,255,255,0.05)]">
            <div className="border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(255,255,255,0.02)] p-4 flex flex-col gap-4 transition-colors focus-within:border-primary">
              <textarea 
                className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-text-secondary resize-none min-h-[60px]"
                placeholder="Compose your response..."
              ></textarea>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-4 text-text-secondary">
                  <button className="bg-transparent border-none text-text-secondary cursor-pointer hover:text-white transition-colors"><Paperclip size={18} /></button>
                  <button className="bg-transparent border-none text-text-secondary cursor-pointer hover:text-white transition-colors"><Smile size={18} /></button>
                  <button className="bg-transparent border-none text-text-secondary cursor-pointer hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
                </div>
                <button className="bg-[#064e3b] text-primary hover:bg-primary hover:text-bg-page border border-primary px-6 py-2 rounded font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors">
                  Send Message
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfessorNotifications;
