const express = require("express");
const {
  createReview,
  getProjectReviews,
  getUserReviews,
  getReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router({ mergeParams: true });

const auth = require("../middleware/auth");

// Routes for /api/reviews
router.route("/:id").get(getReview).delete(auth, deleteReview);

// Routes for /api/projects/:projectId/reviews
// Add to project.routes.js: router.use('/:projectId/reviews', reviewRouter);
router.route("/").get(getProjectReviews).post(auth, createReview);

// Routes for /api/users/:userId/reviews
// Add to user.routes.js: router.use('/:userId/reviews', reviewRouter);
// Add a condition to handle this route in getUserReviews

module.exports = router;