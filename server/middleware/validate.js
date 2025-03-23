const { validationResult } = require("express-validator");

/**
 * Validation middleware
 * @param {Array} validations - Array of express-validator validation rules
 * @returns {Function} - Express middleware function
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    // Format validation errors
    const formattedErrors = errors.array().map((error) => ({
      param: error.param,
      message: error.msg,
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  };
};

module.exports = validate;