export const reportsData = {
  metrics: {
    totalEnrollment: { value: "12,482", change: "+4.2%", isPositive: true },
    avgGpa: { value: "3.42", change: "+0.14", isPositive: true },
    retentionRate: { value: "94.8%", change: "+1.8%", isPositive: true },
    graduationRate: { value: "88.2%", change: "-0.5%", isPositive: false },
  },
  enrollmentTrends: [
    { year: "2019-20", students: 8400 },
    { year: "2020-21", students: 9200 },
    { year: "2021-22", students: 10100 },
    { year: "2022-23", students: 11300 },
    { year: "2023-24", students: 12482 },
  ],
  gpaByDepartment: [
    { name: "Engineering", gpa: 3.82, width: 92 },
    { name: "Science", gpa: 3.64, width: 86 },
    { name: "Humanities", gpa: 3.51, width: 80 },
    { name: "Business", gpa: 3.75, width: 88 },
    { name: "Applied Arts", gpa: 3.88, width: 94 },
  ],
  institutionalGrowth: [
    { id: 1, faculty: "Faculty of Technology", students: "4,250", gradRate: "3.85", trend: "+12.4%", isPositive: true },
    { id: 2, faculty: "Business School", students: "3,100", gradRate: "3.72", trend: "+8.1%", isPositive: true },
    { id: 3, faculty: "Health Sciences", students: "2,480", gradRate: "3.88", trend: "-2.3%", isPositive: false },
    { id: 4, faculty: "School of Arts", students: "950", gradRate: "3.65", trend: "+3.6%", isPositive: true },
  ],
};
