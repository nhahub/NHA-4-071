import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPerformanceAnalytics } from "../../store/professor/professorThunks";
import { 
  Filter, Download, AlertTriangle, CheckCircle, BarChart2, 
  Mail, Calendar, Eye, Lightbulb, Plus
} from "lucide-react";
import { 
  LineChart, Line, ResponsiveContainer 
} from "recharts";

const StudentPerformance = () => {
  const dispatch = useDispatch();
  const { performance, loading, error } = useSelector((state) => state.professor);

  useEffect(() => {
    dispatch(fetchPerformanceAnalytics());
  }, [dispatch]);

  if (error) {
    return <div className="p-8 text-danger font-heading font-bold text-xl flex items-center justify-center h-full">{error}</div>;
  }

  if (loading || !performance) {
    return <div className="p-8 text-white font-heading font-bold text-xl flex items-center justify-center h-full">Loading performance data...</div>;
  }

  const metrics = performance.metrics || {};
  const students = performance.students || performance.priorityList || [];
  const engagementData = performance.engagementData || performance.engagementChart || [];

  const getRiskIcon = (iconStr) => {
    switch(iconStr) {
      case 'mail': return <Mail size={16} />;
      case 'calendar': return <Calendar size={16} />;
      case 'eye': return <Eye size={16} />;
      default: return <Mail size={16} />;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-text-primary relative pb-20">
      
      {/* Header */}
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col">
          <h1 className="font-heading font-bold text-[32px] m-0 text-white leading-tight">Student Performance Analytics</h1>
          <p className="font-heading text-sm text-text-secondary mt-1">Fall Semester 2024 • Advanced UI Architecture (Group A)</p>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => alert("Filter options opened")} className="flex items-center gap-2 px-4 py-2 bg-[#121620] text-text-secondary border border-border rounded text-sm font-bold font-heading cursor-pointer hover:text-white transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button onClick={() => alert("Performance report exported")} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-bg-page font-bold border-none rounded hover:opacity-90 cursor-pointer transition-opacity">
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-bg-light rounded-xl p-5 border border-border flex flex-col justify-between relative overflow-hidden">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2 relative z-10">Class Average GPA</span>
          <div className="flex items-end gap-2 relative z-10">
            <span className="text-3xl font-bold text-white block mb-2">{metrics.gpa}</span>
            <span className="text-sm font-bold text-primary mb-3">+0.4</span>
          </div>
          <div className="w-1/2 h-1.5 bg-[#121620] rounded-full relative z-10">
            <div className="w-[80%] h-full bg-primary rounded-full"></div>
          </div>
          <div className="absolute right-3 top-5 opacity-20"><BarChart2 size={40} /></div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-border flex flex-col justify-between relative overflow-hidden">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2 relative z-10">Attendance Rate</span>
            <span className="text-3xl font-bold text-white block mb-2 relative z-10">{metrics.attendance}</span>
          <div className="w-1/2 h-1.5 bg-[#121620] rounded-full relative z-10">
            <div className="w-[94.8%] h-full bg-primary rounded-full"></div>
          </div>
          <div className="absolute right-3 top-5 opacity-20"><CheckCircle size={40} /></div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-border flex flex-col justify-between relative overflow-hidden">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2 relative z-10">At-Risk Students</span>
          <div className="flex items-end gap-2 relative z-10 mb-1">
            <span className="text-3xl font-bold text-danger">0{metrics.atRisk}</span>
            <span className="text-sm font-bold text-text-secondary mb-1">/ 42 Total</span>
          </div>
          <span className="text-[11px] text-text-secondary relative z-10 max-w-[120px] leading-snug">
            2 critical intervention required
          </span>
          <div className="absolute right-3 top-5 opacity-20 text-danger"><AlertTriangle size={40} /></div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-border flex flex-col justify-between relative overflow-hidden">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2 relative z-10">Submission Velocity</span>
            <span className="text-3xl font-bold text-white block mb-2 relative z-10">{metrics.velocity || "92%"}</span>
            <span className="text-[11px] text-primary relative z-10">92% On-time delivery</span>
          <div className="absolute right-3 top-5 opacity-20 text-primary"><CheckCircle size={40} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Priority List */}
        <div className="lg:col-span-2 bg-bg-light border border-border rounded-xl p-0 flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-[rgba(255,255,255,0.05)]">
            <h3 className="font-heading font-bold text-lg text-white m-0">Intervention Priority List</h3>
            <span className="text-xs text-text-secondary font-mono">Updated 2m ago</span>
          </div>
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[rgba(255,255,255,0.05)] text-[10px] text-text-secondary font-bold uppercase tracking-wider items-center">
            <div className="col-span-4">Student Name</div>
            <div className="col-span-2">Engagement</div>
            <div className="col-span-3">Midterm</div>
            <div className="col-span-2">Risk Level</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col">
            {students.map((student) => (
              <div key={student._id || student.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[rgba(255,255,255,0.05)] items-center hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#121620] border border-[rgba(255,255,255,0.05)] flex items-center justify-center text-text-secondary font-bold text-xs opacity-50"></div>
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-bold">{student.name}</span>
                    <span className="text-xs text-text-secondary">{student.studentId}</span>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <span className={`text-sm font-bold ${parseInt(student.engagement) < 50 ? 'text-danger' : 'text-primary'}`}>
                    {student.engagement}
                  </span>
                </div>
                
                <div className="col-span-3 flex flex-col">
                  <span className="text-sm font-bold text-white">{student.midterm}</span>
                  <span className="text-xs text-text-secondary">{student.score}</span>
                </div>
                
                <div className="col-span-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    student.risk === 'CRITICAL' ? 'bg-danger text-white' : 
                    student.risk === 'WARNING' ? 'bg-[#ca8a04] text-white' : 
                    'bg-[rgba(52,211,153,0.2)] text-primary'
                  }`}>
                    {student.risk}
                  </span>
                </div>
                
                <div className="col-span-1 flex justify-center text-primary">
                  <button onClick={() => alert(`Student: ${student.name}\nRisk: ${student.risk}\nEngagement: ${student.engagement}`)} className="bg-transparent border-none text-primary cursor-pointer hover:text-white transition-colors">
                    {getRiskIcon(student.iconType || student.icon)}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 flex justify-center border-t border-[rgba(255,255,255,0.05)]">
            <button onClick={() => alert("Loading all students...")} className="bg-transparent border-none text-primary font-bold text-sm cursor-pointer hover:text-white transition-colors">
              View All 42 Students
            </button>
          </div>
        </div>

        {/* Right Column: Grade Distribution */}
        <div className="lg:col-span-1 bg-bg-light border border-border rounded-xl p-6 flex flex-col">
          <h3 className="font-heading font-bold text-lg text-white m-0 mb-6">Grade Distribution</h3>
          
          {/* Grade Distribution Chart */}
          <div className="flex-1 flex flex-col justify-end gap-2 px-2 min-h-[200px] mb-6">
            <div className="flex items-end justify-between h-full w-full gap-2">
              <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                <div className="w-full bg-[#121620] rounded-t-sm" style={{ height: '15%' }}></div>
                <span className="text-[10px] text-text-secondary font-bold">F</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                <div className="w-full bg-[#121620] rounded-t-sm" style={{ height: '20%' }}></div>
                <span className="text-[10px] text-text-secondary font-bold">D</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                <div className="w-full bg-[#121620] rounded-t-sm" style={{ height: '40%' }}></div>
                <span className="text-[10px] text-text-secondary font-bold">C</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                <div className="w-full bg-[#121620] rounded-t-sm" style={{ height: '65%' }}></div>
                <span className="text-[10px] text-text-secondary font-bold">B</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                <div className="w-full bg-[rgba(52,211,153,0.3)] border-t-2 border-primary rounded-t-sm" style={{ height: '35%' }}></div>
                <span className="text-[10px] text-white font-bold">A</span>
              </div>
            </div>
          </div>
          
          {/* Insight Box */}
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-lg p-4 flex gap-3 mb-4">
            <Lightbulb size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white mb-1">Insight</span>
              <p className="text-[11px] text-text-secondary leading-relaxed m-0">
                Most students struggle with "Asynchronous Design Patterns" module.
              </p>
            </div>
          </div>
          
          <button onClick={() => alert("Module analysis view opened")} className="w-full bg-transparent border border-border text-text-secondary hover:text-white hover:border-text-secondary font-bold text-sm py-2.5 rounded cursor-pointer transition-colors mt-auto">
            Deep Dive Into Modules
          </button>
        </div>
      </div>

      {/* Class Engagement Line Chart */}
      <div className="bg-bg-light border border-border rounded-xl p-6 relative overflow-hidden mt-2">
        <h3 className="font-heading font-bold text-lg text-white m-0 mb-1">Class Engagement over Semester</h3>
        <p className="text-xs text-text-secondary mb-6 m-0 max-w-md">
          Dynamic visualization of student platform interaction and participation peaks. Interaction increases by 45% before deadline windows.
        </p>
        
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#34D399" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#161B22', stroke: '#34D399', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#34D399', stroke: '#161B22', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 right-6 flex items-center gap-4 text-xs font-bold text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-text-secondary"></div> Average Progress
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div> Current Batch
          </div>
        </div>
      </div>

      {/* Floating Save/Add Button */}
      <button onClick={() => alert("Add new performance note")} className="absolute bottom-0 right-0 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-bg-page cursor-pointer border-none shadow-[0_4px_20px_rgba(52,211,153,0.3)] hover:opacity-90 transition-opacity">
        <Plus size={20} />
      </button>

    </div>
  );
};

export default StudentPerformance;
