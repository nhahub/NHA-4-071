const professorService = require("../services/professorService");

exports.getProfile = async (req, res) => {
  try {
    const profile = await professorService.getProfile(req.user.id);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.getMyOfferings = async (req, res) => {
  try {
    const offerings = await professorService.getMyOfferings(req.user.id);
    res.status(200).json({ success: true, data: offerings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOfferingStudents = async (req, res) => {
  try {
    const students = await professorService.getOfferingStudents(
      req.user.id,
      req.params.offeringId,
    );
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message }); // 403 for unauthorized
  }
};

exports.submitGrade = async (req, res) => {
  try {
    const { enrollmentId, grade } = req.body;
    const enrollment = await professorService.submitGrade(
      req.user.id,
      enrollmentId,
      grade,
    );
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
