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

exports.createAssignment = async (req, res) => {
  try {
    const assignment = await professorService.createAssignment(
      req.user.id,
      req.body,
    );
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await professorService.getAssignments(
      req.user.id,
      req.params.offeringId,
    );
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const attendance = await professorService.markAttendance(
      req.user.id,
      req.params.offeringId,
      req.body,
    );
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await professorService.getAttendance(
      req.user.id,
      req.params.offeringId,
    );
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const schedule = await professorService.getSchedule(req.user.id);
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const dashboard = await professorService.getDashboard(req.user.id);
    res.status(200).json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGradesOverview = async (req, res) => {
  try {
    const grades = await professorService.getGradesOverview(req.user.id);
    res.status(200).json({ success: true, data: grades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await professorService.getNotifications(req.user.id);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await professorService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPerformance = async (req, res) => {
  try {
    const performance = await professorService.getPerformance(req.user.id);
    res.status(200).json({ success: true, data: performance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
