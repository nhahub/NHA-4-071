const advisorService = require("../services/advisorService");

exports.getProfile = async (req, res) => {
  try {
    const profile = await advisorService.getProfile(req.user.id);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const dashboard = await advisorService.getDashboard(req.user.id);
    res.status(200).json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await advisorService.getStudents(req.user.id, page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSession = async (req, res) => {
  try {
    const session = await advisorService.createSession(req.user.id, req.body);
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await advisorService.getSessions(req.user.id, req.query);
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await advisorService.updateSession(
      req.user.id,
      req.params.sessionId,
      req.body,
    );
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getStudentProgress = async (req, res) => {
  try {
    const progress = await advisorService.getStudentProgress(
      req.user.id,
      req.params.studentId,
    );
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

exports.getGraduationAudit = async (req, res) => {
  try {
    const audit = await advisorService.getGraduationAudit(
      req.user.id,
      req.params.studentId,
    );
    res.status(200).json({ success: true, data: audit });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

exports.getIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await advisorService.getIssues(req.user.id, page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const complaint = await advisorService.updateIssue(
      req.user.id,
      req.params.issueId,
      req.body,
    );
    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
