const express = require("express");
const router = express.Router();
const {
  initiate2FALogin,
  verify2FA,
} = require("../controllers/twoFactorAuthController");
const { protect } = require("../middleware/auth");

router.post("/2fa/initiate", initiate2FALogin);
router.post("/2fa/verify", verify2FA);

module.exports = router;
