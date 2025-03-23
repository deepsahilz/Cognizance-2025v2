const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");
const User = require("../models/User");
const advancedResults = require("../middleware/AdvancedResults");

// Public routes
// For freelancers - pass null as populate param, and filter as third param
router.get("/freelancers", advancedResults(User, null, { role: "freelancer" }), userController.getFreelancers);

// For employers - pass null as populate param, and filter as third param
router.get("/employers", advancedResults(User, null, { role: "employer" }), userController.getEmployers);

router.get("/profile/:userId", userController.getPublicProfile);

// Protected routes - Both roles
router.get("/me", auth, userController.getCurrentUser);
router.put("/me", auth, userController.updateProfile);
router.put("/me/password", auth, userController.updatePassword);
router.post("/me/avatar", auth, userController.uploadAvatar);

// User portfolio routes
router.get("/:userId/portfolio", userController.getUserPortfolio);
router.post("/me/portfolio", auth, userController.addPortfolioItem);
router.put(
  "/me/portfolio/:itemId",
  auth,
  userController.updatePortfolioItem
);
router.delete(
  "/me/portfolio/:itemId",
  auth,
  userController.deletePortfolioItem
);

// User skills routes
router.get("/:userId/skills", userController.getUserSkills);
router.post("/me/skills", auth, userController.addSkill);
router.delete("/me/skills/:skillId", auth, userController.removeSkill);

// User reviews
router.get("/:userId/reviews", userController.getUserReviews);

// Connection/follow/save routes
router.post("/save/:userId", auth, userController.saveUser);
router.delete("/save/:userId", auth, userController.unsaveUser);
router.get("/me/saved", auth, userController.getSavedUsers);

// Admin routes
// router.get('/', [auth, admin], userController.getAllUsers);
// router.delete('/:userId', [auth, admin], userController.deleteUser);

module.exports = router;