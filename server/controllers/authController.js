const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const logger = require("../config/logger");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "freelancer",
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};


// @desc    Authenticate user/signup with Google OAuth
// @route   POST /api/auth/google-signup
// @access  Public
exports.googleSignUp = async (req, res) => {
  try {
    const { name, email, googleId, picture, role } = req.body;

    // Validate input
    if (!name || !email || !googleId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate role if provided
    if (role && !['freelancer', 'employer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });

    // If user doesn't exist, create new user
    if (!user) {
      // Generate a random password as a fallback
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(googleId, salt);

      user = new User({
        name,
        email,
        password: hashedPassword,
        googleId,
        profileImage: picture,
        role: role || 'freelancer', // Default to freelancer if no role provided
        isGoogleUser: true
      });

      await user.save();
    } else {
      // Update existing user's information if needed
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (picture && !user.profileImage) {
        user.profileImage = picture;
      }
      if (role && !user.role) {
        user.role = role;
      }
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Respond with user info and token
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });

  } catch (error) {
    console.error('Google Signup Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google signup',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user login with Google OAuth
// @route   POST /api/auth/google-login
// @access  Public
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Get the payload from the verified token
    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    // Rest of your existing Google login logic
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    // [... rest of your existing code ...]
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during Google login",
      error: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log("hi");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userData,
  });
};