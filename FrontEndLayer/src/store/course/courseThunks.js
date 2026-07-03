import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAvailableCourses, getCourseOfferings } from '../../services/studentService';

export const fetchAvailableCourses = createAsyncThunk(
  'course/fetchAvailable', async (_, { rejectWithValue }) => {
    const result = await getAvailableCourses();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchCourseOfferings = createAsyncThunk(
  'course/fetchOfferings', async (courseId, { rejectWithValue }) => {
    const result = await getCourseOfferings(courseId);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
