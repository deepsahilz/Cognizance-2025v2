const winston = require("winston");
const config = require("./env");

const logger = winston.createLogger({
  level: config.NODE_ENV === "development" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "freelance-fair-api" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Remove file transports because Vercel does not allow file writes
// if (config.NODE_ENV !== "production") {
//   logger.add(
//     new winston.transports.File({ filename: "logs/error.log", level: "error" })
//   );
//   logger.add(new winston.transports.File({ filename: "logs/combined.log" }));
// }

module.exports = logger;