const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../src/config/db");
connectDB();

const app = require("../src/app");

module.exports = app;
