const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// 🛡️ SECURITY MIDDLEWARE
app.use(helmet()); // Sets secure HTTP headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" })); // Body parser, limit payload to prevent DOS attacks
app.use(cookieParser()); // Parse cookies for Refresh Tokens

// 🛡️ RATE LIMITER (Prevent Brute Force on Auth routes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: {
    success: false,
    message: "Too many attempts, please try again after 15 minutes",
  },
});

// Routes (We will create these next)
const authRoutes = require("./routes/authRoutes");
const universityRoutes = require("./routes/universityRoutes");
const courseRoutes = require("./routes/courseRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const studentRoutes = require("./routes/studentRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const professorRoutes = require("./routes/professorRoutes");
const advisorRoutes = require("./routes/advisorRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api", universityRoutes); // (Mounts at /api/departments, /api/courses, etc.)
app.use("/api/courses", courseRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/enrollments", enrollmentRoutes); // POST /api/enrollments
app.use("/api/students", studentRoutes); // Maps to /api/students/profile, etc.
app.use("/api/complaints", complaintRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/professors", professorRoutes);
app.use("/api/advisors", advisorRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Morshed API is running!" });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in development mode on port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
