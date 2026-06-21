import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../routes/RoutePaths';

const roleLinks = {
  student: [
    { to: ROUTES.STUDENT.DASHBOARD, label: 'Dashboard' },
    { to: ROUTES.STUDENT.ENROLLMENT, label: 'Course Enrollment' },
    { to: ROUTES.STUDENT.SEMESTER_REGISTRATION, label: 'Semester Registration' },
    { to: ROUTES.STUDENT.SCHEDULE, label: 'Schedule' },
    { to: ROUTES.STUDENT.EXAM_SCHEDULE, label: 'Exam Schedule' },
    { to: ROUTES.STUDENT.TRANSCRIPT, label: 'Transcript' },
    { to: ROUTES.STUDENT.STUDY_PLAN, label: 'Study Plan' },
    { to: ROUTES.STUDENT.ADVISING, label: 'Advising' },
    { to: ROUTES.STUDENT.COMPLAINTS, label: 'Complaints' },
    { to: ROUTES.STUDENT.PAYMENTS, label: 'Payments' },
    { to: ROUTES.STUDENT.ATTENDANCE, label: 'Attendance' },
    { to: ROUTES.STUDENT.PROFILE, label: 'Profile' },
    { to: ROUTES.STUDENT.NOTIFICATIONS, label: 'Notifications' },
  ],
  professor: [
    { to: ROUTES.PROFESSOR.DASHBOARD, label: 'Dashboard' },
    { to: ROUTES.PROFESSOR.COURSES, label: 'My Courses' },
    { to: ROUTES.PROFESSOR.ASSIGNMENTS, label: 'Assignments' },
    { to: ROUTES.PROFESSOR.ATTENDANCE, label: 'Attendance' },
    { to: ROUTES.PROFESSOR.GRADES, label: 'Grades' },
    { to: ROUTES.PROFESSOR.STUDENTS, label: 'Students' },
    { to: ROUTES.PROFESSOR.SCHEDULE, label: 'Schedule' },
    { to: ROUTES.PROFESSOR.NOTIFICATIONS, label: 'Notifications' },
  ],
  advisor: [
    { to: ROUTES.ADVISOR.DASHBOARD, label: 'Dashboard' },
    { to: ROUTES.ADVISOR.STUDENTS, label: 'Students' },
    { to: ROUTES.ADVISOR.SESSIONS, label: 'Advising Sessions' },
    { to: ROUTES.ADVISOR.GRADUATION, label: 'Graduation Requirements' },
    { to: ROUTES.ADVISOR.ISSUES, label: 'Issue Resolution' },
    { to: ROUTES.ADVISOR.STUDENT_PROGRESS.replace(':id', '1'), label: 'Student Progress' },
  ],
  admin: [
    { to: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard' },
    { to: ROUTES.ADMIN.USERS, label: 'Users' },
    { to: ROUTES.ADMIN.COURSES, label: 'Courses' },
    { to: ROUTES.ADMIN.DEPARTMENTS, label: 'Departments' },
    { to: ROUTES.ADMIN.SEMESTERS, label: 'Semesters' },
    { to: ROUTES.ADMIN.COMPLAINTS, label: 'Complaints' },
    { to: ROUTES.ADMIN.REGISTRATION, label: 'Registration Control' },
    { to: ROUTES.ADMIN.REPORTS, label: 'Reports' },
    { to: ROUTES.ADMIN.POLICIES, label: 'Academic Policies' },
    { to: ROUTES.ADMIN.SETTINGS, label: 'Settings' },
  ],
};

const navLinkStyle = {
  display: 'block',
  padding: '8px 16px',
  color: '#333',
  textDecoration: 'none',
};

const activeNavLinkStyle = {
  ...navLinkStyle,
  backgroundColor: '#e0e0e0',
  fontWeight: 'bold',
};

const DashboardSidebar = () => {
  const { user } = useAuth();
  const links = roleLinks[user?.role] || [];

  return (
    <nav style={{ width: 240, backgroundColor: '#f5f5f5', height: '100%', overflowY: 'auto', borderRight: '1px solid #ddd' }}>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end
          style={({ isActive }) => (isActive ? activeNavLinkStyle : navLinkStyle)}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default DashboardSidebar;
