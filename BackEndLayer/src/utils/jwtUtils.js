const jwt = require("jsonwebtoken");

// 🧠 MENTOR MOMENT: Dual Token Strategy
// Access Token: Short lived (15m). Used to access protected API routes.
// Refresh Token: Long lived (7d). Used ONLY to get a new Access Token.
const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET, // We will add this to .env
    { expiresIn: "7d" },
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
