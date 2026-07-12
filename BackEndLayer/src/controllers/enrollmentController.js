const enrollmentService = require("../services/enrollmentService");

exports.enroll = async (req, res) => {
  try {
    // Pass req.body.courseId instead of req.body.offeringId
    const enrollment = await enrollmentService.enrollCourse(
      req.user.id,
      req.body.courseId,
    );
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getMyEnrollments(req.user.id);
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.dropCourse = async (req, res) => {
  try {
    const enrollment = await enrollmentService.dropCourse(
      req.user.id,
      req.params.id,
    );
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
