import { createAsyncThunk } from '@reduxjs/toolkit';
import { getDepartments } from '../../services/adminService';

export const fetchDepartments = createAsyncThunk(
  'department/fetchAll', async (_, { rejectWithValue }) => {
    const result = await getDepartments();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
