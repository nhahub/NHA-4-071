import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchProfessorProfile, fetchMyOfferings, submitGrade,
  fetchProfessorCourses, fetchAttendanceRecords, fetchGlobalAssignments,
  fetchGradeBook, fetchPerformanceAnalytics, fetchNotifications,
  fetchDashboardOverview
} from './professorThunks';

const initialState = {
  profile: null,
  offerings: [],
  courses: [],
  attendance: null,
  assignments: null,
  gradeBook: null,
  performance: null,
  notifications: null,
  dashboard: null,
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
      // Existing Profile & Offerings
      .addCase(fetchProfessorProfile.pending, handlePending)
      .addCase(fetchProfessorProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(fetchProfessorProfile.rejected, handleRejected)
      
      .addCase(fetchMyOfferings.pending, handlePending)
      .addCase(fetchMyOfferings.fulfilled, (state, action) => { state.loading = false; state.offerings = action.payload; })
      .addCase(fetchMyOfferings.rejected, handleRejected)
      
      .addCase(submitGrade.pending, handlePending)
      .addCase(submitGrade.fulfilled, (state) => { state.loading = false; })
      .addCase(submitGrade.rejected, handleRejected)

      // Mock UI Integrations
      .addCase(fetchProfessorCourses.pending, handlePending)
      .addCase(fetchProfessorCourses.fulfilled, (state, action) => { state.loading = false; state.courses = action.payload; })
      .addCase(fetchProfessorCourses.rejected, handleRejected)

      .addCase(fetchAttendanceRecords.pending, handlePending)
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => { 
        state.loading = false; 
        const students = action.payload?.students || [];
        const total = students.length;
        const present = students.filter(s => s.status === 'present').length;
        const absent = students.filter(s => s.status === 'absent').length;
        const onLeave = students.filter(s => s.status === 'on leave').length;
        
        state.attendance = {
          ...action.payload,
          metrics: {
            total,
            present,
            presentRate: total > 0 ? (present / total * 100).toFixed(1) + '%' : '0%',
            absent,
            absentRate: total > 0 ? (absent / total * 100).toFixed(1) + '%' : '0%',
            onLeave
          }
        };
      })
      .addCase(fetchAttendanceRecords.rejected, handleRejected)

      .addCase(fetchGlobalAssignments.pending, handlePending)
      .addCase(fetchGlobalAssignments.fulfilled, (state, action) => { 
        state.loading = false; 
        const list = action.payload?.list || [];
        
        let pending = 0;
        let activeDeadlines = 0;
        let totalStudents = 0;
        let totalGraded = 0;

        list.forEach(assignment => {
          pending += (assignment.total - assignment.graded);
          if (assignment.status !== 'report' && assignment.dueIn && !assignment.dueIn.includes('Past')) {
            activeDeadlines++;
          }
          totalStudents += assignment.total;
          totalGraded += assignment.graded;
        });

        state.assignments = {
          ...action.payload,
          metrics: {
            pending,
            activeDeadlines,
            totalStudents,
            completionRate: totalStudents > 0 ? (totalGraded / totalStudents * 100).toFixed(1) + '%' : '0%'
          }
        };
      })
      .addCase(fetchGlobalAssignments.rejected, handleRejected)

      .addCase(fetchGradeBook.pending, handlePending)
      .addCase(fetchGradeBook.fulfilled, (state, action) => { 
        state.loading = false; 
        const students = action.payload?.students || [];
        
        let sumScores = 0;
        let gradedItems = 0;
        let highestScoreNum = 0;
        let highestGrade = '--';

        students.forEach(student => {
          if (student.score && student.score !== '--') {
            const scoreNum = parseFloat(student.score);
            sumScores += scoreNum;
            gradedItems++;
            if (scoreNum > highestScoreNum) {
              highestScoreNum = scoreNum;
              highestGrade = student.grade;
            }
          }
        });

        state.gradeBook = {
          ...action.payload,
          metrics: {
            averageScore: gradedItems > 0 ? (sumScores / gradedItems).toFixed(1) + '%' : '0%',
            gradedItems: `${gradedItems}/${students.length}`,
            highestScore: highestScoreNum.toFixed(1),
            highestGrade,
            publishStatus: action.payload?.metrics?.publishStatus || 'Draft'
          }
        };
      })
      .addCase(fetchGradeBook.rejected, handleRejected)

      .addCase(fetchPerformanceAnalytics.pending, handlePending)
      .addCase(fetchPerformanceAnalytics.fulfilled, (state, action) => { 
        state.loading = false; 
        const priorityList = action.payload?.priorityList || [];
        const atRisk = priorityList.filter(s => s.risk === 'CRITICAL').length;

        state.performance = {
          ...action.payload,
          metrics: {
            gpa: action.payload?.metrics?.gpa || 'N/A', // Assuming GPA is still hardcoded for now unless computed from real grades
            attendance: action.payload?.metrics?.attendance || 'N/A',
            atRisk,
            totalStudents: priorityList.length
          }
        };
      })
      .addCase(fetchPerformanceAnalytics.rejected, handleRejected)

      .addCase(fetchNotifications.pending, handlePending)
      .addCase(fetchNotifications.fulfilled, (state, action) => { 
        state.loading = false; 
        const messages = action.payload?.messages || [];
        const unread = messages.filter(m => m.type === 'Student Message').length; // Mocking unread logic
        const appeals = messages.filter(m => m.subject.includes('Review') || m.subject.includes('Appeal')).length;
        const alerts = messages.filter(m => m.type === 'System' || m.type === 'Department').length;

        state.notifications = {
          ...action.payload,
          metrics: {
            unreadMessages: unread,
            pendingAppeals: appeals,
            departmentAlerts: alerts
          }
        };
      })
      .addCase(fetchNotifications.rejected, handleRejected)

      .addCase(fetchDashboardOverview.pending, handlePending)
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => { state.loading = false; state.dashboard = action.payload; })
      .addCase(fetchDashboardOverview.rejected, handleRejected);
  },
});

export const { clearProfessorError } = professorSlice.actions;
export default professorSlice.reducer;
