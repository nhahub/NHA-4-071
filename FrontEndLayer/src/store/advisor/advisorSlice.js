import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAdvisorProfile, fetchAssignedStudents, fetchDashboardStats,
  fetchSessions, addSession, modifySession,
  fetchStudentProgress, fetchGraduationAudit,
  fetchIssues, modifyIssueStatus, fetchSemesters,
} from './advisorThunks';

const initialState = {
  profile: null,
  assignedStudents: [],
  dashboardStats: null,
  sessions: [],
  semesters: [],
  studentProgress: null,
  graduationAudit: null,
  issues: null,
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
      .addCase(fetchDashboardStats.rejected, (state, action) => { state.statsLoading = false; state.error = action.payload; })

      .addCase(fetchSessions.pending, (state) => { state.loading = true; })
      .addCase(fetchSessions.fulfilled, (state, action) => { state.loading = false; state.sessions = action.payload; })
      .addCase(fetchSessions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addSession.pending, (state) => { state.loading = true; })
      .addCase(addSession.fulfilled, (state) => { state.loading = false; })
      .addCase(addSession.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(modifySession.pending, (state) => { state.loading = true; })
      .addCase(modifySession.fulfilled, (state) => { state.loading = false; })
      .addCase(modifySession.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchStudentProgress.pending, (state) => { state.loading = true; })
      .addCase(fetchStudentProgress.fulfilled, (state, action) => { state.loading = false; state.studentProgress = action.payload; })
      .addCase(fetchStudentProgress.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchGraduationAudit.pending, (state) => { state.loading = true; })
      .addCase(fetchGraduationAudit.fulfilled, (state, action) => { state.loading = false; state.graduationAudit = action.payload; })
      .addCase(fetchGraduationAudit.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchIssues.pending, (state) => { state.loading = true; })
      .addCase(fetchIssues.fulfilled, (state, action) => { state.loading = false; state.issues = action.payload; })
      .addCase(fetchIssues.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(modifyIssueStatus.pending, (state) => { state.loading = true; })
      .addCase(modifyIssueStatus.fulfilled, (state) => { state.loading = false; })
      .addCase(modifyIssueStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchSemesters.fulfilled, (state, action) => { state.semesters = action.payload; });
  },
});

export const { clearAdvisorError } = advisorSlice.actions;
export default advisorSlice.reducer;
