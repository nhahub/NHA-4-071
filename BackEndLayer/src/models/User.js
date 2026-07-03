const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    universityId: {
      type: String,
      required: [true, "University ID is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // Automatically converts to lowercase
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // 🛡️ SECURITY: By default, passwords are excluded from queries!
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["student", "professor", "advisor", "admin"],
      required: [true, "Role is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false, // 🛡️ SECURITY: Never expose tokens in API responses
    },
  },
  { timestamps: true },
);

// Mongoose Middleware
// This runs automatically BEFORE a user document is saved.
// It hashes the password only if the password field was modified.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // 12 salt rounds is the industry standard for 2024
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance Methods
// We attach a method directly to the user object to check passwords.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
