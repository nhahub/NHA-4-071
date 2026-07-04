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
