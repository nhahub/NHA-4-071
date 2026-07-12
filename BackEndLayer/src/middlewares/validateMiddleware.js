const validate = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody;
    next();
  } catch (error) {
    const issues = error.errors || error.issues || [];
    const errors = issues.map((err) => ({
      field: err.path?.join(".") || "",
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }
};

module.exports = validate;
