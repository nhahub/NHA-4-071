import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProfessorProfile, getMyOfferings, submitStudentGrade,
  getProfessorDashboard, getProfessorNotifications,
  getProfessorGradesOverview, getProfessorPerformance,
  getProfessorSchedule, getOfferingStudents, createAssignment,
  getAssignments, getAttendanceRecords,
} from '../../services/professorService';

export const fetchProfessorProfile = createAsyncThunk(
  'professor/fetchProfile', async (_, { rejectWithValue }) => {
    const result = await getProfessorProfile();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchMyOfferings = createAsyncThunk(
  'professor/fetchOfferings', async (_, { rejectWithValue }) => {
    const result = await getMyOfferings();
    if (!result.success) return rejectWithValue(result.error);
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
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchNotifications = createAsyncThunk(
  'professor/fetchNotifications', async (_, { rejectWithValue }) => {
    const result = await getProfessorNotifications();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchGradeBook = createAsyncThunk(
  'professor/fetchGradeBook', async (_, { rejectWithValue }) => {
    const result = await getProfessorGradesOverview();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchPerformanceAnalytics = createAsyncThunk(
  'professor/fetchPerformance', async (_, { rejectWithValue }) => {
    const result = await getProfessorPerformance();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchSchedule = createAsyncThunk(
  'professor/fetchSchedule', async (_, { rejectWithValue }) => {
    const result = await getProfessorSchedule();
    if (!result.success) return rejectWithValue(result.error);
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
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchGlobalAssignments = createAsyncThunk(
  'professor/fetchAssignments', async (_, { rejectWithValue }) => {
    try {
      const offeringsResult = await getMyOfferings();
      if (!offeringsResult.success) return rejectWithValue(offeringsResult.error);
      const offerings = offeringsResult.data || [];
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
      return { list: allAssignments };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAttendanceRecords = createAsyncThunk(
  'professor/fetchAttendance', async (_, { rejectWithValue }) => {
    try {
      const offeringsResult = await getMyOfferings();
      if (!offeringsResult.success) return rejectWithValue(offeringsResult.error);
      const offerings = offeringsResult.data || [];
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
      return { students };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
