import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMyEnrollments, enrollInOffering, dropEnrollment } from '../../services/studentService';

export const fetchMyEnrollments = createAsyncThunk(
  'enrollment/fetchMine', async (_, { rejectWithValue }) => {
    const result = await getMyEnrollments();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const enrollCourse = createAsyncThunk(
  'enrollment/enroll', async (offeringId, { rejectWithValue }) => {
    const result = await enrollInOffering(offeringId);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const dropCourse = createAsyncThunk(
  'enrollment/drop', async (enrollmentId, { rejectWithValue }) => {
    const result = await dropEnrollment(enrollmentId);
    if (!result.success) return rejectWithValue(result.error);
    return enrollmentId;
  }
);
