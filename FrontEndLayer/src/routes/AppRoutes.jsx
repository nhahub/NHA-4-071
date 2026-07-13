import { createBrowserRouter } from 'react-router-dom';

import { ROUTES } from './RoutePaths';
import { ProtectedRoute } from './ProtectedRoute';
import DashboardLayout from '../shared/components/DashboardLayout';

import LandingPage from '../pages/Public/LandingPage';
import NotFoundPage from '../pages/Public/NotFoundPage';
import ForbiddenPage from '../pages/Public/ForbiddenPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';

import StudentDashboard from '../pages/Student/StudentDashboard';
import CourseEnrollmentPage from '../pages/Student/CourseEnrollmentPage';
import SemesterRegistrationPage from '../pages/Student/SemesterRegistrationPage';
import StudentSchedulePage from '../pages/Student/StudentSchedulePage';
import ExamSchedulePage from '../pages/Student/ExamSchedulePage';
import TranscriptPage from '../pages/Student/TranscriptPage';
import StudyPlanPage from '../pages/Student/StudyPlanPage';
import StudentAdvisingPage from '../pages/Student/StudentAdvisingPage';
import StudentComplaintPage from '../pages/Student/StudentComplaintPage';
import PaymentPage from '../pages/Student/PaymentPage';
import StudentAttendancePage from '../pages/Student/StudentAttendancePage';
import StudentProfilePage from '../pages/Student/StudentProfilePage';
import StudentNotifications from '../pages/Student/StudentNotifications';
import GpaCalculatorPage from '../pages/Student/GpaCalculatorPage';
import SettingsPage from '../pages/Student/SettingsPage';

import ProfessorDashboard from '../pages/Professor/ProfessorDashboard';
import MyCoursesPage from '../pages/Professor/MyCoursesPage';
import AssignmentsPage from '../pages/Professor/AssignmentsPage';
import AttendanceManagement from '../pages/Professor/AttendanceManagement';
import GradeManagement from '../pages/Professor/GradeManagement';
import StudentPerformance from '../pages/Professor/StudentPerformance';
import ProfessorSchedule from '../pages/Professor/ProfessorSchedule';
import ProfessorNotifications from '../pages/Professor/ProfessorNotifications';

import AdvisorDashboard from '../pages/Advisor/AdvisorDashboard';
import StudentListPage from '../pages/Advisor/StudentListPage';
import AdvisingSessionsPage from '../pages/Advisor/AdvisingSessionsPage';
import GraduationRequirements from '../pages/Advisor/GraduationRequirements';
import IssueResolutionPage from '../pages/Advisor/IssueResolutionPage';
import StudentProgressDetail from '../pages/Advisor/StudentProgressDetail';
import AtRisk from '../pages/Advisor/AtRisk';
import TodaysSessions from '../pages/Advisor/TodaysSessions';
import Alerts from '../pages/Advisor/Alerts';
import Insights from '../pages/Advisor/Insights';

import AdminDashboard from '../pages/Admin/AdminDashboard';
import UserManagement from '../pages/Admin/UserManagement';
import CourseManagement from '../pages/Admin/CourseManagement';
import DepartmentManagement from '../pages/Admin/DepartmentManagement';
import SemesterConfiguration from '../pages/Admin/SemesterConfiguration';
import ComplaintManagement from '../pages/Admin/ComplaintManagement';
import RegistrationControl from '../pages/Admin/RegistrationControl';
import ReportsAnalytics from '../pages/Admin/ReportsAnalytics';
import AcademicPolicies from '../pages/Admin/AcademicPolicies';
import SystemSettings from '../pages/Admin/SystemSettings';

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <LandingPage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.FORBIDDEN,
    element: <ForbiddenPage />,
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [
          { path: ROUTES.STUDENT.DASHBOARD, element: <StudentDashboard /> },
          { path: ROUTES.STUDENT.ENROLLMENT, element: <CourseEnrollmentPage /> },
          { path: ROUTES.STUDENT.SEMESTER_REGISTRATION, element: <SemesterRegistrationPage /> },
          { path: ROUTES.STUDENT.SCHEDULE, element: <StudentSchedulePage /> },
          { path: ROUTES.STUDENT.EXAM_SCHEDULE, element: <ExamSchedulePage /> },
          { path: ROUTES.STUDENT.TRANSCRIPT, element: <TranscriptPage /> },
          { path: ROUTES.STUDENT.STUDY_PLAN, element: <StudyPlanPage /> },
          { path: ROUTES.STUDENT.ADVISING, element: <StudentAdvisingPage /> },
          { path: ROUTES.STUDENT.COMPLAINTS, element: <StudentComplaintPage /> },
          { path: ROUTES.STUDENT.PAYMENTS, element: <PaymentPage /> },
          { path: ROUTES.STUDENT.ATTENDANCE, element: <StudentAttendancePage /> },
          { path: ROUTES.STUDENT.PROFILE, element: <StudentProfilePage /> },
          { path: ROUTES.STUDENT.NOTIFICATIONS, element: <StudentNotifications /> },
          { path: ROUTES.STUDENT.GPA_CALCULATOR, element: <GpaCalculatorPage /> },
          { path: ROUTES.STUDENT.SETTINGS, element: <SettingsPage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['professor']} />,
        children: [
          { path: ROUTES.PROFESSOR.DASHBOARD, element: <ProfessorDashboard /> },
          { path: ROUTES.PROFESSOR.COURSES, element: <MyCoursesPage /> },
          { path: ROUTES.PROFESSOR.ASSIGNMENTS, element: <AssignmentsPage /> },
          { path: ROUTES.PROFESSOR.ATTENDANCE, element: <AttendanceManagement /> },
          { path: ROUTES.PROFESSOR.GRADES, element: <GradeManagement /> },
          { path: ROUTES.PROFESSOR.STUDENTS, element: <StudentPerformance /> },
          { path: ROUTES.PROFESSOR.SCHEDULE, element: <ProfessorSchedule /> },
          { path: ROUTES.PROFESSOR.NOTIFICATIONS, element: <ProfessorNotifications /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['advisor']} />,
        children: [
           { path: ROUTES.ADVISOR.DASHBOARD, element: <AdvisorDashboard /> },
           { path: ROUTES.ADVISOR.STUDENTS, element: <StudentListPage /> },
           { path: ROUTES.ADVISOR.SESSIONS, element: <AdvisingSessionsPage /> },
           { path: ROUTES.ADVISOR.GRADUATION, element: <GraduationRequirements /> },
           { path: ROUTES.ADVISOR.ISSUES, element: <IssueResolutionPage /> },
           { path: ROUTES.ADVISOR.STUDENT_PROGRESS, element: <StudentProgressDetail /> },
           { path: ROUTES.ADVISOR.AT_RISK, element: <AtRisk /> },
           { path: ROUTES.ADVISOR.TODAY_SESSIONS, element: <TodaysSessions /> },
           { path: ROUTES.ADVISOR.ALERTS, element: <Alerts /> },
           { path: ROUTES.ADVISOR.INSIGHTS, element: <Insights /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          { path: ROUTES.ADMIN.DASHBOARD, element: <AdminDashboard /> },
          { path: ROUTES.ADMIN.USERS, element: <UserManagement /> },
          { path: ROUTES.ADMIN.COURSES, element: <CourseManagement /> },
          { path: ROUTES.ADMIN.DEPARTMENTS, element: <DepartmentManagement /> },
          { path: ROUTES.ADMIN.SEMESTERS, element: <SemesterConfiguration /> },
          { path: ROUTES.ADMIN.COMPLAINTS, element: <ComplaintManagement /> },
          { path: ROUTES.ADMIN.REGISTRATION, element: <RegistrationControl /> },
          { path: ROUTES.ADMIN.REPORTS, element: <ReportsAnalytics /> },
          { path: ROUTES.ADMIN.POLICIES, element: <AcademicPolicies /> },
          { path: ROUTES.ADMIN.SETTINGS, element: <SystemSettings /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
