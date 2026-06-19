import { createSlice } from '@reduxjs/toolkit';
import { fetchAvailableCourses, fetchCourseOfferings } from './courseThunks';

const initialState = {
  availableCourses: [],
  offerings: [],
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    clearCourseError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableCourses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAvailableCourses.fulfilled, (state, action) => { state.loading = false; state.availableCourses = action.payload; })
      .addCase(fetchAvailableCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCourseOfferings.pending, (state) => { state.loading = true; })
      .addCase(fetchCourseOfferings.fulfilled, (state, action) => { state.loading = false; state.offerings = action.payload; })
      .addCase(fetchCourseOfferings.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearCourseError } = courseSlice.actions;
export default courseSlice.reducer;
