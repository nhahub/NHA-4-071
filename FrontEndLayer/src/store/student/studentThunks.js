import { createAsyncThunk } from '@reduxjs/toolkit';
import { getStudentProfile, getStudentDashboard, updateStudentProfile } from '../../services/studentService';

export const fetchStudentProfile = createAsyncThunk(
  'student/fetchProfile', async (_, { rejectWithValue }) => {
    const result = await getStudentProfile();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const updateProfile = createAsyncThunk(
  'student/updateProfile', async (profileData, { rejectWithValue }) => {
    const result = await updateStudentProfile(profileData);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchStudentDashboard = createAsyncThunk(
  'student/fetchDashboard', async (_, { rejectWithValue }) => {
    const result = await getStudentDashboard();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
