const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("../models/User");
const Student = require("../models/Student");
const Professor = require("../models/Professor");
const Advisor = require("../models/Advisor");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwtUtils");

/**
 * REGISTER SERVICE
 * Uses a MongoDB Transaction to ensure User and Role profile are created together.
 */
exports.registerUser = async (userData) => {
  const { name, email, universityId, password, role } = userData;

  // 1. Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { universityId }],
  });
  if (existingUser) {
    throw new Error("User with this email or University ID already exists");
  }

  // 3. Create Base User
  console.log('Register: Creating user with email', email, 'universityId', universityId);
  const newUser = await User.create({ name, email, universityId, password, role });
  console.log('Register: Created user ID', newUser._id);

  // 4. Create Role-Specific Profile based on the enum
  try {
    if (role === "student") {
      await Student.create({ userId: newUser._id });
    } else if (role === "professor") {
      await Professor.create({ userId: newUser._id });
    } else if (role === "advisor") {
      await Advisor.create({ userId: newUser._id });
    }
  } catch (err) {
    // Rollback: remove the created user to avoid orphan records
    await User.findByIdAndDelete(newUser._id);
    throw err;
  }

  return { user: newUser };
};

/**
 * LOGIN SERVICE
 * Verifies credentials and issues JWTs.
 */
exports.loginUser = async (universityId, password, res) => {
  // 1. Find user. We MUST use .select('+password') because we hid it in the schema!
  console.log('Login: Looking up user with universityId', universityId);
  const user = await User.findOne({ $or: [{ universityId }, { email: universityId }] }).select("+password");
  console.log('Login: User found?', !!user);

  if (!user) {
    console.log('Login: User not found');
    throw new Error("Invalid credentials"); // Don't say "User not found" (gives hackers info)
  }

  // 2. Check if password matches (using the method we created on the User model)
  const isMatch = await user.matchPassword(password);
  console.log('Login: Password match?', isMatch);
  if (!isMatch) {
    console.log('Login: Invalid password');
    throw new Error("Invalid credentials");
  }

  // 3. Generate Tokens
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // 4. Save Refresh Token to Database (for validation later)
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false }); // Skip password validation on save

  // 5. 🛡️ SECURITY: Send Refresh Token as HttpOnly Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Cannot be accessed by client-side JS (XSS safe)
    secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // 6. Return Access Token and User data to frontend
  return { accessToken, user };
};

/**
 * GET CURRENT USER SERVICE
 * Used when the frontend refreshes the page to restore the Redux state.
 */
exports.getMe = async (userId) => {
  // We just need to fetch the user. The 'protect' middleware already verified the token.
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

/**
 * LOGOUT SERVICE
 * Clears the refresh token in the database and expires the cookie.
 */
exports.logoutUser = async (userId, res) => {
  // 1. Clear the refresh token from the database
  await User.findByIdAndUpdate(userId, { refreshToken: null });

  // 2. Expire the HttpOnly cookie on the frontend
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
    secure: process.env.NODE_ENV === "production",
  });
};

/**
 * FORGOT PASSWORD SERVICE
 * Generates a reset token, hashes it, and stores it with an expiry on the user record.
 * Returns the unhashed token (for testing — in production this would be emailed).
 */
exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User with that email does not exist");
  }

  // Generate a random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token and save to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  // Return the unhashed token (for testing/development)
  return { resetToken };
};

/**
 * RESET PASSWORD SERVICE
 * Validates the reset token and updates the password.
 */
exports.resetPassword = async (token, newPassword) => {
  // Hash the incoming token to match what's stored in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  // Set the new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return { message: "Password reset successful" };
};

/**
 * CHANGE PASSWORD SERVICE
 * Verifies the current password and updates to a new one.
 */
exports.changePassword = async (userId, currentPassword, newPassword) => {
  // Fetch user with password field included
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully" };
};

module.exports = {
  registerUser: exports.registerUser,
  loginUser: exports.loginUser,
  getMe: exports.getMe,
  logoutUser: exports.logoutUser,
  forgotPassword: exports.forgotPassword,
  resetPassword: exports.resetPassword,
  changePassword: exports.changePassword,
};
