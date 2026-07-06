const Payment = require("../models/Payment");
const Student = require("../models/Student");
const Semester = require("../models/Semester");

exports.makePayment = async (studentUserId, paymentData) => {
  const student = await Student.findOne({ userId: studentUserId });
  if (!student) throw new Error("Student profile not found");

  // In a real app, here is where you would call Stripe API.
  // For now, we just record the payment as 'paid'.
  const payment = await Payment.create({
    ...paymentData,
    studentId: student._id,
    status: "paid", // Mock auto-success
    createdAt: new Date(),
  });

  return payment;
};

exports.getMyPayments = async (studentUserId) => {
  const student = await Student.findOne({ userId: studentUserId });
  if (!student) throw new Error("Student profile not found");

  const payments = await Payment.find({ studentId: student._id })
    .populate("semesterId", "name code") // 🛡️ Populate semester name!
    .sort({ createdAt: -1 });

  // Frontend expects 'semesterName' directly in the object, let's format it:
  return payments.map((p) => ({
    _id: p._id,
    studentId: p.studentId,
    semesterId: p.semesterId._id,
    semesterName: p.semesterId.name, // Virtual field for frontend
    amount: p.amount,
    status: p.status,
    createdAt: p.createdAt,
  }));
};
