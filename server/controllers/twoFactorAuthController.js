const User = require("../models/User");
const TwoFactorAuth = require("../models/TwoFactorAuth");
const { send2FAEmail } = require("../config/nodemailer");
const jwt = require("jsonwebtoken");

// @desc    Initiate 2FA Login
// @route   POST /api/auth/2fa/initiate
// @access  Public
exports.initiate2FALogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and verify credentials
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if 2FA is enabled
    if (!user.twoFactorEnabled) {
      // Direct login if 2FA is off
      const token = user.getSignedJwtToken();
      return res.status(200).json({
        success: true,
        token,
        twoFactorRequired: false,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create or update 2FA record
    await TwoFactorAuth.findOneAndDelete({ user: user._id });
    const twoFactorAuth = new TwoFactorAuth({
      user: user._id,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      verified: false,
    });
    await twoFactorAuth.save();

    // Send OTP via email
    await send2FAEmail(user.email, otp);

    // Generate temporary token
    const tempToken = jwt.sign(
      { userId: user._id, twoFactorPending: true },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.status(200).json({
      success: true,
      tempToken,
      twoFactorRequired: true,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify 2FA OTP
// @route   POST /api/auth/2fa/verify
// @access  Public
exports.verify2FA = async (req, res, next) => {
  try {
    const { otp, tempToken } = req.body;

    // Verify temporary token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

    // Find 2FA record
    const twoFactorAuth = await TwoFactorAuth.findOne({
      user: decoded.userId,
      otp,
      otpExpires: { $gt: new Date() },
    });

    if (!twoFactorAuth) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);

    // Generate final token
    const token = user.getSignedJwtToken();

    // Optional: Delete 2FA record
    await TwoFactorAuth.findByIdAndDelete(twoFactorAuth._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};