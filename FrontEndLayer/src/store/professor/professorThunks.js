import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getProfessorProfile, getMyOfferings, submitStudentGrade,
  getMockProfessorCourses, getMockAttendanceRecords, getMockGlobalAssignments,
  getMockGradeBook, getMockPerformanceAnalytics, getMockNotifications, getMockDashboardOverview, getMockSchedule
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

// ==========================================
// MOCK THUNKS FOR PROFESSOR UI INTEGRATION
// ==========================================

export const fetchProfessorCourses = createAsyncThunk('professor/fetchCourses', async (_, { rejectWithValue }) => {
  try {
    const result = await getMockProfessorCourses();
    return result.data;
  } catch (error) { return rejectWithValue(error.message); }
});

export const fetchAttendanceRecords = createAsyncThunk('professor/fetchAttendance', async (_, { rejectWithValue }) => {
  try {
    const result = await getMockAttendanceRecords();
    return result.data;
  } catch (error) { return rejectWithValue(error.message); }
});

export const fetchGlobalAssignments = createAsyncThunk('professor/fetchAssignments', async (_, { rejectWithValue }) => {
  try {
    const result = await getMockGlobalAssignments();
    return result.data;
  } catch (error) { return rejectWithValue(error.message); }
});

export const fetchGradeBook = createAsyncThunk('professor/fetchGradeBook', async (_, { rejectWithValue }) => {
  try {
    const result = await getMockGradeBook();
    return result.data;
  } catch (error) { return rejectWithValue(error.message); }
});

export const fetchPerformanceAnalytics = createAsyncThunk('professor/fetchPerformance', async (_, { rejectWithValue }) => {
  try {
    const result = await getMockPerformanceAnalytics();
    return result.data;
  } catch (error) { return rejectWithValue(error.message); }
});

export const fetchNotifications = createAsyncThunk('professor/fetchNotifications', async (_, { rejectWithValue }) => {
  try {
    const result = await getMockNotifications();
    return result.data;
  } catch (error) { return rejectWithValue(error.message); }
});
export const fetchDashboardOverview = createAsyncThunk('professor/fetchDashboardOverview', async (_, { rejectWithValue }) => {
  try {
    const result = await getMockDashboardOverview();
    return result.data;
  } catch (error) { return rejectWithValue(error.message); }
});

export const fetchSchedule = createAsyncThunk('professor/fetchSchedule', async (_, { rejectWithValue }) => {
  try {
    const result = await getMockSchedule();
    return result.data;
  } catch (error) { return rejectWithValue(error.message); }
});
