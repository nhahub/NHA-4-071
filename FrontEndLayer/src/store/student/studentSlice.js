import { createSlice } from '@reduxjs/toolkit';
import { fetchStudentProfile, updateProfile, fetchStudentDashboard } from './studentThunks';

const initialState = {
  profile: null,
  dashboard: null,
  loading: false,
  updating: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    clearStudentError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(fetchStudentProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateProfile.pending, (state) => { state.updating = true; state.error = null; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.updating = false; state.profile = action.payload; })
      .addCase(updateProfile.rejected, (state, action) => { state.updating = false; state.error = action.payload; })
      .addCase(fetchStudentDashboard.pending, (state) => { state.loading = true; })
      .addCase(fetchStudentDashboard.fulfilled, (state, action) => { state.loading = false; state.dashboard = action.payload; })
      .addCase(fetchStudentDashboard.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearStudentError } = studentSlice.actions;
export default studentSlice.reducer;
