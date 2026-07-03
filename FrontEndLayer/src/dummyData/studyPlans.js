export const studyPlans = [
  {
    _id: "sp1", studentId: "stu001", degreeName: "B.S. in Computer Science", departmentName: "Computer Science",
    years: [
      {
        year: "Year 1",
        semesters: [
          {
            name: "Fall 2022",
            courses: [
              { code: "CS101", name: "Intro to Programming", credits: 3, completed: true },
              { code: "MATH101", name: "Calculus I", credits: 3, completed: true },
              { code: "ENG101", name: "English Composition", credits: 3, completed: true },
            ],
          },
          {
            name: "Spring 2023",
            courses: [
              { code: "CS201", name: "OOP", credits: 3, completed: true },
              { code: "MATH201", name: "Linear Algebra", credits: 3, completed: true },
              { code: "CS210", name: "Discrete Math", credits: 3, completed: true },
            ],
          },
        ],
      },
      {
        year: "Year 2",
        semesters: [
          {
            name: "Fall 2023",
            courses: [
              { code: "CS301", name: "Data Structures", credits: 3, completed: true },
              { code: "CS302", name: "Algorithms", credits: 3, completed: true },
              { code: "CS303", name: "Software Engineering", credits: 3, completed: true },
            ],
          },
          {
            name: "Spring 2024",
            courses: [
              { code: "CS304", name: "Operating Systems", credits: 3, completed: false },
              { code: "CS305", name: "Computer Networks", credits: 3, completed: true },
              { code: "MATH301", name: "Statistics", credits: 3, completed: true },
            ],
          },
        ],
      },
      {
        year: "Year 3",
        semesters: [
          {
            name: "Fall 2024",
            courses: [
              { code: "CS401", name: "Machine Learning", credits: 3, completed: false },
              { code: "CS402", name: "Database Systems", credits: 3, completed: false },
              { code: "CS403", name: "Software Project", credits: 3, completed: false },
            ],
          },
        ],
      },
    ],
  },
];