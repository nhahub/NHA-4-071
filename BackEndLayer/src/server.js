const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// 🛡️ SECURITY MIDDLEWARE
app.use(helmet()); // Sets secure HTTP headers
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
const enrollmentRoutes = require("./routes/enrollmentRoutes");

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api", universityRoutes); // (Mounts at /api/departments, /api/courses, etc.)
app.use("/api/enrollments", enrollmentRoutes); // POST /api/enrollments

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
