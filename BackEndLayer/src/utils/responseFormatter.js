const successResponse = (data, statusCode = 200) => {
  return { success: true, data };
};

const errorResponse = (message, statusCode = 400) => {
  return { success: false, message };
};

module.exports = { successResponse, errorResponse };
