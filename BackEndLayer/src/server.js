const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware to parse incoming JSON data
// A Senior Engineer knows that without this, req.body will be undefined.
app.use(express.json());

// A simple health check route (Good practice for production monitoring)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Morshed API is running!" });
});

// Define the Port
const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in development mode on port ${PORT}`);
});

// Senior Engineer Move: Handle unhandled promise rejections globally.
// This prevents the app from silently hanging if a DB connection drops later.
process.on("unhandledRejection", (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
