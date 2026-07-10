const adminService = require("../services/adminService");

exports.getDashboard = async (req, res) => {
  try {
    const dashboard = await adminService.getDashboard();
    res.status(200).json({ success: true, data: dashboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const role = req.query.role;
    const result = await adminService.getUsers(page, limit, role);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString() && req.body.role) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot change your own role" });
    }
    const user = await adminService.updateUser(req.params.id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await adminService.getComplaints(page, limit);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await adminService.updateComplaint(
      req.params.complaintId,
      req.body,
    );
    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateSemester = async (req, res) => {
  try {
    const semester = await adminService.updateSemester(
      req.params.id,
      req.body,
    );
    res.status(200).json({ success: true, data: semester });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.manualEnroll = async (req, res) => {
  try {
    const { studentUserId, offeringId } = req.body;
    const enrollment = await adminService.manualEnroll(
      studentUserId,
      offeringId,
    );
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await adminService.getSettings();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await adminService.updateSettings(req.body);
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
