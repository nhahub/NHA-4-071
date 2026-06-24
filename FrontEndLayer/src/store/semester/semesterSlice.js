import { createSlice } from '@reduxjs/toolkit';
import { fetchAllSemesters, fetchCurrentSemester, submitRegistration } from './semesterThunks';

const initialState = {
  semesters: [],
  currentSemester: null,
  registration: null,
  loading: false,
  submitting: false,
  error: null,
};

const semesterSlice = createSlice({
  name: 'semester',
  initialState,
  reducers: {
    clearRegistration: (state) => { state.registration = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSemesters.pending, (state) => { state.loading = true; })
      .addCase(fetchAllSemesters.fulfilled, (state, action) => { state.loading = false; state.semesters = action.payload; })
      .addCase(fetchAllSemesters.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCurrentSemester.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCurrentSemester.fulfilled, (state, action) => { state.loading = false; state.currentSemester = action.payload; })
      .addCase(fetchCurrentSemester.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(submitRegistration.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(submitRegistration.fulfilled, (state, action) => { state.submitting = false; state.registration = action.payload; })
      .addCase(submitRegistration.rejected, (state, action) => { state.submitting = false; state.error = action.payload; });
  },
});

export const { clearRegistration } = semesterSlice.actions;
export default semesterSlice.reducer;
