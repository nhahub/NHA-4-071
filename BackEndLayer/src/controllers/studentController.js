const studentService = require("../services/studentService");

exports.getProfile = async (req, res) => {
  try {
    const profile = await studentService.getProfile(req.user.id);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await studentService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await studentService.getSettings(req.user.id);
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await studentService.updateSettings(req.user.id, req.body);
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const dashboardData = await studentService.getDashboard(req.user.id);
    res.status(200).json({ success: true, data: dashboardData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourseCatalog = async (req, res) => {
  try {
    const courses = await studentService.getCourseCatalog();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const schedule = await studentService.getSchedule(req.user.id);
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGrades = async (req, res) => {
  try {
    const grades = await studentService.getGrades(req.user.id);
    res.status(200).json({ success: true, data: grades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await studentService.getPayments(req.user.id);
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await studentService.getMyEnrollments(req.user.id);
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await studentService.getMyComplaints(req.user.id);
    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyAdvisingSessions = async (req, res) => {
  try {
    const sessions = await studentService.getMyAdvisingSessions(req.user.id);
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMyAdvisingSession = async (req, res) => {
  try {
    const session = await studentService.createMyAdvisingSession(req.user.id, req.body);
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await studentService.getNotifications(req.user.id);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await studentService.markNotificationRead(req.user.id, req.params.notificationId);
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const attendance = await studentService.getStudentAttendance(req.user.id);
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExams = async (req, res) => {
  try {
    const exams = await studentService.getExams(req.user.id);
    res.status(200).json({ success: true, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTranscript = async (req, res) => {
  try {
    const transcript = await studentService.getTranscript(req.user.id);
    res.status(200).json({ success: true, data: transcript });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudyPlan = async (req, res) => {
  try {
    const plan = await studentService.getStudyPlan(req.user.id);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitSemesterRegistration = async (req, res) => {
  try {
    const result = await studentService.submitSemesterRegistration(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSemesterRegistrationInfo = async (req, res) => {
  try {
    const info = await studentService.getSemesterRegistrationInfo(req.user.id);
    res.status(200).json({ success: true, data: info });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.saveGpaCalculation = async (req, res) => {
  try {
    const result = await studentService.saveGpaCalculation(req.user.id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
