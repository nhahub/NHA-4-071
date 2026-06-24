import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMyAdvisingSessions, createStudentAdvisingSession } from '../../services/studentService';
import { updateAdvisingSession } from '../../services/advisorService';

export const fetchAdvisingSessions = createAsyncThunk(
  'advisingSession/fetchAll', async (_, { rejectWithValue }) => {
    const result = await getMyAdvisingSessions();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const createSession = createAsyncThunk(
  'advisingSession/create', async (sessionData, { rejectWithValue }) => {
    const result = await createStudentAdvisingSession(sessionData);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const updateSession = createAsyncThunk(
  'advisingSession/update', async ({ sessionId, data }, { rejectWithValue }) => {
    const result = await updateAdvisingSession(sessionId, data);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
