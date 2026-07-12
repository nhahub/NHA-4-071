const userToResponseDTO = (user) => ({
  _id: user._id,
  universityId: user.universityId,
  email: user.email,
  role: user.role,
  name: user.name,
  isActive: user.isActive,
});

const loginResponseDTO = (user, accessToken) => ({
  user: userToResponseDTO(user),
  token: accessToken,
});

module.exports = { userToResponseDTO, loginResponseDTO };
