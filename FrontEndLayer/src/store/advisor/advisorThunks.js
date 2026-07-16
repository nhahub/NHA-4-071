import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAdvisorProfile, getAssignedStudents, getAdvisorDashboard,
  getSessions, createSession, updateAdvisingSession,
  getStudentProgress, getGraduationAudit,
  getIssues, updateIssueStatus, getSemesters,
} from '../../services/advisorService';

export const fetchAdvisorProfile = createAsyncThunk(
  'advisor/fetchProfile', async (_, { rejectWithValue }) => {
    const result = await getAdvisorProfile();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchAssignedStudents = createAsyncThunk(
  'advisor/fetchStudents', async (_, { rejectWithValue }) => {
    const result = await getAssignedStudents();
    if (!result.success) return rejectWithValue(result.error);
    return result.data.students;
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'advisor/fetchDashboardStats', async (_, { rejectWithValue }) => {
    const result = await getAdvisorDashboard();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchSessions = createAsyncThunk(
  'advisor/fetchSessions', async (_, { rejectWithValue }) => {
    const result = await getSessions();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const addSession = createAsyncThunk(
  'advisor/addSession', async (sessionData, { rejectWithValue }) => {
    const result = await createSession(sessionData);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const modifySession = createAsyncThunk(
  'advisor/modifySession', async ({ sessionId, data }, { rejectWithValue }) => {
    const result = await updateAdvisingSession(sessionId, data);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchStudentProgress = createAsyncThunk(
  'advisor/fetchStudentProgress', async (studentId, { rejectWithValue }) => {
    const result = await getStudentProgress(studentId);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchGraduationAudit = createAsyncThunk(
  'advisor/fetchGraduationAudit', async (studentId, { rejectWithValue }) => {
    const result = await getGraduationAudit(studentId);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchIssues = createAsyncThunk(
  'advisor/fetchIssues', async (_, { rejectWithValue }) => {
    const result = await getIssues();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const modifyIssueStatus = createAsyncThunk(
  'advisor/modifyIssueStatus', async ({ issueId, status }, { rejectWithValue }) => {
    const result = await updateIssueStatus(issueId, status);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchSemesters = createAsyncThunk(
  'advisor/fetchSemesters', async (_, { rejectWithValue }) => {
    const result = await getSemesters();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
