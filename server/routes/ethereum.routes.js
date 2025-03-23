
const express = require("express");
const {
  createProjectFunding,
  addMilestoneFunding,
  startMilestone,
  submitForReview,
  approveMilestone,
  raiseDispute,
  getTransactionHistory,
} = require("../controllers/ethereumController");

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const router = express.Router();

// Project funding route
router.post(
  "/project/fund",
  auth,
  roleCheck("employer", "admin"),
  createProjectFunding
);

// Milestone funding route
router.post(
  "/milestone/add",
  auth,
  roleCheck("employer", "admin"),
  addMilestoneFunding
);

// Start milestone route (freelancer only)
router.post("/milestone/start", auth, roleCheck("freelancer"), startMilestone);

// Submit for review route (freelancer only)
router.post(
  "/milestone/submit",
  auth,
  roleCheck("freelancer"),
  submitForReview
);

// Approve milestone route (employer/admin only)
router.post(
  "/milestone/approve",
  auth,
  roleCheck("employer", "admin"),
  approveMilestone
);

// Dispute route (any authenticated user)
router.post("/milestone/dispute", auth, raiseDispute);

// Transaction history route
router.get("/transactions/:projectId", auth, getTransactionHistory);

module.exports = router;
