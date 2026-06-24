export const transcripts = [
  {
    _id: "t1", studentId: "stu001", program: "B.Sc. Computer Science", degree: "B.Sc.", department: "Computer Science",
    semesters: [
      {
        name: "Fall 2022", gpa: 3.2, totalCredits: 9,
        courses: [
          { code: "CS101", name: "Intro to Programming", credits: 3, grade: "B+" },
          { code: "MATH101", name: "Calculus I", credits: 3, grade: "B" },
          { code: "ENG101", name: "English Composition", credits: 3, grade: "A-" },
        ],
      },
      {
        name: "Spring 2023", gpa: 3.4, totalCredits: 9,
        courses: [
          { code: "CS201", name: "Object-Oriented Programming", credits: 3, grade: "A-" },
          { code: "MATH201", name: "Linear Algebra", credits: 3, grade: "B+" },
          { code: "CS210", name: "Discrete Mathematics", credits: 3, grade: "A" },
        ],
      },
      {
        name: "Summer 2024", gpa: 3.8, totalCredits: 9,
        courses: [
          { code: "CS301", name: "Data Structures", credits: 3, grade: "A" },
          { code: "CS302", name: "Algorithms", credits: 3, grade: "B+" },
          { code: "CS303", name: "Software Engineering", credits: 3, grade: "A" },
        ],
      },
    ],
  },
];