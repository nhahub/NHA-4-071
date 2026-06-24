import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMySettings, updateMySettings } from '../../services/studentService';

export const fetchSettings = createAsyncThunk(
  'settings/fetch', async (_, { rejectWithValue }) => {
    const result = await getMySettings();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

export const saveSettings = createAsyncThunk(
  'settings/save', async (settingsData, { rejectWithValue }) => {
    const result = await updateMySettings(settingsData);
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);
