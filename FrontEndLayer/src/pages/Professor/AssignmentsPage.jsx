
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGlobalAssignments } from "../../store/professor/professorThunks";
import {
  Plus, Calendar, Clock, Users, CheckCircle, Search,
  Filter, Download, Edit3, Paperclip, Eye, AlertCircle, Save
} from "lucide-react";

const AssignmentsPage = () => {
  const dispatch = useDispatch();
  const { assignments, loading } = useSelector((state) => state.professor);

  const [activeTab, setActiveTab] = useState('All Assignments');
  const tabs = ['All Assignments', 'Active', 'Drafts', 'Archived'];

  useEffect(() => {
    dispatch(fetchGlobalAssignments());
  }, [dispatch]);

  if (loading || !assignments) {
    return <div className="p-8 text-white font-heading font-bold text-xl flex items-center justify-center h-full">Loading assignments...</div>;
  }

  const metrics = assignments.metrics || {};
  const list = assignments.list || [];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-text-primary relative pb-20">

      {/* Header */}
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col">
          <h1 className="font-heading font-bold text-[32px] m-0 text-white leading-tight">Global Assignments</h1>
          <p className="font-heading text-sm text-text-secondary mt-1">Manage and review all student submissions across your active courses.</p>
        </div>

        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-bg-page font-bold border-none rounded hover:opacity-90 cursor-pointer transition-opacity shadow-lg shadow-[rgba(52,211,153,0.2)]">
          <Plus size={18} /> Create New Assignment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-bg-light rounded-xl p-5 border border-primary relative overflow-hidden flex flex-col justify-between">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2 relative z-10">Pending Grading</span>
          <span className="text-4xl font-bold text-primary relative z-10 block mb-4">{metrics.pending}</span>
          <div className="w-1/2 h-1 bg-[rgba(52,211,153,0.3)] rounded-full relative z-10">
            <div className="w-2/3 h-full bg-primary rounded-full"></div>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
            <ClipboardListIcon size={100} />
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-border relative overflow-hidden flex flex-col justify-between">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2 relative z-10">Active Deadlines</span>
          <span className="text-4xl font-bold text-primary relative z-10 block mb-2">0{metrics.activeDeadlines}</span>
          <span className="text-[11px] text-text-secondary relative z-10 flex items-center gap-1">
            <span className="text-primary">Next:</span> Today, 11:59 PM
          </span>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
            <Clock size={100} />
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-border relative overflow-hidden flex flex-col justify-between">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2 relative z-10">Total Students</span>
          <span className="text-4xl font-bold text-white relative z-10 block mb-2">{metrics.totalStudents}</span>
          <span className="text-[11px] text-text-secondary relative z-10">Across 6 Courses</span>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
            <Users size={100} />
          </div>
        </div>

        <div className="bg-bg-light rounded-xl p-5 border border-border relative overflow-hidden flex flex-col justify-between">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2 relative z-10">Completion Rate</span>
          <span className="text-4xl font-bold text-white relative z-10 block mb-2">{metrics.completionRate}</span>
          <span className="text-[11px] text-text-secondary relative z-10 flex items-center gap-1">
            <span className="text-primary">↑ 2.1%</span> from last term
          </span>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
            <CheckCircle size={100} />
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border pb-4 mt-2">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`bg-transparent border-none cursor-pointer pb-4 -mb-4 font-heading font-bold text-sm transition-colors ${activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-white'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <select className="bg-bg-light border border-border text-text-secondary text-sm rounded px-3 py-2 w-48 outline-none">
            <option>All Courses</option>
            <option>CS-402: Neural Networks</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-border text-text-secondary rounded text-sm hover:text-white transition-colors cursor-pointer">
            <Filter size={16} /> More Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-border text-text-secondary rounded text-sm hover:text-white transition-colors cursor-pointer">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 py-3 px-2 border-b border-border text-[11px] text-text-secondary font-bold uppercase tracking-wider items-center mb-2">
          <div className="col-span-4">Assignment Details</div>
          <div className="col-span-2">Course</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-2">Grading Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Rows */}
        {list.map((assignment, idx) => (
          <div key={assignment.id} className="grid grid-cols-12 gap-4 p-4 mb-3 bg-bg-light border border-border rounded-lg items-center relative overflow-hidden group">

            {/* Active row indicator */}
            {idx === 1 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}

            <div className="col-span-4 flex flex-col gap-1 pl-2">
              <span className="font-bold text-white text-[15px]">{assignment.title}</span>
              <span className="text-xs text-text-secondary flex items-center gap-1.5">
                {assignment.attachment.includes('.pdf') ? <Paperclip size={12} /> : null}
                <span className={assignment.attachment.includes('Overdue') ? 'text-danger italic' : ''}>{assignment.attachment}</span>
              </span>
            </div>

            <div className="col-span-2 flex flex-col gap-1 items-start">
              <span className="px-2 py-0.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded text-[10px] font-mono text-primary font-bold">
                {assignment.courseId}
              </span>
              <span className="text-xs text-text-secondary">{assignment.courseName}</span>
            </div>

            <div className="col-span-2 flex flex-col gap-1">
              <span className="text-sm text-white flex items-center gap-1.5">
                <Calendar size={14} className="text-text-secondary" /> {assignment.dueDate}
              </span>
              {assignment.dueIn && (
                <span className={`text-[10px] font-bold uppercase tracking-wider ${assignment.dueIn.includes('Past') ? 'text-text-secondary opacity-50' : 'text-danger'}`}>
                  {assignment.dueIn}
                </span>
              )}
            </div>

            <div className="col-span-2 flex flex-col gap-1.5">
              <div className="flex justify-between items-end">
                <div className="flex items-baseline gap-1 text-xs">
                  {assignment.percentage === 100 ? (
                    <span className="text-primary font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 bg-[rgba(52,211,153,0.1)] rounded-full border border-primary">Completed</span>
                  ) : assignment.percentage === 0 ? (
                    <span className="text-text-secondary font-bold uppercase text-[10px] tracking-wider">Not Started</span>
                  ) : (
                    <>
                      <span className="text-white font-bold">{assignment.graded}</span>
                      <span className="text-text-secondary">/ {assignment.total}</span>
                    </>
                  )}
                </div>
                {assignment.percentage > 0 && assignment.percentage < 100 && (
                  <span className="text-[10px] text-text-secondary">{assignment.percentage}%</span>
                )}
                {assignment.percentage === 0 && (
                  <span className="text-[10px] text-text-secondary">0 / {assignment.total}</span>
                )}
                {assignment.percentage === 100 && (
                  <span className="text-[10px] text-text-secondary">{assignment.graded} / {assignment.total}</span>
                )}
              </div>
              <div className="w-full bg-[#121620] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${assignment.percentage === 100 ? 'bg-primary' : assignment.percentage > 40 ? 'bg-primary' : 'bg-danger'}`}
                  style={{ width: `${assignment.percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="col-span-2 flex justify-end items-center gap-4">
              <button className="bg-transparent border-none text-text-secondary hover:text-white cursor-pointer transition-colors">
                {assignment.status === 'report' ? <Eye size={16} /> : <Edit3 size={16} />}
              </button>

              {assignment.status === 'grade' && (
                <button className="bg-primary text-bg-page font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded cursor-pointer border-none hover:opacity-90">Grade</button>
              )}
              {assignment.status === 'report' && (
                <button className="bg-transparent border border-border text-text-secondary font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded cursor-pointer hover:border-text-secondary hover:text-white">Report</button>
              )}
              {assignment.status === 'priority' && (
                <button className="bg-danger text-white font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded cursor-pointer border-none hover:opacity-90">Priority</button>
              )}
              {assignment.status === 'manage' && (
                <button className="bg-transparent border border-border text-text-secondary font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded cursor-pointer hover:border-text-secondary hover:text-white">Manage</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-2 text-xs text-text-secondary font-mono">
        <span>Showing 1 to {list.length} of 48 assignments</span>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center bg-transparent border border-border rounded text-text-secondary cursor-pointer hover:text-white transition-colors">&lt;</button>
          <button className="w-8 h-8 flex items-center justify-center bg-primary border border-primary rounded text-bg-page font-bold cursor-pointer">1</button>
          <button className="w-8 h-8 flex items-center justify-center bg-transparent border border-border rounded text-text-secondary cursor-pointer hover:text-white transition-colors">2</button>
          <button className="w-8 h-8 flex items-center justify-center bg-transparent border border-border rounded text-text-secondary cursor-pointer hover:text-white transition-colors">3</button>
          <button className="w-8 h-8 flex items-center justify-center bg-transparent border border-border rounded text-text-secondary cursor-pointer hover:text-white transition-colors">&gt;</button>
        </div>
      </div>

      {/* Floating Button */}
      <button className="absolute bottom-0 right-0 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-bg-page cursor-pointer border-none shadow-[0_4px_20px_rgba(52,211,153,0.3)] hover:opacity-90 transition-opacity">
        <Save size={20} />
      </button>

=======
import {useEffect, useState} from "react";
      import {useProfessor} from "../../hooks/useProfessor";
      import PageHeader from "../../shared/components/PageHeader";
      import LoadingSkeleton from "../../shared/components/LoadingSkeleton";
      import {Plus, FileText} from "lucide-react";

      const btnPrimary = "flex flex-row items-center px-4 py-[9px] gap-2 bg-primary shadow-sm rounded-lg border-none text-white font-body font-normal text-base leading-normal cursor-pointer hover:opacity-90";

const AssignmentsPage = () => {
  const {offerings, assignments, loading, error, loadOfferings, loadAssignments, createAssignment} = useProfessor();
      const [selectedOffering, setSelectedOffering] = useState("");
      const [showForm, setShowForm] = useState(false);
      const [newAssignment, setNewAssignment] = useState({title: "", description: "", dueDate: "", totalPoints: "" });

  useEffect(() => {
        loadOfferings();
  }, [loadOfferings]);

  useEffect(() => {
    if (offerings && offerings.length > 0 && !selectedOffering) {
        setSelectedOffering(offerings[0]._id);
    }
  }, [offerings, selectedOffering]);

  useEffect(() => {
    if (selectedOffering) {
        loadAssignments(selectedOffering);
      setShowForm(false);
    }
  }, [selectedOffering, loadAssignments]);

  const handleCreate = async (e) => {
        e.preventDefault();
      if (!selectedOffering) return;

      await createAssignment({
        offeringId: selectedOffering,
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate,
      totalPoints: Number(newAssignment.totalPoints)
    });

      setShowForm(false);
      setNewAssignment({title: "", description: "", dueDate: "", totalPoints: "" });
  };

      return (
      <div className="flex flex-col gap-[44px] max-w-[960px] mx-auto">
        <PageHeader
          title="Assignments"
          subtitle="Manage assignments and create new ones for your courses."
        >
          <button className={btnPrimary} onClick={() => setShowForm(!showForm)}>
            <Plus size={16} />
            {showForm ? "Cancel" : "Create Assignment"}
          </button>
        </PageHeader>

        {error && (
          <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger font-heading text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <label className="font-heading font-semibold text-text-primary">Select Course Offering:</label>
          <select
            className="px-4 py-2 border border-border rounded-lg font-body text-base outline-none min-w-[200px]"
            value={selectedOffering}
            onChange={(e) => setSelectedOffering(e.target.value)}
          >
            {offerings?.map(o => (
              <option key={o._id} value={o._id}>{o.courseId?.name || "Course"} - {o.schedule}</option>
            ))}
          </select>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="flex flex-col gap-4 p-6 bg-white border border-border rounded-xl shadow-sm">
            <h3 className="font-heading font-semibold text-lg text-text-primary m-0">Create New Assignment</h3>
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className="font-heading text-sm font-semibold">Title</label>
                <input required type="text" className="px-3 py-2 border border-border rounded-lg outline-none font-body" value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="font-heading text-sm font-semibold">Due Date</label>
                <input required type="date" className="px-3 py-2 border border-border rounded-lg outline-none font-body" value={newAssignment.dueDate} onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="font-heading text-sm font-semibold">Total Points</label>
                <input required type="number" className="px-3 py-2 border border-border rounded-lg outline-none font-body" value={newAssignment.totalPoints} onChange={(e) => setNewAssignment({ ...newAssignment, totalPoints: e.target.value })} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-heading text-sm font-semibold">Description</label>
              <textarea required rows="3" className="px-3 py-2 border border-border rounded-lg outline-none font-body" value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} />
            </div>
            <div className="flex justify-end mt-2">
              <button type="submit" className={btnPrimary}>Save Assignment</button>
            </div>
          </form>
        )}

        <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
          {loading && !assignments?.length ? (
            <LoadingSkeleton type="table" count={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border bg-bg-light">
                    <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                      Title
                    </th>
                    <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                      Due Date
                    </th>
                    <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                      Points
                    </th>
                    <th className="text-left px-8 py-4 font-heading font-semibold text-xs tracking-wider uppercase text-text-secondary">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!assignments || assignments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-8 text-center font-heading text-text-muted">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileText size={32} className="text-text-muted opacity-50" />
                          <span>No assignments found for this offering.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    assignments.map((assign, i) => (
                      <tr key={assign._id} className={i > 0 ? "border-t border-border hover:bg-gray-50" : "hover:bg-gray-50"}>
                        <td className="px-8 py-[18.5px]">
                          <div className="flex flex-col">
                            <span className="font-heading font-bold text-base text-text-primary">
                              {assign.title}
                            </span>
                            <span className="font-body font-normal text-sm text-text-secondary">
                              {assign.description?.substring(0, 50) || "No description"}...
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4 font-body font-normal text-base text-text-primary">
                          {new Date(assign.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-4 font-heading font-normal text-base text-text-primary">
                          {assign.totalPoints}
                        </td>
                        <td className="px-8 py-4 font-heading font-normal text-base text-text-primary">
                          <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-semibold">Active</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
>>>>>>> de3871c4c1963791cfa8cd922b32bab3ec2c33cc
      </div>
  );
};

<<<<<<< HEAD
  // SVG Icon Helper
  const ClipboardListIcon = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <path d="M12 11h4"></path>
      <path d="M12 16h4"></path>
      <path d="M8 11h.01"></path>
      <path d="M8 16h.01"></path>
    </svg>
  );

=======
>>>>>>> de3871c4c1963791cfa8cd922b32bab3ec2c33cc
  export default AssignmentsPage;
