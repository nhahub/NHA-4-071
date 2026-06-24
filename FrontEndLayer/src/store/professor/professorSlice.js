import { createSlice } from '@reduxjs/toolkit';
import { fetchProfessorProfile, fetchMyOfferings, submitGrade } from './professorThunks';

const initialState = {
  profile: null,
  offerings: [],
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
      .addCase(submitGrade.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearProfessorError } = professorSlice.actions;
export default professorSlice.reducer;
