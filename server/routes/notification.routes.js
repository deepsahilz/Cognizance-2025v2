const express = require("express");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

const auth = require("../middleware/auth");

router.use(auth); // All notification routes require authentication

router.route("/").get(getNotifications);

router.route("/read").put(markAsRead);

router.route("/read-all").put(markAllAsRead);

router.route("/:id").delete(deleteNotification);

module.exports = router;