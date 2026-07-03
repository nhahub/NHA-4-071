export const initialOverrides = [
  {
    _id: 'rev001',
    studentName: 'Ahmed El-Morshedy',
    studentId: '2024-0891',
    courseCode: 'CS-401: Advanced Algos',
    courseSection: 'Section A (3 Credits)',
    reason: 'Student requires this core course for graduation this semester. Prerequisite waived by Dean.',
    stakeholders: [
      { initials: 'JD', color: 'bg-[#8691A7] text-[#E0E3E5]' },
      { initials: 'SR', color: 'bg-[#03B5D3] text-[#E0E3E5]' },
    ],
    status: 'pending',
  },
  {
    _id: 'rev002',
    studentName: 'Sara Malik',
    studentId: '2024-1102',
    courseCode: 'MATH-202: Calculus II',
    courseSection: 'Section C (4 Credits)',
    reason: 'Time conflict override. Student has permission to join late for lab sessions.',
    stakeholders: [
      { initials: 'AK', color: 'bg-[#8691A7] text-[#E0E3E5]' },
    ],
    status: 'pending',
  },
  {
    _id: 'rev003',
    studentName: 'Zubair Khan',
    studentId: '2024-0045',
    courseCode: 'ENG-101: Composition',
    courseSection: 'Section B (3 Credits)',
    reason: 'Credit limit increase request (21 credits total). CGPA check required.',
    stakeholders: [
      { initials: 'MA', color: 'bg-[#4D8EFF] text-[#E0E3E5]' },
    ],
    status: 'pending',
  },
];

export const registrationStats = {
  totalRequests: 1402,
  pendingApproval: 42,
  autoEnrolled: 1280,
  rejected: 80,
  isWindowOpen: true,
  semesterName: 'Spring 2024',
};
