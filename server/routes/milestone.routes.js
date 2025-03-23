const express = require("express");
const router = express.Router({ mergeParams: true }); // Important for nested routes
const submissionRoutes = require("./submission.routes");
const auth = require("../middleware/auth");
const {
  getMilestones,
  getMilestone,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  startMilestone,
  // Add other milestone controller functions
} = require("../controllers/milestoneController");

// Re-route into submission router
router.use("/:milestoneId/submissions", submissionRoutes);

// Get all milestones for a project
router.route("/")
  .get(getMilestones)
  .post(auth, createMilestone);

// Single milestone routes
router.route("/:id")
  .get(getMilestone)
  .put(auth, updateMilestone)
  .delete(auth, deleteMilestone);

// Special milestone actions
router.route("/:id/start")
  .put(auth, startMilestone);

module.exports = router;