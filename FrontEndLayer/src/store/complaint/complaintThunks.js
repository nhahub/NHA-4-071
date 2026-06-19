import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMyComplaints, submitComplaint } from '../../services/studentService';

export const fetchMyComplaints = createAsyncThunk(
  'complaint/fetchMine', async (_, { rejectWithValue }) => {
    const result = await getMyComplaints();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const createComplaint = createAsyncThunk(
  'complaint/create', async (complaintData, { rejectWithValue }) => {
    const result = await submitComplaint(complaintData);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
