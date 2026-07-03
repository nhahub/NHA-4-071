import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAdvisorProfile, getAssignedStudents, getAdvisorDashboard } from '../../services/advisorService';

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
    return result.data;
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'advisor/fetchDashboardStats', async (_, { rejectWithValue }) => {
    const result = await getAdvisorDashboard();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
