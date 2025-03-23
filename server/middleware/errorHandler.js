const logger = require("../config/logger");
const config = require("../config/env");

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack });

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: messages,
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: "This record already exists",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
    });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
    stack: config.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;