import { createAsyncThunk } from '@reduxjs/toolkit';
import { getDemographics } from '../../services/adminService';

export const fetchDepartments = createAsyncThunk(
  'department/fetchAll', async (_, { rejectWithValue }) => {
    const result = await getDemographics();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
