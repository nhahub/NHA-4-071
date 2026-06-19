import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAdvisingSessions, createAdvisingSession, updateAdvisingSession,
} from '../../services/advisorService';

export const fetchAdvisingSessions = createAsyncThunk(
  'advisingSession/fetchAll', async (_, { rejectWithValue }) => {
    const result = await getAdvisingSessions();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const createSession = createAsyncThunk(
  'advisingSession/create', async (sessionData, { rejectWithValue }) => {
    const result = await createAdvisingSession(sessionData);
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
