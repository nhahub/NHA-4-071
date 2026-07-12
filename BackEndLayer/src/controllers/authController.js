const authService = require("../services/authService");
const { userToResponseDTO, loginResponseDTO } = require("../dtos/authDTO");

exports.register = async (req, res, next) => {
  try {
    const { user } = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      data: userToResponseDTO(user),
    });
  } catch (error) {
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

    res.status(200).json({
      success: true,
      data: loginResponseDTO(user, accessToken),
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: { user: userToResponseDTO(user) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user?._id, res);

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { resetToken } = await authService.forgotPassword(email);

    res.status(200).json({
      success: true,
      data: { message: "Reset token generated", token: resetToken },
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);

    res.status(200).json({
      success: true,
      data: { message: result.message },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(
      req.user._id,
      currentPassword,
      newPassword,
    );

    res.status(200).json({
      success: true,
      data: { message: result.message },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
