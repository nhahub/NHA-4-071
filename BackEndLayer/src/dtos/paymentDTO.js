const paymentToResponseDTO = (payment) => ({
  _id: payment._id,
  studentId: payment.studentId,
  semesterId: payment.semesterId,
  amount: payment.amount,
  status: payment.status,
  createdAt: payment.createdAt,
});

module.exports = { paymentToResponseDTO };
