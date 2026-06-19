import { createSlice } from '@reduxjs/toolkit';
import { fetchAssignments, addAssignment } from './assignmentThunks';

const initialState = {
  assignments: [],
  loading: false,
  error: null,
};

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {
    clearAssignmentError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAssignments.fulfilled, (state, action) => { state.loading = false; state.assignments = action.payload; })
      .addCase(fetchAssignments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addAssignment.pending, (state) => { state.loading = true; })
      .addCase(addAssignment.fulfilled, (state, action) => { state.loading = false; state.assignments.push(action.payload); })
      .addCase(addAssignment.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearAssignmentError } = assignmentSlice.actions;
export default assignmentSlice.reducer;
