import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMyAttendance } from '../../services/studentService';

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAll', async (_, { rejectWithValue }) => {
    const result = await getMyAttendance();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);