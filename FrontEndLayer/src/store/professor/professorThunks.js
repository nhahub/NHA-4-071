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

export const fetchOfferingStudents = createAsyncThunk(
  'professor/fetchOfferingStudents', async (offeringId, { rejectWithValue }) => {
    const { getOfferingStudents } = await import('../../services/professorService');
    const result = await getOfferingStudents(offeringId);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchAssignments = createAsyncThunk(
  'professor/fetchAssignments', async (offeringId, { rejectWithValue }) => {
    const { getAssignments } = await import('../../services/professorService');
    const result = await getAssignments(offeringId);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const addAssignment = createAsyncThunk(
  'professor/addAssignment', async (data, { rejectWithValue }) => {
    const { createAssignment } = await import('../../services/professorService');
    const result = await createAssignment(data);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
