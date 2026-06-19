import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, logoutUser, getCurrentUser } from '../../services/authService';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    const result = await loginUser(credentials);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    const result = await logoutUser();
    if (!result.success) return rejectWithValue(result.error);
    return null;
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    const result = await getCurrentUser();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
