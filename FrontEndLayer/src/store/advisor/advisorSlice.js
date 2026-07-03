import { createSlice } from '@reduxjs/toolkit';
import { fetchAdvisorProfile, fetchAssignedStudents, fetchDashboardStats } from './advisorThunks';

const initialState = {
  profile: null,
  assignedStudents: [],
  dashboardStats: null,
  loading: false,
  statsLoading: false,
  error: null,
};

const advisorSlice = createSlice({
  name: 'advisor',
  initialState,
  reducers: {
    clearAdvisorError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdvisorProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchAdvisorProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(fetchAdvisorProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAssignedStudents.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAssignedStudents.fulfilled, (state, action) => { state.loading = false; state.assignedStudents = action.payload; })
      .addCase(fetchAssignedStudents.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchDashboardStats.pending, (state) => { state.statsLoading = true; state.error = null; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => { state.statsLoading = false; state.dashboardStats = action.payload; })
      .addCase(fetchDashboardStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearAdvisorError } = advisorSlice.actions;
export default advisorSlice.reducer;
