// This is a higher-order function. It takes our Zod schema and returns an Express middleware.
const validate = (schema) => async (req, res, next) => {
  try {
    // We parse the body. If it fails, Zod throws an error.
    const parsedBody = await schema.parseAsync(req.body);

    // If successful, replace req.body with the sanitized/parsed data
    req.body = parsedBody;
    next(); // Move to the next middleware/controller
  } catch (error) {
    // Formatting Errors
    // Zod gives us a very detailed error. We format it to be user-friendly.
    const errors = error.errors.map((err) => ({
      field: err.path.join("."),
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
