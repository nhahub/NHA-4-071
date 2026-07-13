const crypto = require("crypto");
const Payment = require("../models/Payment");
const Student = require("../models/Student");
const Semester = require("../models/Semester");
const Setting = require("../models/Setting");

const generateTransactionId = () => {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString("hex");
  return `TXN-${timestamp}-${random}`.toUpperCase();
};

const formatPayment = (p) => ({
  _id: p._id,
  studentId: p.studentId,
  semesterId: p.semesterId?._id || p.semesterId,
  semesterName: p.semesterId?.name || null,
  description: p.description,
  amount: p.amount,
  paymentMethod: p.paymentMethod,
  transactionId: p.transactionId,
  status: p.status,
  dueDate: p.dueDate,
  paidAt: p.paidAt,
  createdAt: p.createdAt,
});

exports.makePayment = async (studentUserId, paymentData) => {
  const student = await Student.findOne({ userId: studentUserId });
  if (!student) throw new Error("Student profile not found");

  const { semesterId, paymentMethod } = paymentData;

  const existingPayment = await Payment.findOne({
    studentId: student._id,
    semesterId,
    status: { $in: ["pending", "overdue"] },
  });

  if (!existingPayment) {
    throw new Error("No outstanding payment found for this semester. You may have already paid.");
  }

  const now = new Date();
  const transactionId = generateTransactionId();
  const paidAmount = existingPayment.amount;

  existingPayment.status = "paid";
  existingPayment.paymentMethod = paymentMethod;
  existingPayment.transactionId = transactionId;
  existingPayment.paidAt = now;

  await existingPayment.save();

  return {
    transactionId,
    message: `Payment of $${paidAmount} completed successfully.`,
    payment: formatPayment(existingPayment),
  };
};

exports.getMyPayments = async (studentUserId) => {
  const student = await Student.findOne({ userId: studentUserId });
  if (!student) throw new Error("Student profile not found");

  const payments = await Payment.find({ studentId: student._id })
    .populate("semesterId", "name code")
    .sort({ createdAt: -1 });

  return payments.map(formatPayment);
};

exports.getPaymentSummary = async (studentUserId) => {
  const student = await Student.findOne({ userId: studentUserId });
  if (!student) throw new Error("Student profile not found");

  const allPayments = await Payment.find({ studentId: student._id })
    .populate("semesterId", "name code registrationStatus");

  let totalPaid = 0;
  let totalPending = 0;
  let totalOverdue = 0;
  let nextDueDate = null;
  let currentSemesterDue = null;

  for (const p of allPayments) {
    if (p.status === "paid") totalPaid += p.amount;
    else if (p.status === "pending") {
      totalPending += p.amount;
      if (!nextDueDate && p.dueDate) nextDueDate = p.dueDate;
    }
    else if (p.status === "overdue") {
      totalOverdue += p.amount;
      if (!nextDueDate && p.dueDate) nextDueDate = p.dueDate;
    }
  }

  const currentSemester = allPayments.find(
    (p) => p.semesterId?.registrationStatus === "open"
  );
  if (currentSemester) {
    currentSemesterDue = {
      semesterName: currentSemester.semesterId?.name,
      amount: currentSemester.amount,
      status: currentSemester.status,
      dueDate: currentSemester.dueDate,
    };
  }

  const settings = await Setting.findOne({ key: "semesterFee" });
  const semesterFee = settings?.value || 5000;

  return {
    totalPaid,
    totalPending,
    totalOverdue,
    totalDue: totalPending + totalOverdue,
    nextDueDate,
    currentSemesterDue,
    semesterFee,
    paymentCount: allPayments.filter((p) => p.status === "paid").length,
  };
};
