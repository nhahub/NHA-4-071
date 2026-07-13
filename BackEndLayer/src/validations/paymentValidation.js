const { z } = require("zod");

const paymentSchema = z.object({
  semesterId: z.string({ required_error: "Semester ID is required" }),
  paymentMethod: z.enum(["credit_card", "debit_card", "bank_transfer", "cash", "online"]).optional(),
});

module.exports = { paymentSchema };
