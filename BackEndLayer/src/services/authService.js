const mongoose = require("mongoose");
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

  // 2. Start MongoDB Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3. Create Base User
    const [newUser] = await User.create(
      [{ name, email, universityId, password, role }],
      { session },
    );

    // 4. Create Role-Specific Profile based on the enum
    let roleProfile;
    if (role === "student") {
      roleProfile = await Student.create([{ userId: newUser._id }], {
        session,
      });
    } else if (role === "professor") {
      roleProfile = await Professor.create([{ userId: newUser._id }], {
        session,
      });
    } else if (role === "advisor") {
      roleProfile = await Advisor.create([{ userId: newUser._id }], {
        session,
      });
    }
    // Note: Admins might just exist in the User model, or you can add an Admin model later.

    // 5. Commit Transaction (Save to DB permanently)
    await session.commitTransaction();
    session.endSession();

    return { user: newUser, roleProfile: roleProfile ? roleProfile[0] : null };
  } catch (error) {
    // If anything fails, undo all database changes!
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/**
 * LOGIN SERVICE
 * Verifies credentials and issues JWTs.
 */
exports.loginUser = async (universityId, password, res) => {
  // 1. Find user. We MUST use .select('+password') because we hid it in the schema!
  const user = await User.findOne({ universityId }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials"); // Don't say "User not found" (gives hackers info)
  }

  // 2. Check if password matches (using the method we created on the User model)
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
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

module.exports = {
  registerUser: exports.registerUser,
  loginUser: exports.loginUser,
  getMe: exports.getMe,
  logoutUser: exports.logoutUser,
};
