const express = require("express");
const {
  createDispute,
  getDisputes,
  getDispute,
  addMessage,
  resolveDispute,
} = require("../controllers/disputeController");

const router = express.Router({ mergeParams: true });

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.route("/").get(auth, getDisputes);

router.route("/:id").get(auth, getDispute);

router.route("/:id/messages").post(auth, addMessage);

router.route("/:id/resolve").put(auth, roleCheck("admin"), resolveDispute);

// For creating disputes from milestone routes
// Add this to milestone.routes.js:
// router.route('/:milestoneId/disputes').post(auth, createDispute);

module.exports = router;