const express = require("express");
const {
  getPayment,
  getUserPayments,
} = require("../controllers/paymentController");

const router = express.Router();

const auth = require("../middleware/auth");

// Basic payment retrieval routes
router.get("/", auth, getUserPayments);
router.get("/:id", auth, getPayment);

module.exports = router;
