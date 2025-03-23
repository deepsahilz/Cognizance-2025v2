const express = require("express");
const {
  getSubmissions,
  getSubmission,
  createSubmission,
  reviewSubmission,
  triggerAIVerification,
  overrideAIVerification,
} = require("../controllers/submissionController");

const router = express.Router({ mergeParams: true });

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.route("/").get(auth, getSubmissions).post(auth, createSubmission);

router.route("/:id").get(auth, getSubmission);

router.route("/:id/review").put(auth, reviewSubmission);

// New AI verification routes
router.route("/:id/verify").post(auth, triggerAIVerification);

router
  .route("/:id/verify/override")
  .put(auth, roleCheck("admin"), overrideAIVerification);

module.exports = router;