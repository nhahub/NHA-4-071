import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardOverview } from "../../store/professor/professorThunks";
import { 
  Download, Plus, Clock, AlertTriangle, Calendar, FileText,
  MessageSquare, MoreVertical, CheckCircle, Search
} from "lucide-react";
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, Cell
} from "recharts";

const ProfessorDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.professor);

  useEffect(() => {
    dispatch(fetchDashboardOverview());
  }, [dispatch]);

  if (loading || !dashboard) {
    return <div className="p-8 text-white font-heading font-bold text-xl flex items-center justify-center h-full">Loading dashboard...</div>;
  }

  const { metrics, agenda, currentCourses, recentActivity, performanceChart } = dashboard;

  const getAgendaIcon = (action) => {
    if (action.includes("Roll Call")) return <CheckCircle size={14} />;
    if (action.includes("Join")) return <Search size={14} />;
    return <FileText size={14} />;
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case "assignment": return <FileText size={14} className="text-primary" />;
      case "message": return <MessageSquare size={14} className="text-primary" />;
      case "alert": return <AlertTriangle size={14} className="text-danger" />;
      case "system": return <Clock size={14} className="text-text-secondary" />;
      default: return <FileText size={14} />;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-text-primary relative pb-20">
      
      {/* Header */}
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col">
          <h1 className="font-heading font-bold text-[32px] m-0 text-white leading-tight">Dashboard Overview</h1>
          <p className="font-heading text-sm text-text-secondary mt-1">Welcome back, Dr. Morshed. Here is what's happening in your classes today.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent text-text-secondary border border-border rounded text-sm font-bold font-heading cursor-pointer hover:text-white transition-colors">
            <Download size={16} /> Export Report
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-[#064E3B] text-primary border border-primary font-bold rounded hover:bg-primary hover:text-bg-page cursor-pointer transition-colors shadow-[0_0_15px_rgba(52,211,153,0.15)]">
            <Plus size={18} /> New Announcement
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-bg-light rounded-xl p-5 border border-primary flex flex-col justify-between relative overflow-hidden">
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-2">Total Students</span>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-white">{metrics.totalStudents}</span>
            <span className="text-xs text-primary font-bold mb-1">{metrics.studentsTrend}</span>
          </div>
          <div className="w-full h-1 bg-[rgba(52,211,153,0.2)] rounded-full mt-2">
            <div className="w-2/3 h-full bg-primary rounded-full"></div>
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-primary flex flex-col justify-between relative overflow-hidden">
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-2">Avg. Attendance</span>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-white">{metrics.avgAttendance}</span>
            <span className="text-xs text-primary font-bold mb-1">{metrics.attendanceTrend}</span>
          </div>
          <div className="w-full h-1 bg-[rgba(52,211,153,0.2)] rounded-full mt-2">
            <div className="w-[92.4%] h-full bg-primary rounded-full"></div>
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-border flex flex-col justify-between relative overflow-hidden">
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-2">Pending Grades</span>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-white">{metrics.pendingGrades}</span>
            <span className="text-[10px] text-text-secondary flex items-center gap-1 mb-1.5">
              <Clock size={10} /> Due soon
            </span>
          </div>
          <div className="w-full h-1 bg-[#121620] rounded-full mt-2">
            <div className="w-1/3 h-full bg-text-secondary rounded-full"></div>
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-[rgba(248,113,113,0.3)] flex flex-col justify-between relative overflow-hidden">
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-2">Academic Alerts</span>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-white">0{metrics.academicAlerts}</span>
            <span className="text-[10px] text-danger font-bold mb-1.5">Urgent</span>
          </div>
          <div className="w-full h-1 bg-[rgba(248,113,113,0.1)] rounded-full mt-2">
            <div className="w-1/2 h-full bg-danger rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Today's Agenda */}
          <div className="bg-bg-light border border-border rounded-xl flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-[rgba(255,255,255,0.05)]">
              <h3 className="font-heading font-bold text-base text-white m-0 flex items-center gap-2">
                <Calendar size={16} className="text-primary" /> Today's Agenda
              </h3>
              <span className="text-[10px] text-primary font-mono font-bold tracking-wider">Monday, Sep 18</span>
            </div>
            
            <div className="flex flex-col">
              {agenda.map((item, idx) => (
                <div key={item.id} className={`flex items-start justify-between p-5 ${idx !== agenda.length - 1 ? 'border-b border-[rgba(255,255,255,0.05)]' : ''}`}>
                  <div className="flex gap-5">
                    <div className="text-[10px] text-text-secondary font-mono font-bold leading-relaxed whitespace-pre-line text-right w-16 pt-1">
                      {item.time}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[15px] font-bold text-white">{item.course}</span>
                      <div className="flex items-center gap-4 text-[11px] text-text-secondary">
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full border border-text-secondary"></span> {item.location}</span>
                        {item.students && <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-text-secondary rounded-sm"></span> {item.students} Students</span>}
                      </div>
                    </div>
                  </div>
                  <button className={`px-4 py-2 rounded text-[11px] font-bold border-none cursor-pointer transition-colors flex items-center gap-1 mt-1 ${
                    item.type === 'primary' ? 'bg-[#064E3B] text-primary hover:bg-primary hover:text-bg-page' : 'bg-[#121620] text-text-secondary hover:text-white'
                  }`}>
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Current Courses */}
          <div className="flex flex-col gap-4 mt-2">
            <h3 className="font-heading font-bold text-base text-white m-0 flex items-center gap-2">
              <span className="grid grid-cols-2 gap-[2px] w-3.5 h-3.5"><span className="bg-primary rounded-[1px]"></span><span className="bg-primary opacity-50 rounded-[1px]"></span><span className="bg-primary opacity-50 rounded-[1px]"></span><span className="bg-primary rounded-[1px]"></span></span> Current Courses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCourses.map(course => (
                <div key={course.id} className="bg-bg-light border border-primary rounded-xl overflow-hidden flex flex-col h-[180px] relative">
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[rgba(52,211,153,0.1)] to-transparent pointer-events-none"></div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-end z-10">
                    <h4 className="text-lg font-bold text-white m-0 mb-1">{course.name}</h4>
                    <span className="text-[9px] text-primary font-bold uppercase tracking-wider">{course.details}</span>
                  </div>
                  
                  <div className="p-5 pt-0 mt-auto z-10">
                    <div className="flex justify-between text-[10px] text-text-secondary mb-2 font-bold">
                      <span>Syllabus Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#121620] rounded-full mb-4">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded text-xs text-text-secondary font-bold py-2 cursor-pointer hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-colors">Course Materials</button>
                      <button className="w-8 flex items-center justify-center bg-transparent border border-[rgba(255,255,255,0.08)] rounded text-text-secondary cursor-pointer hover:text-white transition-colors"><MoreVertical size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Recent Activity */}
          <div className="bg-bg-light border border-border rounded-xl flex flex-col">
            <h3 className="font-heading font-bold text-base text-white p-5 border-b border-[rgba(255,255,255,0.05)] m-0 flex items-center gap-2">
              <span className="text-primary text-xl leading-none font-normal">⚡</span> Recent Activity
            </h3>
            
            <div className="flex flex-col p-5 gap-6">
              {recentActivity.map((activity, idx) => (
                <div key={activity.id} className="flex gap-4 relative">
                  {idx !== recentActivity.length - 1 && <div className="absolute left-[13px] top-7 bottom-[-24px] w-[1px] bg-[rgba(255,255,255,0.1)]"></div>}
                  <div className="w-7 h-7 rounded-full bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.2)] flex items-center justify-center flex-shrink-0 z-10">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex flex-col gap-1 pt-0.5">
                    <span className="text-[13px] text-white leading-tight font-bold">
                      {activity.text} {activity.type === 'assignment' && <span className="text-primary font-normal block mt-1">{activity.subtext}</span>}
                    </span>
                    {activity.type !== 'assignment' && <span className="text-[11px] text-text-secondary">{activity.subtext}</span>}
                    <div className="flex items-center gap-1.5 text-[10px] text-text-secondary mt-1 font-mono uppercase tracking-wider">
                      {activity.count && <span>{activity.count} new files • </span>}
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-5 pt-0">
              <button className="w-full bg-transparent border border-border rounded text-xs text-text-secondary font-bold py-2.5 cursor-pointer hover:border-text-secondary hover:text-white transition-colors">
                View All Activity
              </button>
            </div>
          </div>

          {/* Class Performance */}
          <div className="bg-bg-light border border-border rounded-xl flex flex-col p-6">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider mb-6">Class Performance</span>
            
            <div className="h-32 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceChart} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8B949E', fontWeight: 'bold' }} dy={10} />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                    {performanceChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === performanceChart.length - 1 ? '#34D399' : 'rgba(255,255,255,0.15)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <p className="text-[11px] text-text-secondary italic m-0 leading-relaxed pt-5 border-t border-[rgba(255,255,255,0.05)] mt-2">
              Overall class performance has increased by 12% following the midterm review sessions.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfessorDashboard;
