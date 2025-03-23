const express = require("express");
const {
  register,
  googleSignUp,
  login,
  googleLogin,
  getMe,
  logout,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

const router = express.Router();
router.post("/register", register);
router.post("/google-signup", googleSignUp);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.get("/me", auth, getMe);
router.get("/logout", auth, logout);

// Add Google Signup Route
router.post("/google-signup", (req, res) => {
  res.json({ message: "Google signup successful!" });
});

module.exports = router;
