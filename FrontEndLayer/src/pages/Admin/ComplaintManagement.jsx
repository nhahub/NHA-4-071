import { useState, useEffect } from "react";
import {
  User, Lock, Send, Paperclip, CheckCircle, AlertTriangle,
  Clock, ShieldAlert, ChevronDown, Filter, Search, MessageSquare
} from "lucide-react";
import { getAllComplaints, updateComplaintStatus } from "../../services/adminService";

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterTab, setFilterTab] = useState("ALL"); // ALL, OPEN, CLOSED
  const [activeComposeTab, setActiveComposeTab] = useState("REPLY"); // REPLY, NOTE
  const [composeText, setComposeText] = useState("");
  const [agent, setAgent] = useState("Unassigned");

  useEffect(() => {
    getAllComplaints().then((result) => {
      if (result.success && result.data?.complaints) {
        const formatted = result.data.complaints.map((c) => ({
          _id: c._id,
          ticketNumber: c._id.slice(-6).toUpperCase(),
          title: c.subject,
          snippet: c.description,
          status: c.status?.toUpperCase() || "OPEN",
          statusBadge: c.status === "resolved" ? "bg-[#323537] text-[#C2C6D6]" : "bg-[#03B5D3] text-[#00424E]",
          category: "COMPLAINT",
          categoryColor: "text-[#4D8EFF]",
          timeAgo: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A",
          dateFormatted: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A",
          student: {
            name: typeof c.studentId === 'object' ? (c.studentId.userId?.name || "Student") : "Student",
            avatar: "",
            major: "",
            previousTickets: [],
            auditLog: [],
          },
          messages: [{ id: 1, sender: "Student", time: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "", text: c.description, isStudent: true }],
          agent: "Unassigned",
        }));
        setComplaints(formatted);
        if (formatted.length > 0) setSelectedTicket(formatted[0]);
      }
    });
  }, []);

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setAgent(ticket.agent || "Unassigned");
    setComposeText("");
  };

  const handleSend = () => {
    if (!composeText.trim()) return;

    if (activeComposeTab === "REPLY") {
      const newMessage = {
        id: Date.now(),
        sender: "Dr. Aminul (Chief Admin)",
        time: "Just now",
        text: composeText,
        isStudent: false,
      };
      const updated = complaints.map((c) =>
        c._id === selectedTicket._id
          ? { ...c, messages: [...c.messages, newMessage], status: "IN-PROGRESS", statusBadge: "bg-[#03B5D3] text-[#00424E]" }
          : c
      );
      setComplaints(updated);
      setSelectedTicket((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        status: "IN-PROGRESS",
        statusBadge: "bg-[#03B5D3] text-[#00424E]",
      }));
    } else {
      // Internal Note
      const newNote = {
        author: "Dr. Aminul (Chief Admin)",
        note: composeText,
      };
      const updated = complaints.map((c) =>
        c._id === selectedTicket._id ? { ...c, internalNote: newNote } : c
      );
      setComplaints(updated);
      setSelectedTicket((prev) => ({ ...prev, internalNote: newNote }));
    }
    setComposeText("");
  };

  const handleResolve = () => {
    const updated = complaints.map((c) =>
      c._id === selectedTicket._id
        ? { ...c, status: "RESOLVED", statusBadge: "bg-[#323537] text-[#C2C6D6]" }
        : c
    );
    setComplaints(updated);
    setSelectedTicket((prev) => ({
      ...prev,
      status: "RESOLVED",
      statusBadge: "bg-[#323537] text-[#C2C6D6]",
    }));
  };

  const handleAgentChange = (newAgent) => {
    setAgent(newAgent);
    const updated = complaints.map((c) =>
      c._id === selectedTicket._id ? { ...c, agent: newAgent } : c
    );
    setComplaints(updated);
    setSelectedTicket((prev) => ({ ...prev, agent: newAgent }));
  };

  const filteredTickets = complaints.filter((t) => {
    if (filterTab === "ALL") return true;
    if (filterTab === "OPEN") return t.status !== "RESOLVED" && t.status !== "CLOSED";
    if (filterTab === "CLOSED") return t.status === "RESOLVED" || t.status === "CLOSED";
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Page Title & Overview */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#424754] pb-6">
        <div>
          <h1 className="font-heading font-semibold text-2xl text-[#E0E3E5] tracking-[-0.24px] m-0">
            Complaint Management
          </h1>
          <p className="font-heading text-sm text-[#C2C6D6] mt-1 m-0">
            Helpdesk ticketing system, student grievances, grade appeals, and resolution workflows.
          </p>
        </div>
      </div>

      {/* Helpdesk 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[840px]">
        
        {/* COLUMN 1: Ticket Inbox Panel (Col Span 3 or w-320px) */}
        <div className="lg:col-span-3 bg-[#191C1E] border border-[#424754] rounded-lg flex flex-col overflow-hidden shadow-xl max-h-[880px]">
          {/* Header & Tabs */}
          <div className="p-4 border-b border-[#424754] space-y-3 bg-[#1D2022]">
            <h2 className="font-heading font-semibold text-lg text-[#E0E3E5] m-0">
              Ticket Inbox
            </h2>

            {/* Filter Tabs */}
            <div className="grid grid-cols-3 gap-2 font-heading text-[10px] uppercase font-bold">
              <button
                onClick={() => setFilterTab("ALL")}
                className={`py-1.5 rounded transition-colors cursor-pointer border-none ${
                  filterTab === "ALL"
                    ? "bg-[#ADC6FF] text-[#002E6A] shadow-sm"
                    : "bg-[#101415] text-[#C2C6D6] hover:text-[#E0E3E5] border border-[#424754]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterTab("OPEN")}
                className={`py-1.5 rounded transition-colors cursor-pointer border-none ${
                  filterTab === "OPEN"
                    ? "bg-[#ADC6FF] text-[#002E6A] shadow-sm"
                    : "bg-[#101415] text-[#C2C6D6] hover:text-[#E0E3E5] border border-[#424754]"
                }`}
              >
                Open
              </button>
              <button
                onClick={() => setFilterTab("CLOSED")}
                className={`py-1.5 rounded transition-colors cursor-pointer border-none ${
                  filterTab === "CLOSED"
                    ? "bg-[#ADC6FF] text-[#002E6A] shadow-sm"
                    : "bg-[#101415] text-[#C2C6D6] hover:text-[#E0E3E5] border border-[#424754]"
                }`}
              >
                Closed
              </button>
            </div>
          </div>

          {/* Ticket List */}
          <div className="overflow-y-auto divide-y divide-[#424754]/60 flex-1 font-heading">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-[#C2C6D6] text-xs">
                No tickets matching current filter.
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isSelected = selectedTicket?._id === ticket._id;
                return (
                  <div
                    key={ticket._id}
                    onClick={() => handleTicketSelect(ticket)}
                    className={`p-4 cursor-pointer transition-colors space-y-2 relative ${
                      isSelected
                        ? "bg-[#272A2C] border-l-4 border-l-[#ADC6FF]"
                        : "hover:bg-[#272A2C]/40 border-l-4 border-l-transparent"
                    }`}
                  >
                    {/* Top row: Category & Ticket # */}
                    <div className="flex justify-between items-center text-[10px]">
                      <span className={`font-bold uppercase tracking-wider ${ticket.categoryColor}`}>
                        {ticket.category}
                      </span>
                      <span className="font-mono text-[#C2C6D6]">
                        {ticket.ticketNumber}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="font-semibold text-sm text-[#E0E3E5] leading-snug">
                      {ticket.title}
                    </div>

                    {/* Snippet */}
                    <p className="text-xs text-[#C2C6D6] line-clamp-2 leading-relaxed m-0">
                      {ticket.snippet}
                    </p>

                    {/* Bottom row: Status & Time */}
                    <div className="flex justify-between items-center pt-1 text-[10px]">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${ticket.statusBadge}`}>
                        {ticket.status}
                      </span>
                      <span className="text-[#C2C6D6] font-mono">
                        {ticket.timeAgo}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: Ticket Details & Communication Log (Col Span 6) */}
        <div className="lg:col-span-6 bg-[#101415] border border-[#424754] rounded-lg flex flex-col overflow-hidden shadow-xl max-h-[880px]">
          {selectedTicket ? (
            <>
              {/* Header Actions Bar */}
              <div className="bg-[#191C1E] border-b border-[#424754] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-heading font-semibold text-xl text-[#E0E3E5] m-0">
                      {selectedTicket.title}
                    </h2>
                    <span className="bg-[#03B5D3] text-[#00424E] font-heading font-bold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded">
                      Ticket {selectedTicket.ticketNumber}
                    </span>
                  </div>
                  <div className="font-heading text-xs text-[#C2C6D6] mt-1.5 flex items-center gap-2">
                    <span className="font-semibold text-[#E0E3E5]">{selectedTicket.student.name}</span>
                    <span>•</span>
                    <span className="font-mono">{selectedTicket.dateFormatted}</span>
                  </div>
                </div>

                {/* Agent Assign & Resolve */}
                <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
                  <div className="text-right">
                    <label className="block font-heading text-[10px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-1">
                      Assign to Agent
                    </label>
                    <select
                      value={agent}
                      onChange={(e) => handleAgentChange(e.target.value)}
                      className="bg-[#1D2022] border border-[#424754] rounded px-3 py-1.5 text-xs text-[#E0E3E5] focus:outline-none focus:border-[#4D8EFF] cursor-pointer"
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Dr. Aminul (Chief Admin)">Dr. Aminul (Chief Admin)</option>
                      <option value="IT Support">IT Support</option>
                      <option value="Registrar">Registrar</option>
                      <option value="Academic Dean">Academic Dean</option>
                    </select>
                  </div>

                  <button
                    onClick={handleResolve}
                    disabled={selectedTicket.status === "RESOLVED"}
                    className={`px-4 py-2.5 rounded font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer border-none shadow-md ${
                      selectedTicket.status === "RESOLVED"
                        ? "bg-[#323537] text-[#C2C6D6] cursor-not-allowed"
                        : "bg-[#ADC6FF] hover:bg-[#8CAEFF] text-[#002E6A] active:scale-95"
                    }`}
                  >
                    <CheckCircle size={15} strokeWidth={2.5} />
                    <span>{selectedTicket.status === "RESOLVED" ? "Resolved" : "Resolve Ticket"}</span>
                  </button>
                </div>
              </div>

              {/* Communication Log Area */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1 font-heading">
                {/* System Banner */}
                <div className="text-center">
                  <span className="px-4 py-1.5 bg-[#1D2022] border border-[#424754] rounded-full text-[11px] text-[#C2C6D6] uppercase tracking-wider inline-block">
                    Ticket created by {selectedTicket.student.name} via Student Portal
                  </span>
                </div>

                {/* Messages Loop */}
                {selectedTicket.messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-4 items-start ${!msg.isStudent ? "flex-row-reverse" : ""}`}>
                    {/* Avatar Icon */}
                    <div
                      className={`w-10 h-10 rounded shrink-0 flex items-center justify-center font-bold text-sm border ${
                        msg.isStudent
                          ? "bg-[#1D2022] border-[#424754] text-[#ADC6FF]"
                          : "bg-[#4D8EFF] border-[#4D8EFF] text-[#002E6A]"
                      }`}
                    >
                      {msg.isStudent ? <User size={18} /> : "AD"}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-lg p-5 flex-1 border ${
                        msg.isStudent
                          ? "bg-[#191C1E] border-[#424754]"
                          : "bg-[#1D2022] border-[#4D8EFF]/40"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-[#E0E3E5]">
                          {msg.sender}
                        </span>
                        <span className="font-mono text-xs text-[#C2C6D6]">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-sm text-[#C2C6D6] leading-relaxed m-0 whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Internal Note (if present) */}
                {selectedTicket.internalNote && (
                  <div className="bg-[#191C1E] border border-[#424754] rounded-lg p-5 border-l-4 border-l-[#4CD7F6] space-y-2 animate-in fade-in">
                    <div className="flex justify-between items-center text-xs uppercase font-bold text-[#4CD7F6] tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Lock size={14} />
                        <span>Internal Note</span>
                      </span>
                      <span className="text-[#C2C6D6] font-mono lowercase font-normal">
                        by {selectedTicket.internalNote.author}
                      </span>
                    </div>
                    <p className="italic text-sm text-[#C2C6D6] leading-relaxed m-0">
                      "{selectedTicket.internalNote.note}"
                    </p>
                  </div>
                )}
              </div>

              {/* Compose Footer Bar */}
              <div className="bg-[#191C1E] border-t border-[#424754] p-6 font-heading">
                {/* Compose Tabs */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveComposeTab("REPLY")}
                    className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-none ${
                      activeComposeTab === "REPLY"
                        ? "bg-[#323537] text-[#E0E3E5]"
                        : "bg-transparent text-[#C2C6D6] hover:text-[#E0E3E5]"
                    }`}
                  >
                    Reply to Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveComposeTab("NOTE")}
                    className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-none flex items-center gap-1.5 ${
                      activeComposeTab === "NOTE"
                        ? "bg-[#323537] text-[#4CD7F6]"
                        : "bg-transparent text-[#C2C6D6] hover:text-[#E0E3E5]"
                    }`}
                  >
                    <Lock size={12} />
                    <span>Add Internal Note</span>
                  </button>
                </div>

                {/* Textarea Input Card */}
                <div className="bg-[#101415] border border-[#424754] rounded-lg p-3.5 flex items-end gap-3 focus-within:border-[#4D8EFF] transition-colors">
                  <textarea
                    value={composeText}
                    onChange={(e) => setComposeText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={
                      activeComposeTab === "REPLY"
                        ? "Type your response to student here (press Enter to send)..."
                        : "Type an internal note for staff members only..."
                    }
                    className="bg-transparent border-none w-full text-sm text-[#E0E3E5] focus:outline-none resize-none h-20 placeholder:text-[#6B7280]"
                  />

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      title="Attach file or screenshot"
                      onClick={() => alert("File attachment dialog opened...")}
                      className="p-2 text-[#C2C6D6] hover:text-[#E0E3E5] hover:bg-[#1D2022] rounded transition-colors cursor-pointer border-none bg-transparent"
                    >
                      <Paperclip size={18} />
                    </button>
                    <button
                      type="button"
                      title="Send Message"
                      onClick={handleSend}
                      disabled={!composeText.trim()}
                      className={`p-2.5 rounded transition-all border-none cursor-pointer flex items-center justify-center shadow-md ${
                        composeText.trim()
                          ? activeComposeTab === "REPLY"
                            ? "bg-[#ADC6FF] hover:bg-[#8CAEFF] text-[#002E6A] active:scale-95"
                            : "bg-[#4CD7F6] hover:bg-[#72E1F8] text-[#003640] active:scale-95"
                          : "bg-[#323537] text-[#6B7280] cursor-not-allowed"
                      }`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-12 text-[#C2C6D6]">
              Select a ticket from the inbox to view details.
            </div>
          )}
        </div>

        {/* COLUMN 3: Student Profile & Audit Log Panel (Col Span 3) */}
        <div className="lg:col-span-3 bg-[#191C1E] border border-[#424754] rounded-lg p-6 flex flex-col justify-between space-y-6 overflow-y-auto shadow-xl max-h-[880px] font-heading">
          {selectedTicket ? (
            <div className="space-y-6">
              {/* Student Profile Card */}
              <div>
                <div className="text-[11px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-4">
                  Student Profile
                </div>
                <div className="flex flex-col items-center text-center pb-6 border-b border-[#424754]/60">
                  <img
                    src={selectedTicket.student.avatar}
                    alt={selectedTicket.student.name}
                    className="w-20 h-20 rounded-lg object-cover border-2 border-[#4D8EFF] mb-3 shadow-md bg-[#1D2022]"
                  />
                  <div className="font-bold text-lg text-[#E0E3E5]">
                    {selectedTicket.student.name}
                  </div>
                  <div className="text-xs text-[#C2C6D6] mt-0.5">
                    {selectedTicket.student.major}
                  </div>
                </div>
              </div>

              {/* Previous Tickets */}
              <div className="bg-[#1D2022] border border-[#424754] rounded p-4 space-y-2.5 text-xs">
                <div className="text-[10px] uppercase font-bold text-[#C2C6D6] tracking-wider mb-3 block">
                  Previous Tickets
                </div>
                {selectedTicket.student.previousTickets.length === 0 ? (
                  <div className="text-[#C2C6D6] italic text-[11px]">No previous tickets recorded.</div>
                ) : (
                  selectedTicket.student.previousTickets.map((t, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-[#424754]/40 pb-2 last:border-0 last:pb-0">
                      <span className="text-[#E0E3E5] font-medium truncate pr-2">{t.title}</span>
                      <span className="font-mono text-[10px] font-bold text-[#4D8EFF]">{t.status}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Audit Log */}
              <div className="bg-[#1D2022] border border-[#424754] rounded p-4 font-mono text-xs text-[#C2C6D6] space-y-2">
                <div className="text-[10px] uppercase font-bold font-heading text-[#C2C6D6] tracking-wider mb-2 block">
                  Audit Log
                </div>
                {selectedTicket.student.auditLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px]">
                    <span className="text-[#4CD7F6] font-semibold shrink-0">{log.time}</span>
                    <span className="text-[#E0E3E5]">{log.event}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-[#C2C6D6] text-xs py-8">
              No profile loaded.
            </div>
          )}

          {/* Bottom Flag Button */}
          <div className="pt-4 border-t border-[#424754]/60">
            <button
              type="button"
              onClick={() => {
                if (confirm(`Flag ticket #${selectedTicket?.ticketNumber} as fraudulent or spam?`)) {
                  alert("Ticket flagged for security audit.");
                }
              }}
              className="w-full py-2.5 bg-[#1D2022] hover:bg-[#93000A]/20 border border-[#93000A]/60 rounded text-[#FFB4AB] font-heading font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <ShieldAlert size={14} />
              <span>Flag as Fraudulent</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComplaintManagement;
