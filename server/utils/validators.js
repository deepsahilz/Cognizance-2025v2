const { body, param, query } = require("express-validator");

/**
 * Common validation rules
 */
const validators = {
  // Auth validators
  register: [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please include a valid email")
      .normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["freelancer", "employer"])
      .withMessage("Role must be either freelancer or employer"),
  ],

  login: [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please include a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  // Project validators
  createProject: [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 5, max: 100 })
      .withMessage("Title must be between 5 and 100 characters"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 20 })
      .withMessage("Description must be at least 20 characters"),
    body("budget")
      .notEmpty()
      .withMessage("Budget is required")
      .isNumeric()
      .withMessage("Budget must be a number")
      .toFloat()
      .isFloat({ min: 1 })
      .withMessage("Budget must be greater than 0"),
    body("currency")
      .default("USD")
      .isLength({ min: 3, max: 3 })
      .withMessage("Currency must be a 3-letter code"),
    body("deadline")
      .notEmpty()
      .withMessage("Deadline is required")
      .isISO8601()
      .toDate()
      .withMessage("Deadline must be a valid date"),
  ],

  // Milestone validators
  createMilestone: [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 5, max: 100 })
      .withMessage("Title must be between 5 and 100 characters"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 20 })
      .withMessage("Description must be at least 20 characters"),
    body("amount")
      .notEmpty()
      .withMessage("Amount is required")
      .isNumeric()
      .withMessage("Amount must be a number")
      .toFloat()
      .isFloat({ min: 1 })
      .withMessage("Amount must be greater than 0"),
    body("dueDate")
      .notEmpty()
      .withMessage("Due date is required")
      .isISO8601()
      .toDate()
      .withMessage("Due date must be a valid date"),
  ],

  // Submission validators
  createSubmission: [
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters"),
  ],

  reviewSubmission: [
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isIn(["approved", "rejected", "revision-requested"])
      .withMessage("Invalid status"),
  ],

  // Payment validators
  createEscrowPayment: [
    body("milestoneId")
      .notEmpty()
      .withMessage("Milestone ID is required")
      .isMongoId()
      .withMessage("Invalid milestone ID format"),
  ],

  // Dispute validators
  createDispute: [
    body("reason")
      .notEmpty()
      .withMessage("Reason is required")
      .isLength({ min: 5 })
      .withMessage("Reason must be at least 5 characters"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 20 })
      .withMessage("Description must be at least 20 characters"),
  ],

  // Review validators
  createReview: [
    body("rating")
      .notEmpty()
      .withMessage("Rating is required")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .notEmpty()
      .withMessage("Comment is required")
      .isLength({ min: 5 })
      .withMessage("Comment must be at least 5 characters"),
  ],

  // Common ID parameter validator
  idParam: [
    param("id")
      .notEmpty()
      .withMessage("ID is required")
      .isMongoId()
      .withMessage("Invalid ID format"),
  ],

  // Pagination validators
  pagination: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer")
      .toInt(),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100")
      .toInt(),
  ],
};

module.exports = validators;