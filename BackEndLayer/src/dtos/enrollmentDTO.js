const enrollmentToResponseDTO = (enrollment) => ({
  _id: enrollment._id,
  studentId: enrollment.studentId,
  courseId: enrollment.courseId,
  offeringId: enrollment.offeringId,
  status: enrollment.status,
  grade: enrollment.grade,
  createdAt: enrollment.createdAt,
});

module.exports = { enrollmentToResponseDTO };
