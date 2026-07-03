const authService = require("../services/authService");

exports.register = async (req, res, next) => {
  try {
    const { user, roleProfile } = await authService.registerUser(req.body);

    // Formatting to match Frontend `RegisterRequestSchema` & `UserSchema`
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        universityId: user.universityId,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        name: user.name,
      },
    });
  } catch (error) {
    // Standardized Error Handling
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { universityId, password } = req.body;
    const { accessToken, user } = await authService.loginUser(
      universityId,
      password,
      res,
    );

    // Formatting to match Frontend `LoginResponseSchema`
    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          universityId: user.universityId,
          email: user.email,
          role: user.role,
          name: user.name,
          isActive: user.isActive,
        },
      },
      token: accessToken, // Frontend will store this in memory
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

/**
 * GET CURRENT USER
 * The 'protect' middleware attaches req.user, so we just return it.
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = req.user; // Attached by our authMiddleware 'protect'

    // Format to match Frontend LoginResponseSchema
    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          universityId: user.universityId,
          email: user.email,
          role: user.role,
          name: user.name,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * LOGOUT
 */
exports.logout = async (req, res, next) => {
  try {
    // We'll add proper protection later, but for now, we need the user ID to clear the DB token
    // In a real scenario, req.user will exist because of the 'protect' middleware
    await authService.logoutUser(req.user?._id, res);

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
