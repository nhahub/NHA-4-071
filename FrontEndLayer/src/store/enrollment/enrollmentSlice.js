import { createSlice } from '@reduxjs/toolkit';
import { fetchMyEnrollments, enrollCourse, dropCourse } from './enrollmentThunks';

const initialState = {
  enrollments: [],
  loading: false,
  error: null,
};

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    clearEnrollmentError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyEnrollments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => { state.loading = false; state.enrollments = action.payload; })
      .addCase(fetchMyEnrollments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(enrollCourse.pending, (state) => { state.loading = true; })
      .addCase(enrollCourse.fulfilled, (state, action) => { state.loading = false; state.enrollments.push(action.payload); })
      .addCase(enrollCourse.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(dropCourse.pending, (state) => { state.loading = true; })
      .addCase(dropCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = state.enrollments.filter((e) => e._id !== action.payload);
      })
      .addCase(dropCourse.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearEnrollmentError } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
