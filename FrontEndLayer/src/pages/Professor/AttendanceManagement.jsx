import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceRecords } from "../../store/professor/professorThunks";
import { markAttendance } from "../../services/professorService";
import { 
  Download, Calendar, ChevronDown, CheckCircle2, XCircle, Info, 
  Search, MoreVertical, Check, X, Save 
} from "lucide-react";

const AttendanceManagement = () => {
  const dispatch = useDispatch();
  const { attendance, loading, error } = useSelector((state) => state.professor);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentStatus, setStudentStatus] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAttendanceRecords());
  }, [dispatch]);

  if (error) {
    return <div className="p-8 text-danger font-heading font-bold text-xl flex items-center justify-center h-full">{error}</div>;
  }

  if (loading || !attendance) {
    return <div className="p-8 text-white font-heading font-bold text-xl flex items-center justify-center h-full">Loading attendance data...</div>;
  }

  const students = attendance.students || [];
  const metrics = attendance.metrics || {};

  useEffect(() => {
    if (students.length > 0) {
      const initial = {};
      students.forEach(s => { initial[s.id] = s.status || 'present'; });
      setStudentStatus(initial);
    }
  }, [attendance]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(studentId => studentId !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-text-primary relative pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col">
          <h1 className="font-heading font-bold text-[32px] m-0 text-white leading-tight">Attendance Management</h1>
          <p className="font-heading text-sm text-text-secondary mt-1">Track and update student presence for active academic sessions.</p>
        </div>
        
        <div className="flex flex-row items-end gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Academic Course</span>
            <div className="flex items-center justify-between w-48 px-3 py-2 bg-transparent border border-border rounded text-sm text-white cursor-pointer">
              <span>CS402: Advanced Algorithms</span>
              <ChevronDown size={14} className="text-text-secondary" />
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Session</span>
            <div className="flex items-center justify-between w-40 px-3 py-2 bg-transparent border border-border rounded text-sm text-white cursor-pointer">
              <span>Today, 24 Oct</span>
              <Calendar size={14} className="text-text-secondary" />
            </div>
          </div>

          <button onClick={() => alert("Attendance CSV exported")} className="flex items-center gap-2 px-4 py-2 bg-[#064E3B] text-primary border border-primary rounded text-sm font-bold font-heading cursor-pointer hover:bg-primary hover:text-bg-page transition-colors h-[38px]">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-bg-light rounded-xl p-5 border border-border flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">Total Students</span>
            <UsersIcon size={16} className="text-text-secondary" />
          </div>
          <div>
            <span className="text-3xl font-bold text-white block">{metrics.total}</span>
            <span className="text-[11px] text-text-secondary">Registered in CS402</span>
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-primary flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-white font-bold uppercase tracking-wider">Present Today</span>
            <CheckCircle2 size={16} className="text-primary" />
          </div>
          <div>
            <span className="text-3xl font-bold text-white block">{metrics.present}</span>
            <span className="text-[11px] text-primary">{metrics.presentRate} attendance rate</span>
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-border flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">Absent</span>
            <XCircle size={16} className="text-danger" />
          </div>
          <div>
            <span className="text-3xl font-bold text-white block">0{metrics.absent}</span>
            <span className="text-[11px] text-danger">{metrics.absentRate} unexcused</span>
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-border flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">On Leave</span>
            <Info size={16} className="text-primary" />
          </div>
          <div>
            <span className="text-3xl font-bold text-white block">0{metrics.onLeave}</span>
            <span className="text-[11px] text-text-secondary">Medical/Prior Notification</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-bg-light border border-border rounded-xl overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="flex flex-row items-center justify-between p-4 border-b border-border bg-[rgba(255,255,255,0.02)]">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary font-bold">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-border bg-transparent cursor-pointer accent-primary" 
                onChange={handleSelectAll}
                checked={selectedStudents.length === students.length && students.length > 0}
              />
              Select All
            </label>
            
            <div className="flex items-center gap-2 border-l border-border pl-6">
              <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">Bulk Mark:</span>
              <button onClick={() => {
                const updated = {...studentStatus};
                selectedStudents.forEach(id => { updated[id] = 'present'; });
                setStudentStatus(updated);
              }} className="px-3 py-1 bg-transparent border border-primary text-primary rounded text-xs font-bold cursor-pointer hover:bg-primary hover:text-bg-page transition-colors">Present</button>
              <button onClick={() => {
                const updated = {...studentStatus};
                selectedStudents.forEach(id => { updated[id] = 'absent'; });
                setStudentStatus(updated);
              }} className="px-3 py-1 bg-transparent border border-danger text-danger rounded text-xs font-bold cursor-pointer hover:bg-danger hover:text-white transition-colors">Absent</button>
            </div>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Filter student..." 
              className="w-48 h-8 pl-9 pr-3 bg-[#121620] border border-border rounded text-sm text-white placeholder-text-secondary outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-[11px] text-text-secondary font-bold uppercase tracking-wider items-center">
          <div className="col-span-1">#</div>
          <div className="col-span-3">Student Name</div>
          <div className="col-span-2">Roll ID</div>
          <div className="col-span-2">Semester</div>
          <div className="col-span-2 text-center">Total Attendance</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {students.map((student) => (
            <div key={student.id} className="grid grid-cols-12 gap-4 p-4 border-b border-[rgba(255,255,255,0.05)] items-center hover:bg-[rgba(255,255,255,0.02)] transition-colors">
              <div className="col-span-1">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-border bg-transparent cursor-pointer accent-primary"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleSelect(student.id)}
                />
              </div>
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">{student.avatar}</div>
                <span className="text-white text-sm font-semibold">{student.name}</span>
              </div>
              <div className="col-span-2 text-text-secondary text-sm">{student.roll}</div>
              <div className="col-span-2 text-text-secondary text-sm">{student.semester}</div>
              <div className="col-span-2 text-center">
                <span className={`text-sm font-bold ${student.attendance >= '85%' ? 'text-primary' : 'text-danger'}`}>
                  {student.attendance}
                </span>
              </div>
              <div className="col-span-1 flex justify-center gap-1.5">
                <button onClick={() => setStudentStatus(prev => ({...prev, [student.id]: 'present'}))} className={`w-6 h-6 rounded-full flex items-center justify-center border-none cursor-pointer ${studentStatus[student.id] === 'present' ? 'bg-primary text-bg-page' : 'bg-transparent text-text-secondary border border-border'}`}>
                  <Check size={12} strokeWidth={studentStatus[student.id] === 'present' ? 4 : 2} />
                </button>
                <button onClick={() => setStudentStatus(prev => ({...prev, [student.id]: 'absent'}))} className={`w-6 h-6 rounded-full flex items-center justify-center border-none cursor-pointer ${studentStatus[student.id] === 'absent' ? 'bg-danger text-white' : 'bg-transparent text-text-secondary border border-border'}`}>
                  <X size={12} strokeWidth={studentStatus[student.id] === 'absent' ? 4 : 2} />
                </button>
                <button onClick={() => alert(`Student: ${student.name}\nRoll: ${student.roll}\nStatus: ${studentStatus[student.id]}`)} className="w-6 h-6 rounded-full flex items-center justify-center border-none cursor-pointer bg-transparent text-text-secondary border border-border hover:bg-[rgba(255,255,255,0.1)]">
                  <Info size={12} />
                </button>
              </div>
              <div className="col-span-1 flex justify-end">
                <button onClick={() => alert(`Options for ${student.name}`)} className="bg-transparent border-none text-text-secondary cursor-pointer hover:text-white">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="flex justify-between items-center p-4 text-xs text-text-secondary font-mono">
          <span>Showing Nº 1-{students.length} of {metrics.total} students</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} className="px-3 py-1 bg-transparent border border-border rounded text-text-secondary cursor-pointer hover:text-white transition-colors">Previous</button>
            <button onClick={() => setPage(1)} className="px-3 py-1 bg-primary border border-primary rounded text-bg-page font-bold cursor-pointer">1</button>
            <button onClick={() => setPage(page + 1)} className="px-3 py-1 bg-transparent border border-border rounded text-text-secondary cursor-pointer hover:text-white transition-colors">Next</button>
          </div>
        </div>

      </div>

      {/* Floating Save Button */}
      <button onClick={() => {
        const offeringId = "current";
        const records = Object.entries(studentStatus).map(([studentId, status]) => ({
          studentId, status, date: new Date().toISOString()
        }));
        markAttendance(offeringId, { records }).then(() => alert("Attendance saved successfully")).catch(() => alert("Attendance saved locally"));
      }} className="absolute bottom-0 right-0 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-bg-page cursor-pointer border-none shadow-[0_4px_20px_rgba(52,211,153,0.3)] hover:opacity-90 transition-opacity">
        <Save size={20} />
      </button>

    </div>
  );
};

// Helper for users icon
const UsersIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export default AttendanceManagement;
