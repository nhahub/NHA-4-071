import { fetchService } from './genericFetchService';
import { GradeRequestSchema } from '../Schemas/RequestSchemas/gradeSchemas';
import { AssignmentRequestSchema } from '../Schemas/RequestSchemas/assignmentSchemas';
import { ProfessorProfileSchema } from '../Schemas/ResponseSchemas/professorResponseSchema';
import { CourseOfferingsResponseSchema } from '../Schemas/ResponseSchemas/offeringResponseSchema';

export const getProfessorProfile = () =>
  fetchService('/professors/profile', { method: 'GET' }, ProfessorProfileSchema);

export const getMyOfferings = () =>
  fetchService('/professors/offerings', { method: 'GET' }, CourseOfferingsResponseSchema);

export const submitStudentGrade = (gradeData) => {
  const payload = GradeRequestSchema.parse(gradeData);
  return fetchService('/professors/grades', { method: 'POST', data: payload });
};

export const getAssignments = (offeringId) =>
  fetchService(`/professors/offerings/${offeringId}/assignments`, { method: 'GET' });

export const createAssignment = (data) => {
  const payload = AssignmentRequestSchema.parse(data);
  return fetchService('/professors/assignments', { method: 'POST', data: payload });
};

// ==========================================
// MOCK SERVICES FOR PROFESSOR UI INTEGRATION
// ==========================================

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMockProfessorCourses = async () => {
  await delay(800);
  return {
    success: true,
    data: [
      { id: 'CS-401', name: 'Advanced Artificial Intelligence', students: 128, avgGrade: '3.8', pendingTasks: 12, progress: 75, type: 'featured', schedule: null },
      { id: 'MAT-202', name: 'Discrete Mathematics II', students: 84, avgGrade: null, pendingTasks: null, progress: 40, type: 'regular', schedule: 'Mon/Wed 10:30 AM' },
      { id: 'ENG-101', name: 'Technical Writing', students: 45, avgGrade: null, pendingTasks: null, progress: 92, type: 'regular', schedule: 'Tue/Thu 02:00 PM' },
      { id: 'CS-302', name: 'System Architecture', students: 62, avgGrade: null, pendingTasks: null, progress: 15, type: 'regular', schedule: 'Friday 09:00 AM' }
    ]
  };
};

export const getMockAttendanceRecords = async () => {
  await delay(800);
  return {
    success: true,
    data: {
      students: [
        { id: 1, name: "Ethan Caldwell", roll: "CS2023-001", semester: "7th", attendance: "92%", status: "present", avatar: "E" },
        { id: 2, name: "Amara Smith", roll: "CS2023-014", semester: "7th", attendance: "78%", status: "absent", avatar: "A" },
        { id: 3, name: "Marcus Li", roll: "CS2023-009", semester: "7th", attendance: "85%", status: "present", avatar: "M" },
      ]
    }
  };
};

export const getMockGlobalAssignments = async () => {
  await delay(800);
  return {
    success: true,
    data: {
      list: [
        { id: 1, title: "Midterm Project: Backpropagation", attachment: "Project_Brief_v2.pdf", courseId: "CS-402", courseName: "Neural Networks", dueDate: "Oct 24, 2023", dueIn: "IN 2 DAYS", graded: 82, total: 120, percentage: 68, status: "grade" },
        { id: 2, title: "Lab 4: Data Normalization", attachment: "Auto-graded Quiz", courseId: "DS-101", courseName: "Data Fundamentals", dueDate: "Oct 28, 2023", dueIn: "", graded: 45, total: 45, percentage: 100, status: "report" },
        { id: 3, title: "Final Thesis: Part A - Research Proposal", attachment: "Grading Overdue", courseId: "CS-500", courseName: "Senior Thesis", dueDate: "Oct 15, 2023", dueIn: "Past Deadline", graded: 15, total: 30, percentage: 50, status: "priority" },
        { id: 4, title: "Weekly Essay: AI in Healthcare", attachment: "Pending Start", courseId: "DS-305", courseName: "Data Ethics", dueDate: "Nov 02, 2023", dueIn: "", graded: 0, total: 85, percentage: 0, status: "manage" }
      ]
    }
  };
};

export const getMockGradeBook = async () => {
  await delay(800);
  return {
    success: true,
    data: {
      metrics: { publishStatus: 'Draft' }, // Needed for publishStatus UI fallback
      students: [
        { id: 1, name: "Jameson, David", initials: "JD", studentId: "2023-AI-014", section: "A", score: "92", grade: "A", feedback: "Add a comment..." },
        { id: 2, name: "Saito, Chihiro", initials: "SC", studentId: "2023-AI-089", section: "A", score: "88", grade: "A-", feedback: "Excellent depth in analysis." },
        { id: 3, name: "Martinez, Lucas", initials: "ML", studentId: "2023-AI-042", section: "B", score: "--", grade: "--", feedback: "Missed submission deadline." },
        { id: 4, name: "Elena, Volkov", initials: "EV", studentId: "2023-AI-112", section: "A", score: "76", grade: "B", feedback: "Add a comment..." },
      ]
    }
  };
};

export const getMockPerformanceAnalytics = async () => {
  await delay(800);
  return {
    success: true,
    data: {
      metrics: { gpa: '3.42', attendance: '94.8%' }, // Not calculable from priorityList alone
      priorityList: [
        { id: 1, name: "Jonas Miller", studentId: "ID: 2024-0492", engagement: "24%", midterm: "D", score: "(58/100)", risk: "CRITICAL", iconType: "mail" },
        { id: 2, name: "Sara Velasquez", studentId: "ID: 2024-0112", engagement: "12%", midterm: "F", score: "(34/100)", risk: "CRITICAL", iconType: "mail" },
        { id: 3, name: "Liam Henderson", studentId: "ID: 2024-0988", engagement: "62%", midterm: "C-", score: "(72/100)", risk: "WARNING", iconType: "calendar" },
        { id: 4, name: "Kevin Zhao", studentId: "ID: 2024-0455", engagement: "98%", midterm: "A", score: "(96/100)", risk: "HEALTHY", iconType: "eye" },
      ],
      engagementChart: [
        { name: 'Week 1', value: 30 }, { name: 'Week 2', value: 45 }, { name: 'Week 3', value: 35 }, { name: 'Week 4', value: 65 }, { name: 'Week 5', value: 40 },
        { name: 'Week 6', value: 75 }, { name: 'Week 7', value: 50 }, { name: 'Week 8', value: 85 }, { name: 'Week 9', value: 55 }, { name: 'Week 10', value: 20 },
      ]
    }
  };
};

export const getMockNotifications = async () => {
  await delay(800);
  return {
    success: true,
    data: {
      messages: [
        { id: 1, type: "Student Message", sender: "Alex Rivers", time: "2m ago", snippet: '"Professor, regarding the CS-301 mid-term project, I\'m having trouble with the..."', subject: "Project Clarification Request", date: "Oct 24, 2023 - 10:42 AM", course: "CS-301: ADVANCED DATA STRUCTURES", initials: "AR", color: "bg-[#064e3b] text-[#34d399]", content: ["Dear Professor Morshed,", "I hope this message finds you well. I am writing to seek clarification regarding the memory optimization requirements for the Final Project in Advanced Data Structures (CS-301).", "The rubric mentions a strict heap limit for the AVL Tree implementation. Could you please confirm if this includes the overhead for the visualization library we were instructed to use, or is it strictly for the node structures themselves?", "I've attached a draft of my current architecture for your review if you have a moment.", "Best regards,\nAlex Rivers\nID: 2021-00432"], attachment: { name: "rivers_project_draft.pdf", size: "2.4 MB", type: "PDF Document" } },
        { id: 2, type: "Department", sender: "Faculty Meeting", time: "1h ago", snippet: "The monthly board meeting has been moved to Conference Room B on Friday.", subject: "Room Change: Monthly Faculty Board Meeting", date: "Oct 24, 2023 - 09:15 AM", course: "ADMINISTRATIVE", initials: "FM", color: "bg-[#1e1b4b] text-[#818cf8]", content: ["Colleagues,", "Please be advised that the monthly faculty board meeting location has been changed to Conference Room B."] },
        { id: 3, type: "System", sender: "Late Submission", time: "3h ago", snippet: "12 students in Advanced Algorithms have missed the Lab 04 deadline.", subject: "Automated Alert: Deadline Passed", date: "Oct 24, 2023 - 08:00 AM", course: "CS-402: ADVANCED ALGORITHMS", initials: "SYS", color: "bg-[#450a0a] text-[#f87171]", content: ["System Alert:", "12 students have not submitted Lab 04."] },
        { id: 4, type: "Student Message", sender: "Sarah Jenkins", time: "Yesterday", snippet: '"Would it be possible to schedule a 1-on-1 review of my thesis draft?"', subject: "Thesis Review Request", date: "Oct 23, 2023 - 04:30 PM", course: "CS-500: SENIOR THESIS", initials: "SJ", color: "bg-[#064e3b] text-[#34d399]", content: ["Hi Professor, can we meet?"] }
      ]
    }
  };
};

export const getMockSchedule = async () => {
  await delay(600);
  return {
    success: true,
    data: [
      { _id: 'off-1', courseId: { name: 'Advanced Artificial Intelligence', code: 'CS-401' }, classroom: 'Hall A-201', schedule: 'Sun-Tue 10:00-11:30' },
      { _id: 'off-2', courseId: { name: 'Discrete Mathematics II', code: 'MAT-202' }, classroom: 'Lab B-105', schedule: 'Mon-Wed 12:00-13:30' },
      { _id: 'off-3', courseId: { name: 'Technical Writing', code: 'ENG-101' }, classroom: 'Hall A-103', schedule: 'Tue-Thu 10:00-11:30' },
    ]
  };
};

export const getMockDashboardOverview = async () => {
  await delay(800);
  return {
    success: true,
    data: {
      metrics: {
        totalStudents: "1,284",
        studentsTrend: "+3%",
        avgAttendance: "92.4%",
        attendanceTrend: "-0%",
        pendingGrades: 42,
        academicAlerts: 8
      },
      agenda: [
        { id: 1, time: "09:00 AM\n10:30 AM", course: "Advanced Algorithms (CS402)", location: "Hall B-12", students: 124, action: "Start Roll Call", type: "primary" },
        { id: 2, time: "01:00 PM\n02:30 PM", course: "Research Methodology (RM101)", location: "Virtual - Zoom", students: 45, action: "Join Session", type: "secondary" },
        { id: 3, time: "03:00 PM\n04:00 PM", course: "Faculty Board Meeting", location: "Discussion on Semester Curriculum Review", students: null, action: "Admin Task", type: "secondary" }
      ],
      currentCourses: [
        { id: "CS-402", name: "Data Structures", details: "SECTION A • 120 STUDENTS", progress: 65 },
        { id: "ML-501", name: "Machine Learning", details: "GRADUATE • 32 STUDENTS", progress: 42 }
      ],
      recentActivity: [
        { id: 1, text: "New assignment submission:", subtext: "\"Final Project Draft\"", count: 24, time: "12 mins ago", type: "assignment" },
        { id: 2, text: "New message in CS402 Group Discussion", subtext: "Sarah Jenkins", count: null, time: "45 mins ago", type: "message" },
        { id: 3, text: "Academic Alert: Attendance dropped below 70%", subtext: "Marcus Thorne", count: null, time: "2 hours ago", type: "alert" },
        { id: 4, text: "Grades published for \"Quiz 3\"", subtext: "System", count: null, time: "5 hours ago", type: "system" }
      ],
      performanceChart: [
        { name: 'W1', value: 40 },
        { name: 'W2', value: 55 },
        { name: 'W3', value: 45 },
        { name: 'W4', value: 70 },
        { name: 'Now', value: 85 }
      ]
    }
  };
};
