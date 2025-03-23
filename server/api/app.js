const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const path = require("path");
const config = require("../config/env");
const errorHandler = require("../middleware/errorHandler");
const twoFactorRoutes = require("../routes/twoFactorAuth.routes");
const app = express();

const allowedOrigins = [process.env.FRONTEND_URL.trim()];

app.use(helmet({crossOriginOpenerPolicy: { policy: 'unsafe-none' }},{crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }}));
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
    ],
    credentials: true,
  })
);
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  return res.sendStatus(204);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", twoFactorRoutes);
// File upload middleware
app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max
    },
    abortOnLimit: true,
    responseOnLimit: "File size limit exceeded (10MB)",
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Request logging
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/auth", require("../routes/auth.routes"));
app.use("/api/users", require("../routes/user.routes"));
app.use("/api/projects", require("../routes/project.routes"));
app.use("/api/milestones", require("../routes/milestone.routes"));
app.use("/api/submissions", require("../routes/submission.routes"));
app.use("/api/payments", require("../routes/payment.routes"));
app.use("/api/ethereum", require("../routes/ethereum.routes"));
app.use("/api/disputes", require("../routes/dispute.routes"));
app.use("/api/reviews", require("../routes/review.routes"));
app.use("/api/notifications", require("../routes/notification.routes"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to FreeLance Fair API" });
});

app.use(errorHandler);

module.exports = app;
