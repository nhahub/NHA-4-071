import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGradeBook } from "../../store/professor/professorThunks";
import { 
  Download, UploadCloud, ChevronDown, Filter, MoreVertical, 
  CheckCircle, Clock, Edit3, Info 
} from "lucide-react";

const GradeManagement = () => {
  const dispatch = useDispatch();
  const { gradeBook, loading } = useSelector((state) => state.professor);

  useEffect(() => {
    dispatch(fetchGradeBook());
  }, [dispatch]);

  if (loading || !gradeBook) {
    return <div className="p-8 text-white font-heading font-bold text-xl flex items-center justify-center h-full">Loading gradebook...</div>;
  }

  const metrics = gradeBook.metrics || {};
  const students = gradeBook.students || [];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-text-primary relative pb-20">
      
      {/* Header */}
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col">
          <h1 className="font-heading font-bold text-[32px] m-0 text-white leading-tight">Grade Management</h1>
          <p className="font-heading text-sm text-text-secondary mt-1">Review, edit, and finalize academic assessments for the current term.</p>
        </div>
        
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent text-text-secondary border border-border rounded text-sm font-bold font-heading cursor-pointer hover:text-white transition-colors">
            <Download size={16} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-bg-page font-bold border-none rounded hover:opacity-90 cursor-pointer transition-opacity">
            <UploadCloud size={18} /> Publish All
          </button>
        </div>
      </div>

      {/* Top Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-bg-light border border-border rounded-xl p-4">
        <div className="flex flex-col gap-1 w-[260px]">
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Select Course</span>
          <div className="flex items-center justify-between px-3 py-2 bg-[#121620] border border-border rounded text-sm text-white cursor-pointer hover:border-primary transition-colors">
            <span>CS402 - Artificial Intelligence</span>
            <ChevronDown size={14} className="text-text-secondary" />
          </div>
        </div>

        <div className="flex flex-col gap-1 w-[220px]">
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Assessment Type</span>
          <div className="flex items-center justify-between px-3 py-2 bg-[#121620] border border-border rounded text-sm text-white cursor-pointer hover:border-primary transition-colors">
            <span>Midterm Examination</span>
            <ChevronDown size={14} className="text-text-secondary" />
          </div>
        </div>

        <div className="flex flex-col gap-1 w-[180px]">
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Section</span>
          <div className="flex items-center justify-between px-3 py-2 bg-[#121620] border border-border rounded text-sm text-white cursor-pointer hover:border-primary transition-colors">
            <span>All Sections</span>
            <ChevronDown size={14} className="text-text-secondary" />
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-[#121620] border border-border text-text-secondary rounded text-sm hover:text-white transition-colors cursor-pointer h-[38px] ml-2">
          <Filter size={16} /> More Filters
        </button>

        <div className="px-4 py-2 bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.3)] rounded text-primary text-sm font-bold ml-auto h-[38px] flex items-center">
          Status: {metrics.publishStatus}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-bg-light rounded-xl p-5 border border-border flex flex-col justify-between">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2">Average Score</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">{metrics.averageScore}</span>
            <span className="text-[11px] text-primary font-bold mb-1">~+2.1%</span>
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-border flex flex-col justify-between">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2">Graded Items</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">{metrics.gradedItems}</span>
            <span className="text-[11px] text-text-secondary mb-1">93% Done</span>
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-border flex flex-col justify-between">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2">Highest Score</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">{metrics.highestScore}</span>
            <span className="text-[11px] text-text-secondary mb-1">{metrics.highestGrade}</span>
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-border flex flex-col justify-between">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2">Publish Status</span>
          <div className="flex flex-col mt-1">
            <span className="text-xs text-text-secondary">Not visible to students</span>
            <span className="text-sm font-bold text-danger uppercase tracking-widest mt-1">{metrics.publishStatus}</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-bg-light border border-border rounded-xl overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-[11px] text-text-secondary font-bold uppercase tracking-wider items-center">
          <div className="col-span-3">Student Name</div>
          <div className="col-span-2">Student ID</div>
          <div className="col-span-1">Section</div>
          <div className="col-span-2 text-center">Score (100)</div>
          <div className="col-span-1 text-center">Grade</div>
          <div className="col-span-2">Feedback / Private Note</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {students.map((student) => (
            <div key={student.id} className="grid grid-cols-12 gap-4 p-4 border-b border-[rgba(255,255,255,0.05)] items-center hover:bg-[rgba(255,255,255,0.02)] transition-colors">
              
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#121620] border border-border flex items-center justify-center text-primary font-bold text-xs">{student.initials}</div>
                <span className="text-white text-sm font-semibold">{student.name}</span>
              </div>
              
              <div className="col-span-2 text-text-secondary text-sm font-mono">{student.studentId}</div>
              <div className="col-span-1 text-text-secondary text-sm pl-2">{student.section}</div>
              
              <div className="col-span-2 flex justify-center">
                <input 
                  type="text" 
                  defaultValue={student.score}
                  className={`w-16 h-8 text-center bg-[#121620] border rounded font-mono font-bold text-sm outline-none transition-colors ${
                    student.score !== '--' ? 'border-primary text-white' : 'border-border text-text-secondary'
                  }`}
                />
              </div>
              
              <div className="col-span-1 flex justify-center">
                {student.grade !== '--' ? (
                  <span className="w-8 h-8 rounded flex items-center justify-center bg-[rgba(52,211,153,0.1)] border border-primary text-primary font-bold text-sm">
                    {student.grade}
                  </span>
                ) : (
                  <span className="text-text-secondary font-bold text-sm">--</span>
                )}
              </div>
              
              <div className="col-span-2">
                <span className={`text-xs italic ${student.feedback.includes('Add') ? 'text-text-muted cursor-text' : 'text-text-secondary'}`}>
                  {student.feedback}
                </span>
              </div>
              
              <div className="col-span-1 flex justify-end">
                <button className="bg-transparent border-none text-text-secondary cursor-pointer hover:text-white">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer */}
        <div className="flex justify-between items-center p-4 text-xs text-text-secondary font-mono">
          <span>Showing 1-{students.length} of 45 students</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center bg-transparent border border-border rounded text-text-secondary cursor-pointer hover:text-white transition-colors">&lt;</button>
            <button className="w-8 h-8 flex items-center justify-center bg-primary border border-primary rounded text-bg-page font-bold cursor-pointer">1</button>
            <button className="w-8 h-8 flex items-center justify-center bg-transparent border border-border rounded text-text-secondary cursor-pointer hover:text-white transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center bg-transparent border border-border rounded text-text-secondary cursor-pointer hover:text-white transition-colors">3</button>
            <button className="w-8 h-8 flex items-center justify-center bg-transparent border border-border rounded text-text-secondary cursor-pointer hover:text-white transition-colors">&gt;</button>
          </div>
        </div>

      </div>

      {/* Bottom Section (Legend + Activity) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Legend */}
        <div className="col-span-2 bg-bg-light border border-border border-dashed rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">
            <Info size={14} /> Grading Legend & Weighting
          </div>
          
          <div className="flex flex-wrap gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <span className="text-white">A (90-100): <span className="text-text-secondary">Excellent</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-text-secondary"></div>
              <span className="text-white">B (80-89): <span className="text-text-secondary">Proficient</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-text-secondary"></div>
              <span className="text-white">C (70-79): <span className="text-text-secondary">Adequate</span></span>
            </div>
          </div>
          
          <div className="text-xs text-text-secondary italic mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
            Current assessment weight: <strong className="text-white">35% of Total Grade</strong>. Grades are saved as drafts until published.
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-1 bg-bg-light border border-border rounded-xl p-5 flex flex-col gap-4">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2">Recent Activity</span>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col relative pl-4 border-l-2 border-[rgba(255,255,255,0.1)]">
              <div className="absolute left-[-2px] top-1 w-[2px] h-3 bg-text-secondary"></div>
              <span className="text-sm text-white">Graded 12 submissions</span>
              <span className="text-xs text-text-secondary mt-1 font-mono">10 minutes ago</span>
            </div>
            
            <div className="flex flex-col relative pl-4 border-l-2 border-[rgba(255,255,255,0.1)]">
              <div className="absolute left-[-2px] top-1 w-[2px] h-3 bg-text-secondary"></div>
              <span className="text-sm text-white">Exported Section A data</span>
              <span className="text-xs text-text-secondary mt-1 font-mono">2 hours ago</span>
            </div>
            
            <div className="flex flex-col relative pl-4 border-l-2 border-[rgba(255,255,255,0.1)]">
              <div className="absolute left-[-2px] top-1 w-[2px] h-3 bg-primary"></div>
              <span className="text-sm text-white">Modified rubric criteria</span>
              <span className="text-xs text-text-secondary mt-1 font-mono">Yesterday, 4:30 PM</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default GradeManagement;
