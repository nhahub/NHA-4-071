import {
  users, departments, students, professors, advisors, admins,
  courses, semesters, courseOfferings, enrollments, payments,
  complaints, advisingSessions, assignments,
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

  'GET /students/profile': () => ({ status: 200, data: students[0] }),
  'GET /students/dashboard': () => ({
    status: 200,
    data: {
      student: { GPA: students[0].GPA, level: students[0].level, departmentName: 'Computer Science' },
      currentSemester: { name: 'Spring 2026', registrationStatus: 'open' },
      enrolledCourses: enrollments.filter((e) => e.studentId === 'stu001' && e.status === 'enrolled').length,
      pendingPayments: payments.filter((p) => p.studentId === 'stu001' && p.status === 'pending').length,
      openComplaints: complaints.filter((c) => c.studentId === 'stu001' && c.status === 'pending').length,
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
      offeringId: data.offeringId,
      status: 'enrolled',
      grade: null,
    };
    return { status: 201, data: newEnrollment };
  },
  'DELETE /enrollments/:id': (_, url) => {
    const id = url.split('/').pop();
    return { status: 200, data: { _id: id } };
  },

  'POST /complaints': (_, __, data) => {
    const newComplaint = {
      _id: `comp${Date.now()}`,
      studentId: 'stu001',
      adminId: null,
      subject: data.subject,
      description: data.description,
      status: 'pending',
    };
    return { status: 201, data: newComplaint };
  },

  'POST /payments': (_, __, data) => {
    const newPayment = {
      _id: `pay${Date.now()}`,
      studentId: 'stu001',
      semesterId: data.semesterId,
      amount: data.amount,
      status: 'paid',
    };
    return { status: 201, data: newPayment };
  },

  'GET /semesters': () => ({ status: 200, data: semesters }),
  'GET /semesters/current': () => ({
    status: 200,
    data: semesters.find((s) => s.registrationStatus === 'open') || semesters[0],
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
