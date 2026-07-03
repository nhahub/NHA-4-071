const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * 🛡️ PROTECT MIDDLEWARE
 * Verifies the JWT Access Token sent from the frontend.
 * If valid, it attaches the user to the request object (req.user) and moves on.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token (Format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID inside the token, and attach it to the request.
      // We exclude the password and refreshToken for security!
      req.user = await User.findById(decoded.id).select(
        "-password -refreshToken",
      );

      if (!req.user) {
        return res
          .status(401)
          .json({
            success: false,
            message: "Not authorized, user no longer exists",
          });
      }

      next(); // User is verified, proceed to the controller!
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token provided" });
  }
};

/**
 * 🛡️ RBAC MIDDLEWARE (Role-Based Access Control)
 * Usage: authorize('admin'), authorize('student', 'professor')
 * Must be used AFTER the protect middleware, because it relies on req.user
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next(); // User has the correct role, proceed!
  };
};

module.exports = { protect, authorize };
