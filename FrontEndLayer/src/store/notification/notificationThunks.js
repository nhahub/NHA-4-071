import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMyNotifications, markNotificationRead } from '../../services/studentService';

export const fetchNotifications = createAsyncThunk(
  'notification/fetchAll', async (_, { rejectWithValue }) => {
    const result = await getMyNotifications();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const markRead = createAsyncThunk(
  'notification/markRead', async (id, { rejectWithValue }) => {
    const result = await markNotificationRead(id);
    if (!result.success) return rejectWithValue(result.error);
    return id;
  }
);