import { createSlice } from '@reduxjs/toolkit';
import { fetchSettings, saveSettings } from './settingsThunks';

const initialState = {
  preferences: null,
  loading: false,
  saving: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettingsError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSettings.fulfilled, (state, action) => { state.loading = false; state.preferences = action.payload; })
      .addCase(fetchSettings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(saveSettings.pending, (state) => { state.saving = true; state.error = null; })
      .addCase(saveSettings.fulfilled, (state, action) => { state.saving = false; state.preferences = action.payload; })
      .addCase(saveSettings.rejected, (state, action) => { state.saving = false; state.error = action.payload; });
  },
});

export const { clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;
