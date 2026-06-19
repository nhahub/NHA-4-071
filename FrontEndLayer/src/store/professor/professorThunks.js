import { createAsyncThunk } from '@reduxjs/toolkit';
import { getProfessorProfile, getMyOfferings, submitStudentGrade } from '../../services/professorService';

export const fetchProfessorProfile = createAsyncThunk(
  'professor/fetchProfile', async (_, { rejectWithValue }) => {
    const result = await getProfessorProfile();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchMyOfferings = createAsyncThunk(
  'professor/fetchOfferings', async (_, { rejectWithValue }) => {
    const result = await getMyOfferings();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const submitGrade = createAsyncThunk(
  'professor/submitGrade', async (gradeData, { rejectWithValue }) => {
    const result = await submitStudentGrade(gradeData);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
