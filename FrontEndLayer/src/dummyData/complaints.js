export const complaints = [
  {
    _id: 'comp001',
    studentId: 'stu001',
    adminId: null,
    subject: 'Grade dispute in CS101',
    description: 'I believe my final exam grade was calculated incorrectly. I scored 88 on the exam but received a B- for the course.',
    status: 'pending',
    createdAt: '2026-03-10T09:00:00Z',
  },
  {
    _id: 'comp002',
    studentId: 'stu002',
    adminId: 'adm001',
    subject: 'Lab access issue',
    description: 'I cannot access Lab B-105 during assigned hours. My student card is not being recognized by the door scanner.',
    status: 'in_progress',
    createdAt: '2026-03-12T14:00:00Z',
  },
  {
    _id: 'comp003',
    studentId: 'stu001',
    adminId: 'adm001',
    subject: 'Schedule conflict',
    description: 'Two of my enrolled courses overlap on Sunday 10:00-11:30. Please help resolve this conflict.',
    status: 'resolved',
    createdAt: '2026-02-20T11:00:00Z',
  },
];
