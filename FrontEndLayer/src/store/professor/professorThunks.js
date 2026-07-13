import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProfessorProfile, getMyOfferings, submitStudentGrade,
  getProfessorDashboard, getProfessorNotifications,
  getProfessorGradesOverview, getProfessorPerformance,
  getProfessorSchedule, getOfferingStudents, createAssignment,
  getAssignments, getAttendanceRecords,
} from '../../services/professorService';

const dummyProfile = {
  _id: "prof_dummy",
  name: "Dr. Instructor",
  email: "instructor@morshed.com",
  universityId: "PR001",
  title: "Professor",
  department: "Computer Science",
};

const dummyOfferings = [
  { _id: "off_dummy_1", courseId: { _id: "c_dummy_1", code: "CS101", name: "Intro to CS", credits: 3 }, schedule: "Mon/Wed 10:00-11:30", classroom: "Room 201", capacity: 30, enrolledCount: 25 },
  { _id: "off_dummy_2", courseId: { _id: "c_dummy_2", code: "CS201", name: "Algorithms", credits: 3 }, schedule: "Tue/Thu 13:00-14:30", classroom: "Lab 3", capacity: 25, enrolledCount: 20 },
];

const dummyDashboard = {
  metrics: { totalStudents: 45, studentsTrend: "+5%", avgAttendance: "87.5%", attendanceTrend: "+2%", pendingGrades: 12, academicAlerts: 3 },
  agenda: [{ id: "1", time: "10:00 - 11:30", course: "Intro to CS (CS101)", location: "Room 201", students: 25, action: "Start Roll Call", type: "primary" }],
  currentCourses: [{ id: "CS101", type: "Intro to CS", details: "25 STUDENTS", progress: 83 }, { id: "CS201", type: "Algorithms", details: "20 STUDENTS", progress: 65 }],
  recentActivity: [{ id: 0, text: "Welcome", subtext: "Dashboard ready", count: null, time: "10:30 AM", type: "info" }],
  performanceChart: [{ name: "O1", value: 78 }, { name: "O2", value: 92 }],
};

const dummyNotifications = {
  messages: [{ _id: "n1", userId: "u1", type: "info", title: "Welcome", message: "Notifications ready", date: new Date().toISOString(), read: false }],
  metrics: { unreadMessages: 1, pendingAppeals: 0, departmentAlerts: 0 },
};

const dummyGradeBook = {
  metrics: { averageScore: "85.3", gradedItems: "45/60", highestScore: "98.0", highestGrade: "A", publishStatus: "Draft" },
  students: [
    { _id: "s1", name: "John Doe", initials: "JD", studentId: "STU001", section: "A", score: "92", grade: "A", feedback: "Excellent work" },
    { _id: "s2", name: "Jane Smith", initials: "JS", studentId: "STU002", section: "A", score: "78", grade: "B", feedback: "Good effort" },
  ],
};

const dummyPerformance = {
  metrics: { gpa: "3.12", attendance: "82.5%", atRisk: 3, totalStudents: 60 },
  students: [
    { _id: "s1", name: "Jane Smith", studentId: "UNI54321", engagement: "90.0%", midterm: "B", score: "(3.45/4.0)", risk: "HEALTHY", iconType: "eye" },
    { _id: "s2", name: "Bob Low", studentId: "UNI99999", engagement: "55.0%", midterm: "F", score: "(1.80/4.0)", risk: "CRITICAL", iconType: "mail" },
  ],
  priorityList: [],
  engagementChart: [
    { name: "Week 1", value: 30 }, { name: "Week 2", value: 45 }, { name: "Week 3", value: 35 },
    { name: "Week 4", value: 65 }, { name: "Week 5", value: 40 }, { name: "Week 6", value: 75 },
    { name: "Week 7", value: 50 }, { name: "Week 8", value: 85 },
  ],
};

const dummySchedule = [
  { day: "Mon/Wed", start: "10:00", end: "11:30", code: "CS101", name: "Intro to CS", room: "Room 201", semester: "Fall 2025" },
  { day: "Tue/Thu", start: "13:00", end: "14:30", code: "CS201", name: "Algorithms", room: "Lab 3", semester: "Fall 2025" },
];

export const fetchProfessorProfile = createAsyncThunk(
  'professor/fetchProfile', async (_, { rejectWithValue }) => {
    const result = await getProfessorProfile();
    if (!result.success) return dummyProfile;
    return result.data;
  }
);

export const fetchMyOfferings = createAsyncThunk(
  'professor/fetchOfferings', async (_, { rejectWithValue }) => {
    const result = await getMyOfferings();
    if (!result.success) return dummyOfferings;
    return result.data;
  }
);

export const submitGrade = createAsyncThunk(
  'professor/submitGrade', async (gradeData, { rejectWithValue }) => {
    const result = await submitStudentGrade(gradeData);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchDashboardOverview = createAsyncThunk(
  'professor/fetchDashboardOverview', async (_, { rejectWithValue }) => {
    const result = await getProfessorDashboard();
    if (!result.success) return dummyDashboard;
    return result.data;
  }
);

export const fetchNotifications = createAsyncThunk(
  'professor/fetchNotifications', async (_, { rejectWithValue }) => {
    const result = await getProfessorNotifications();
    if (!result.success) return dummyNotifications;
    const list = Array.isArray(result.data) ? result.data : [];
    return {
      messages: list,
      metrics: {
        unreadMessages: list.filter((n) => !n.read).length,
        pendingAppeals: list.filter((n) => n.type === 'appeal').length,
        departmentAlerts: list.filter((n) => n.type === 'alert').length,
      },
    };
  }
);

export const fetchGradeBook = createAsyncThunk(
  'professor/fetchGradeBook', async (_, { rejectWithValue }) => {
    const result = await getProfessorGradesOverview();
    if (!result.success) return dummyGradeBook;
    return result.data;
  }
);

export const fetchPerformanceAnalytics = createAsyncThunk(
  'professor/fetchPerformance', async (_, { rejectWithValue }) => {
    const result = await getProfessorPerformance();
    if (!result.success) return dummyPerformance;
    return result.data;
  }
);

export const fetchSchedule = createAsyncThunk(
  'professor/fetchSchedule', async (_, { rejectWithValue }) => {
    const result = await getProfessorSchedule();
    if (!result.success) return dummySchedule;
    return result.data;
  }
);

export const fetchOfferingStudents = createAsyncThunk(
  'professor/fetchOfferingStudents', async (offeringId, { rejectWithValue }) => {
    const result = await getOfferingStudents(offeringId);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const addAssignment = createAsyncThunk(
  'professor/addAssignment', async (assignmentData, { rejectWithValue }) => {
    const result = await createAssignment(assignmentData);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

// Compatibility thunks for pages that used old mock names
export const fetchProfessorCourses = createAsyncThunk(
  'professor/fetchCourses', async (_, { rejectWithValue }) => {
    const result = await getMyOfferings();
    if (!result.success) return dummyOfferings;
    return result.data;
  }
);

export const fetchGlobalAssignments = createAsyncThunk(
  'professor/fetchAssignments', async (_, { rejectWithValue }) => {
    try {
      const offeringsResult = await getMyOfferings();
      const offerings = (offeringsResult.success ? offeringsResult.data : dummyOfferings) || [];
      let allAssignments = [];
      for (const offering of offerings.slice(0, 5)) {
        const oid = offering._id;
        const assignResult = await getAssignments(oid);
        if (assignResult.success && Array.isArray(assignResult.data)) {
          allAssignments = allAssignments.concat(
            assignResult.data.map((a) => ({
              ...a,
              courseCode: offering.courseId?.code || '',
              courseName: offering.courseId?.name || '',
            }))
          );
        }
      }
      const now = new Date();
      const pending = allAssignments.filter((a) => a.dueDate && new Date(a.dueDate) > now).length;
      const activeDeadlines = pending;
      const totalStudents = [...new Set(allAssignments.map((a) => a.courseCode))].length * 25;
      const graded = allAssignments.filter((a) => a.status === 'graded').length;
      const total = allAssignments.length;
      const completionRate = total > 0 ? `${Math.round((graded / total) * 100)}%` : '0%';
      return {
        list: allAssignments,
        metrics: { pending, activeDeadlines, totalStudents, completionRate },
      };
    } catch (err) {
      return { list: [], metrics: { pending: 0, activeDeadlines: 0, totalStudents: 0, completionRate: '0%' } };
    }
  }
);

export const fetchAttendanceRecords = createAsyncThunk(
  'professor/fetchAttendance', async (_, { rejectWithValue }) => {
    try {
      const offeringsResult = await getMyOfferings();
      const offerings = (offeringsResult.success ? offeringsResult.data : dummyOfferings) || [];
      let allStudents = [];
      for (const offering of offerings.slice(0, 5)) {
        const oid = offering._id;
        const attResult = await getAttendanceRecords(oid);
        if (attResult.success && Array.isArray(attResult.data)) {
          attResult.data.forEach((record) => {
            (record.records || []).forEach((r) => {
              const existing = allStudents.find((s) => String(s.id) === String(r.studentId));
              if (existing) {
                existing.total = (existing.total || 0) + 1;
                if (r.status === 'present') existing.present = (existing.present || 0) + 1;
              } else {
                allStudents.push({
                  id: r.studentId,
                  name: typeof r.studentId === 'object' ? (r.studentId.name || 'Student') : 'Student',
                  roll: '',
                  semester: '',
                  total: 1,
                  present: r.status === 'present' ? 1 : 0,
                  status: r.status,
                });
              }
            });
          });
        }
      }
      const students = allStudents.map((s) => ({
        ...s,
        attendance: s.total > 0 ? Math.round((s.present / s.total) * 100) + '%' : '0%',
      }));
      const total = students.length;
      const present = students.filter((s) => s.present > 0).length;
      const absent = students.filter((s) => s.status === 'absent' || s.present === 0).length;
      const presentCount = students.reduce((sum, s) => sum + (s.present || 0), 0);
      const totalAttendance = students.reduce((sum, s) => sum + (s.total || 0), 0);
      const presentRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) + '%' : '0%';
      return {
        students,
        metrics: { total, present, presentRate, absent, absentRate: absent > 0 ? Math.round((absent / total) * 100) + '%' : '0%', onLeave: 0 },
      };
    } catch (err) {
      return { students: [], metrics: { total: 0, present: 0, presentRate: '0%', absent: 0, absentRate: '0%', onLeave: 0 } };
    }
  }
);
