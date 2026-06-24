import {
  users, departments, students, professors, advisors, admins,
  courses, semesters, courseOfferings, enrollments, payments,
  complaints, advisingSessions, assignments,
  exams, transcripts, studyPlans, notifications, attendance, scheduleData,
  studentSettings,
} from './index';

const routes = {
  'POST /auth/forgot-password': (_, __, data) => {
    const user = users.find((u) => u.email === data.email);
    return {
      status: user ? 200 : 200,
      data: { message: user ? 'Reset link sent to your email' : 'If this email exists, a reset link has been sent' },
    };
  },
  'POST /auth/login': (_, __, data) => {
    const user = users.find(
      (u) => u.universityId === data.universityId && u.isActive
    );
    if (!user) return { status: 401, data: { message: 'Invalid credentials' } };
    const { password, ...safeUser } = user;
    return { status: 200, data: { user: safeUser } };
  },
  'POST /auth/register': (_, __, data) => {
    const existingUser = users.find((u) => u.universityId === data.universityId || u.email === data.email);
    if (existingUser) return { status: 409, data: { message: 'User already exists with this University ID or email' } };
    const newUser = {
      _id: `u${Date.now()}`,
      universityId: data.universityId,
      email: data.email,
      name: data.name,
      role: data.role,
      isActive: true,
    };
    return { status: 201, data: { user: newUser } };
  },
  'POST /auth/logout': () => ({ status: 200, data: { message: 'Logged out' } }),
  'GET /auth/me': () => {
    const { password, ...safeUser } = users[0];
    return { status: 200, data: { user: safeUser } };
  },
  'POST /auth/change-password': () => ({
    status: 200,
    data: { message: 'Password changed successfully' },
  }),

  'GET /students/profile': () => ({ status: 200, data: students[0] }),
  'PATCH /students/profile': (_, __, data) => {
    Object.assign(students[0], data);
    return { status: 200, data: students[0] };
  },
  'GET /students/settings': () => ({ status: 200, data: { ...studentSettings } }),
  'PUT /students/settings': (_, __, data) => {
    const clean = { ...data };
    delete clean._id;
    delete clean.studentId;
    Object.assign(studentSettings, clean);
    return { status: 200, data: { ...studentSettings } };
  },
  'GET /students/dashboard': () => ({
    status: 200,
    data: {
      student: { GPA: students[0].GPA, level: students[0].level, departmentName: 'Computer Science' },
      currentSemester: { name: 'Spring 2026', registrationStatus: 'open' },
      enrolledCourses: enrollments.filter((e) => e.studentId === 'stu001' && e.status === 'enrolled').length,
      pendingPayments: payments.filter((p) => p.studentId === 'stu001' && p.status === 'pending').length,
      openComplaints: complaints.filter((c) => c.studentId === 'stu001' && c.status === 'pending').length,
      gpaTrend: [
        { semester: 'FA22', gpa: 3.2 }, { semester: 'SP23', gpa: 3.4 },
        { semester: 'SU23', gpa: 3.5 }, { semester: 'FA23', gpa: 3.6 },
        { semester: 'SP24', gpa: 3.7 }, { semester: 'SU24', gpa: 3.8 },
      ],
      currentCourses: [
        { code: 'CS301', name: 'Data Structures', credits: 3, grade: 'A' },
        { code: 'CS302', name: 'Algorithms', credits: 3, grade: 'B+' },
        { code: 'CS303', name: 'Software Engineering', credits: 3, grade: 'A' },
        { code: 'MATH201', name: 'Linear Algebra', credits: 3, grade: 'A-' },
      ],
      courseProgress: [
        { code: 'CS301', name: 'Data Structures', percent: 88, grade: 'A' },
        { code: 'CS302', name: 'Algorithms', percent: 72, grade: 'B+' },
        { code: 'CS303', name: 'Software Engineering', percent: 95, grade: 'A' },
      ],
    },
  }),
  'GET /students/enrollments': () => ({
    status: 200,
    data: enrollments.filter((e) => e.studentId === 'stu001'),
  }),
  'GET /students/complaints': () => ({
    status: 200,
    data: complaints.filter((c) => c.studentId === 'stu001'),
  }),
  'GET /students/payments': () => ({
    status: 200,
    data: payments.filter((p) => p.studentId === 'stu001'),
  }),
  'GET /students/advising-sessions': () => ({
    status: 200,
    data: advisingSessions.filter((s) => s.studentId === 'stu001'),
  }),
  'PATCH /students/advising-sessions/:id': (_, url, data) => {
    const id = url.split('/').pop();
    const session = advisingSessions.find((s) => s._id === id);
    return { status: 200, data: { ...session, ...data } };
  },
  'POST /students/advising-sessions': (_, __, data) => {
    const newSession = {
      _id: `as${Date.now()}`,
      studentId: 'stu001',
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    advisingSessions.push(newSession);
    return { status: 201, data: newSession };
  },
  'GET /students/notifications': () => ({
    status: 200,
    data: notifications.filter((n) => n.userId === users[0]._id),
  }),
  'PATCH /notifications/:id/read': (_, url) => {
    const id = url.split('/').pop();
    const notif = notifications.find((n) => n._id === id);
    return { status: 200, data: { ...notif, read: true } };
  },
  'GET /students/attendance': () => ({
    status: 200,
    data: attendance.find((a) => a.studentId === 'stu001') || attendance[0],
  }),
  'GET /students/schedule': () => ({
    status: 200,
    data: scheduleData,
  }),
  'GET /students/exams': () => ({
    status: 200,
    data: exams.filter((e) => e.studentId === 'stu001'),
  }),
  'GET /students/transcript': () => ({
    status: 200,
    data: transcripts.find((t) => t.studentId === 'stu001') || transcripts[0],
  }),
  'GET /students/study-plan': () => ({
    status: 200,
    data: studyPlans.find((sp) => sp.studentId === 'stu001') || studyPlans[0],
  }),

  'GET /courses/available': () => ({ status: 200, data: courses }),
  'GET /courses/:id/offerings': (_, url) => {
    const courseId = url.split('/')[2];
    return {
      status: 200,
      data: courseOfferings.filter((o) => o.courseId === courseId),
    };
  },

  'POST /enrollments': (_, __, data) => {
    const newEnrollment = {
      _id: `enr${Date.now()}`,
      studentId: 'stu001',
      courseId: data.courseId,
      offeringId: data.offeringId || data.courseId,
      status: 'enrolled',
      grade: null,
      createdAt: new Date().toISOString(),
    };
    enrollments.push(newEnrollment);
    return { status: 201, data: newEnrollment };
  },
  'DELETE /enrollments/:id': (_, url) => {
    const id = url.split('/').pop();
    return { status: 200, data: id };
  },

  'POST /complaints': (_, __, data) => {
    const newComplaint = {
      _id: `comp${Date.now()}`,
      studentId: 'stu001',
      adminId: null,
      subject: data.subject,
      description: data.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    complaints.push(newComplaint);
    return { status: 201, data: newComplaint };
  },

  'POST /payments': (_, __, data) => {
    const paidAmount = data.amount || 0;
    const newPayment = {
      _id: `pay${Date.now()}`,
      studentId: 'stu001',
      semesterId: data.semesterId,
      amount: paidAmount,
      status: 'paid',
      createdAt: new Date().toISOString(),
    };
    payments.push(newPayment);
    let remaining = paidAmount;
    for (const p of payments) {
      if (p.studentId === 'stu001' && (p.status === 'pending' || p.status === 'overdue') && remaining > 0) {
        if (p.amount <= remaining) {
          remaining -= p.amount;
          p.status = 'paid';
        } else {
          p.amount -= remaining;
          remaining = 0;
        }
      }
    }
    return { status: 201, data: newPayment };
  },

  'POST /gpa-calculations': (_, __, data) => ({
    status: 201,
    data: { _id: `gpa${Date.now()}`, ...data, savedAt: new Date().toISOString() },
  }),

  'GET /semesters': () => ({ status: 200, data: semesters }),
  'GET /semesters/current': () => ({
    status: 200,
    data: semesters.find((s) => s.registrationStatus === 'open') || semesters[0],
  }),
  'POST /semester-registration': () => ({
    status: 201,
    data: { message: 'Registration submitted successfully', submittedAt: new Date().toISOString() },
  }),

  'GET /professors/profile': () => ({ status: 200, data: professors[0] }),
  'GET /professors/offerings': () => ({
    status: 200,
    data: courseOfferings.filter((o) => o.professorId === 'prof001'),
  }),
  'GET /professors/offerings/:id/students': (_, url) => {
    const offeringId = url.split('/')[3];
    const enrolled = enrollments.filter((e) => e.offeringId === offeringId);
    return { status: 200, data: enrolled };
  },
  'POST /professors/grades': (_, __, data) => ({
    status: 200,
    data: { ...data, status: 'graded' },
  }),
  'GET /professors/offerings/:id/assignments': (_, url) => {
    const offeringId = url.split('/')[3];
    return {
      status: 200,
      data: assignments.filter((a) => a.offeringId === offeringId),
    };
  },
  'POST /professors/assignments': (_, __, data) => {
    const newAssignment = { _id: `asgn${Date.now()}`, ...data };
    return { status: 201, data: newAssignment };
  },

  'GET /advisors/profile': () => ({ status: 200, data: advisors[0] }),
  'GET /advisors/students': () => ({
    status: 200,
    data: students.filter((s) => s.advisorId === 'adv001'),
  }),
  'GET /advisors/sessions': () => ({
    status: 200,
    data: advisingSessions.filter((s) => s.advisorId === 'adv001'),
  }),
  'POST /advisors/sessions': (_, __, data) => {
    const newSession = {
      _id: `as${Date.now()}`,
      advisorId: 'adv001',
      ...data,
      status: 'scheduled',
    };
    return { status: 201, data: newSession };
  },
  'PATCH /advisors/sessions/:id': (_, url, data) => {
    const id = url.split('/').pop();
    const session = advisingSessions.find((s) => s._id === id);
    return { status: 200, data: { ...session, ...data } };
  },

  'GET /admin/users': () => {
    return { status: 200, data: users.map(({ password, ...u }) => u) };
  },
  'GET /admin/complaints': () => ({ status: 200, data: complaints }),
  'PATCH /admin/complaints/:id': (_, url, data) => {
    const id = url.split('/').pop();
    const complaint = complaints.find((c) => c._id === id);
    return { status: 200, data: { ...complaint, ...data, adminId: 'adm001' } };
  },
  'POST /admin/semesters': (_, __, data) => {
    const newSemester = { _id: `sem${Date.now()}`, ...data };
    return { status: 201, data: newSemester };
  },

  'GET /departments': () => ({ status: 200, data: departments }),
};

function matchRoute(method, url) {
  const cleanUrl = url.replace(/^\/api/, '');
  const requestKey = `${method} ${cleanUrl}`;

  if (routes[requestKey]) return routes[requestKey];

  for (const [pattern, handler] of Object.entries(routes)) {
    const [patternMethod, patternPath] = pattern.split(' ');
    if (patternMethod !== method) continue;

    const patternParts = patternPath.split('/');
    const urlParts = cleanUrl.split('/');

    if (patternParts.length !== urlParts.length) continue;

    const isMatch = patternParts.every(
      (part, i) => part.startsWith(':') || part === urlParts[i]
    );
    if (isMatch) return handler;
  }

  return null;
}

export function installDummyInterceptor(axiosInstance) {
  axiosInstance.interceptors.request.use(async (config) => {
    const method = (config.method || 'GET').toUpperCase();
    const url = config.url || '';

    const handler = matchRoute(method, url);
    if (handler) {
      await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));

      const mockResponse = handler(method, url.replace(/^\/api/, ''), config.data);

      return Promise.reject({
        __MOCK__: true,
        response: {
          status: mockResponse.status,
          data: mockResponse.data,
          headers: {},
          config,
        },
      });
    }

    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.__MOCK__) {
        if (error.response.status >= 400) {
          return Promise.reject(error);
        }
        return Promise.resolve(error.response);
      }
      return Promise.reject(error);
    }
  );
}
