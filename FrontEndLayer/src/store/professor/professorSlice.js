import { createSlice } from '@reduxjs/toolkit';
import { fetchProfessorProfile, fetchMyOfferings, submitGrade, fetchOfferingStudents, fetchAssignments, addAssignment } from './professorThunks';

const initialState = {
  profile: null,
  offerings: [],
  students: [],
  assignments: [],
  loading: false,
  error: null,
};

const professorSlice = createSlice({
  name: 'professor',
  initialState,
  reducers: {
    clearProfessorError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfessorProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchProfessorProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(fetchProfessorProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyOfferings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyOfferings.fulfilled, (state, action) => { state.loading = false; state.offerings = action.payload; })
      .addCase(fetchMyOfferings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(submitGrade.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(submitGrade.fulfilled, (state, action) => { state.loading = false; })
      .addCase(submitGrade.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchOfferingStudents.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOfferingStudents.fulfilled, (state, action) => { state.loading = false; state.students = action.payload; })
      .addCase(fetchOfferingStudents.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAssignments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAssignments.fulfilled, (state, action) => { state.loading = false; state.assignments = action.payload; })
      .addCase(fetchAssignments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addAssignment.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addAssignment.fulfilled, (state, action) => { state.loading = false; state.assignments.push(action.payload); })
      .addCase(addAssignment.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearProfessorError } = professorSlice.actions;
export default professorSlice.reducer;
