import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import studentReducer from './student/studentSlice';
import courseReducer from './course/courseSlice';
import enrollmentReducer from './enrollment/enrollmentSlice';
import complaintReducer from './complaint/complaintSlice';
import paymentReducer from './payment/paymentSlice';
import semesterReducer from './semester/semesterSlice';
import advisorReducer from './advisor/advisorSlice';
import professorReducer from './professor/professorSlice';
import adminReducer from './admin/adminSlice';
import departmentReducer from './department/departmentSlice';
import advisingSessionReducer from './advisingSession/advisingSessionSlice';
import assignmentReducer from './assignment/assignmentSlice';
import notificationReducer from './notification/notificationSlice';
import attendanceReducer from './attendance/attendanceSlice';
import scheduleReducer from './schedule/scheduleSlice';
import examReducer from './exam/examSlice';
import transcriptReducer from './transcript/transcriptSlice';
import studyPlanReducer from './studyPlan/studyPlanSlice';
import settingsReducer from './settings/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    student: studentReducer,
    course: courseReducer,
    enrollment: enrollmentReducer,
    complaint: complaintReducer,
    payment: paymentReducer,
    semester: semesterReducer,
    advisor: advisorReducer,
    professor: professorReducer,
    admin: adminReducer,
    department: departmentReducer,
    advisingSession: advisingSessionReducer,
    assignment: assignmentReducer,
    notification: notificationReducer,
    attendance: attendanceReducer,
    schedule: scheduleReducer,
    exam: examReducer,
    transcript: transcriptReducer,
    studyPlan: studyPlanReducer,
    settings: settingsReducer,
  },
});
