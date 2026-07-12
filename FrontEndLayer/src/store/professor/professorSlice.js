import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProfessorProfile, fetchMyOfferings, submitGrade,
  fetchDashboardOverview, fetchNotifications,
  fetchGradeBook, fetchPerformanceAnalytics, fetchSchedule,
  fetchOfferingStudents, addAssignment,
} from './professorThunks';

const initialState = {
  profile: null,
  offerings: [],
  students: [],
  assignments: null,
  gradeBook: null,
  performance: null,
  notifications: null,
  dashboard: null,
  schedule: [],
  loading: false,
  error: null,
};

const handlePending = (state) => { state.loading = true; state.error = null; };
const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; };

const professorSlice = createSlice({
  name: 'professor',
  initialState,
  reducers: {
    clearProfessorError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfessorProfile.pending, handlePending)
      .addCase(fetchProfessorProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(fetchProfessorProfile.rejected, handleRejected)

      .addCase(fetchMyOfferings.pending, handlePending)
      .addCase(fetchMyOfferings.fulfilled, (state, action) => { state.loading = false; state.offerings = action.payload; })
      .addCase(fetchMyOfferings.rejected, handleRejected)

      .addCase(submitGrade.pending, handlePending)
      .addCase(submitGrade.fulfilled, (state) => { state.loading = false; })
      .addCase(submitGrade.rejected, handleRejected)

      .addCase(fetchDashboardOverview.pending, handlePending)
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => { state.loading = false; state.dashboard = action.payload; })
      .addCase(fetchDashboardOverview.rejected, handleRejected)

      .addCase(fetchNotifications.pending, handlePending)
      .addCase(fetchNotifications.fulfilled, (state, action) => { state.loading = false; state.notifications = action.payload; })
      .addCase(fetchNotifications.rejected, handleRejected)

      .addCase(fetchGradeBook.pending, handlePending)
      .addCase(fetchGradeBook.fulfilled, (state, action) => { state.loading = false; state.gradeBook = action.payload; })
      .addCase(fetchGradeBook.rejected, handleRejected)

      .addCase(fetchPerformanceAnalytics.pending, handlePending)
      .addCase(fetchPerformanceAnalytics.fulfilled, (state, action) => { state.loading = false; state.performance = action.payload; })
      .addCase(fetchPerformanceAnalytics.rejected, handleRejected)

      .addCase(fetchSchedule.pending, handlePending)
      .addCase(fetchSchedule.fulfilled, (state, action) => { state.loading = false; state.schedule = action.payload; })
      .addCase(fetchSchedule.rejected, handleRejected)

      .addCase(fetchOfferingStudents.pending, handlePending)
      .addCase(fetchOfferingStudents.fulfilled, (state, action) => { state.loading = false; state.students = action.payload; })
      .addCase(fetchOfferingStudents.rejected, handleRejected)

      .addCase(addAssignment.pending, handlePending)
      .addCase(addAssignment.fulfilled, (state) => { state.loading = false; })
      .addCase(addAssignment.rejected, handleRejected);
  },
});

export const { clearProfessorError } = professorSlice.actions;
export default professorSlice.reducer;
