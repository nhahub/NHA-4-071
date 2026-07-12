import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfessorCourses } from "../../store/professor/professorThunks";
import { Users, Clock, Filter, Plus, User, FileText, BellRing, BarChart2, MoreVertical, PlusCircle } from "lucide-react";

const MyCoursesPage = () => {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.professor);

  useEffect(() => {
    dispatch(fetchProfessorCourses());
  }, [dispatch]);

  if (loading || !courses) {
    return <div className="p-8 text-white font-heading font-bold text-xl flex items-center justify-center h-full">Loading courses data...</div>;
  }

  const featuredCourse = courses?.find(c => c.type === 'featured');
  const regularCourses = courses?.filter(c => c.type === 'regular') || [];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-text-primary">
      {/* Header section */}
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col">
          <h1 className="font-heading font-bold text-[32px] m-0 text-white leading-tight">Teaching Overview</h1>
          <p className="font-heading text-sm text-text-secondary mt-1">Managing {courses.length} active courses for Spring Semester 2024</p>
        </div>
        <div className="flex flex-row gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-border rounded text-sm font-heading hover:bg-[rgba(255,255,255,0.05)] cursor-pointer text-white transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-bg-page font-bold border-none rounded text-sm font-heading hover:opacity-90 cursor-pointer transition-opacity">
            <Plus size={16} /> New Course
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Course */}
        {featuredCourse && (
          <div className="col-span-1 lg:col-span-2 bg-bg-light rounded-xl border border-primary relative overflow-hidden flex flex-col justify-between p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="px-2 py-1 bg-[rgba(52,211,153,0.1)] text-primary rounded text-xs font-mono font-bold">{featuredCourse.id}</div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-bg-light flex items-center justify-center text-[10px] text-white">S1</div>
                <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-bg-light flex items-center justify-center text-[10px] text-white">S2</div>
                <div className="w-8 h-8 rounded-full bg-border border-2 border-bg-light flex items-center justify-center text-[10px] text-white">+{featuredCourse.students - 2}</div>
              </div>
            </div>
            
            <h2 className="font-heading font-bold text-2xl text-white m-0 mb-6">{featuredCourse.name}</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-[#121620] rounded-lg p-4 flex flex-col gap-1">
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Students</span>
                <span className="text-2xl font-bold text-white">{featuredCourse.students}</span>
              </div>
              <div className="bg-[#121620] rounded-lg p-4 flex flex-col gap-1">
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Avg. Grade</span>
                <span className="text-2xl font-bold text-primary">{featuredCourse.avgGrade || '--'}</span>
              </div>
              <div className="bg-[#121620] rounded-lg p-4 flex flex-col gap-1">
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Pending Tasks</span>
                <span className="text-2xl font-bold text-danger">{featuredCourse.pendingTasks || '--'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <div className="flex justify-between text-xs text-text-secondary font-bold">
                <span>Syllabus Progress</span>
                <span>{featuredCourse.progress}%</span>
              </div>
              <div className="w-full bg-[#121620] h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${featuredCourse.progress}%` }}></div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-auto">
              <button className="bg-transparent text-text-secondary font-bold text-sm border-none cursor-pointer hover:text-white transition-colors">
                View Student Roster
              </button>
              <button className="bg-primary text-bg-page font-bold text-sm px-6 py-2.5 rounded cursor-pointer border-none hover:opacity-90 transition-opacity">
                Grade Assignments
              </button>
            </div>
          </div>
        )}

        {/* Regular Courses */}
        {regularCourses.map((course) => (
          <div key={course.id} className="col-span-1 bg-bg-light rounded-xl border border-border p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="px-2 py-1 bg-border text-text-primary rounded text-xs font-mono font-bold">{course.id}</div>
              <button className="bg-transparent border-none text-text-secondary cursor-pointer hover:text-white"><MoreVertical size={16} /></button>
            </div>
            
            <h3 className="font-heading font-bold text-lg text-white m-0 mb-4">{course.name}</h3>
            
            <div className="flex flex-col gap-3 mb-6 flex-1">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Users size={16} /> <span>{course.students} Enrolled Students</span>
              </div>
              {course.schedule && (
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Clock size={16} /> <span>{course.schedule}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <div className="flex justify-between text-[10px] text-text-secondary font-bold uppercase">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-[#121620] h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
            </div>

            <button className="w-full bg-transparent border border-border text-text-secondary hover:text-white hover:border-text-secondary font-bold text-sm py-2.5 rounded cursor-pointer transition-colors">
              Open Dashboard
            </button>
          </div>
        ))}

        {/* Archive Course */}
        <div className="col-span-1 border border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors min-h-[260px]">
          <div className="w-12 h-12 rounded-full bg-[#121620] flex items-center justify-center text-text-secondary mb-4">
            <PlusCircle size={24} />
          </div>
          <h3 className="font-heading font-bold text-lg text-white m-0 mb-2">Archive Course</h3>
          <p className="text-xs text-text-secondary m-0 leading-relaxed max-w-[200px]">
            Import materials from previous semesters to quickly set up a new course rail.
          </p>
        </div>
      </div>

      {/* Bottom Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2">
        <div className="bg-bg-light rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-primary">
            <User size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-secondary font-bold tracking-wider uppercase mb-1">Total Students</span>
            <span className="text-xl font-bold text-white">364</span>
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-[rgba(52,211,153,0.1)] flex items-center justify-center text-primary">
            <FileText size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-secondary font-bold tracking-wider uppercase mb-1">Assignments</span>
            <span className="text-xl font-bold text-white">24 Active</span>
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-[rgba(248,113,113,0.1)] flex items-center justify-center text-danger">
            <BellRing size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-secondary font-bold tracking-wider uppercase mb-1">Critical Alerts</span>
            <span className="text-xl font-bold text-white">3 Due Soon</span>
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-primary">
            <BarChart2 size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-secondary font-bold tracking-wider uppercase mb-1">Teaching Hours</span>
            <span className="text-xl font-bold text-white">18 hrs/wk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;
