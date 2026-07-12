const { z } = require("zod");

const paymentSchema = z.object({
  semesterId: z.string({ required_error: "Semester ID is required" }),
  amount: z.number({ required_error: "Amount is required" }).positive(),
});

module.exports = { paymentSchema };
