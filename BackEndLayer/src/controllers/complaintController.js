const complaintService = require("../services/complaintService");

exports.createComplaint = async (req, res) => {
  try {
    const complaint = await complaintService.createComplaint(
      req.user.id,
      req.body,
    );
    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await complaintService.getMyComplaints(req.user.id);
    res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
