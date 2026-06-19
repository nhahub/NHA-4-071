import { createSlice } from '@reduxjs/toolkit';
import { fetchAdvisorProfile, fetchAssignedStudents } from './advisorThunks';

const initialState = {
  profile: null,
  assignedStudents: [],
  loading: false,
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
      .addCase(fetchAssignedStudents.fulfilled, (state, action) => { state.assignedStudents = action.payload; });
  },
});

export const { clearAdvisorError } = advisorSlice.actions;
export default advisorSlice.reducer;
