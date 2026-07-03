import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAssignments, createAssignment } from '../../services/professorService';

export const fetchAssignments = createAsyncThunk(
  'assignment/fetchByOffering', async (offeringId, { rejectWithValue }) => {
    const result = await getAssignments(offeringId);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const addAssignment = createAsyncThunk(
  'assignment/create', async (assignmentData, { rejectWithValue }) => {
    const result = await createAssignment(assignmentData);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
