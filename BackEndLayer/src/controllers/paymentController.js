const paymentService = require("../services/paymentService");

exports.makePayment = async (req, res) => {
  try {
    const result = await paymentService.makePayment(req.user.id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await paymentService.getMyPayments(req.user.id);
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPaymentSummary = async (req, res) => {
  try {
    const summary = await paymentService.getPaymentSummary(req.user.id);
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
