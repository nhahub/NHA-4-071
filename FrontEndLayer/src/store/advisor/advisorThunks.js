import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAdvisorProfile, getAssignedStudents } from '../../services/advisorService';

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
