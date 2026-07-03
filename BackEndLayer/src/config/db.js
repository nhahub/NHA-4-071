const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database Atlas using Mongoose.
 * We separate this so our server.js doesn't get cluttered.
 */
const connectDB = async () => {
  try {
    // We read the URI from the environment variables.
    const mongoURI = process.env.MONGO_URI;

    // Safety check: If the .env file is missing the URI, crash early with a clear message.
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in the .env file!");
    }

    // Options to handle Atlas deprecation warnings
    const conn = await mongoose.connect(mongoURI, {
      // These prevent common warning messages in the console when connecting to Atlas
      serverSelectionTimeoutMS: 5000, // Timeout if Atlas doesn't respond in 5 seconds
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // if the database fails, the API is useless.
    // We force the process to crash so we know immediately.
    process.exit(1);
  }
};

module.exports = connectDB;