const studentProfileToResponseDTO = (student) => ({
  _id: student._id,
  userId: student.userId,
  departmentId: student.departmentId,
  advisorId: student.advisorId,
  GPA: student.GPA,
  level: student.level,
  program: student.program,
});

module.exports = { studentProfileToResponseDTO };
