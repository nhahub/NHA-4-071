import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllSemesters, getCurrentSemester } from '../../services/adminService';

export const fetchAllSemesters = createAsyncThunk(
  'semester/fetchAll', async (_, { rejectWithValue }) => {
    const result = await getAllSemesters();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchCurrentSemester = createAsyncThunk(
  'semester/fetchCurrent', async (_, { rejectWithValue }) => {
    const result = await getCurrentSemester();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
