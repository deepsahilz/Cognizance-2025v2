const User = require("../models/User");
const Portfolio = require("../models/Portfolio");
const Skill = require("../models/Skill");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const fs = require("fs");
const path = require("path");
const Review = require("../models/Review");
/**
 * @desc    Get current logged in user
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/me
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
  // Fields to update
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio,
    location: req.body.location,
    website: req.body.website,
    hourlyRate: req.body.hourlyRate,
    title: req.body.title,
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(
    (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update password
 * @route   PUT /api/users/me/password
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse("Please provide current and new password", 400));
  }

  // Find user by ID and make sure password field is included
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Check if the current password matches
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse("Current password is incorrect", 401));
  }

  // Update password and save
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});


/**
 * @desc    Upload user avatar
 * @route   POST /api/users/me/avatar
 * @access  Private
 */
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.avatar) {
    return next(new ErrorResponse("Please upload an image file", 400));
  }

  const file = req.files.avatar;

  // Check if it's an image
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload an image file", 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Image size should be less than ${
          process.env.MAX_FILE_SIZE / 1000000
        }MB`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `user_${req.user.id}_${Date.now()}${path.parse(file.name).ext}`;

  // Move file to upload path
  file.mv(
    `${process.env.FILE_UPLOAD_PATH}/avatars/${file.name}`,
    async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse("Problem with file upload", 500));
      }

      // Delete old avatar if exists
      const user = await User.findById(req.user.id);
      if (user.avatar && user.avatar !== "default-avatar.jpg") {
        const filePath = `${process.env.FILE_UPLOAD_PATH}/avatars/${user.avatar}`;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await User.findByIdAndUpdate(req.user.id, { avatar: file.name });

      res.status(200).json({
        success: true,
        data: file.name,
      });
    }
  );
});

/**
 * @desc    Get all freelancers
 * @route   GET /api/users/freelancers
 * @access  Public
 */
exports.getFreelancers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);  
});

/**
 * @desc    Get all employers
 * @route   GET /api/users/employers
 * @access  Public
 */
exports.getEmployers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get user public profile
 * @route   GET /api/users/profile/:username
 * @access  Public
 */
exports.getPublicProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId)
    .select("-password")
    .populate("skills");

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Get user portfolio
 * @route   GET /api/users/:userId/portfolio
 * @access  Public
 */
exports.getUserPortfolio = asyncHandler(async (req, res, next) => {
  let userId = req.params.userId;
  
  // Handle the special case when userId is "me"
  if (userId === "me") {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return next(new ErrorResponse('Authentication required to access your portfolio', 401));
    }
    userId = req.user.id;
  }
  
  const portfolio = await Portfolio.find({ user: userId });
  
  res.status(200).json({
    success: true,
    count: portfolio.length,
    data: portfolio,
  });
});

/**
 * @desc    Add portfolio item
 * @route   POST /api/users/me/portfolio
 * @access  Private
 */
exports.addPortfolioItem = asyncHandler(async (req, res, next) => {
  // Make sure req.user exists and has valid id
  if (!req.user || !req.user.id) {
    return next(new ErrorResponse('User authentication required', 401));
  }
  
  req.body.user = req.user.id;
  
  const portfolio = await Portfolio.create(req.body);
  
  res.status(201).json({
    success: true,
    data: portfolio,
  });
});

/**
 * @desc    Update portfolio item
 * @route   PUT /api/users/me/portfolio/:itemId
 * @access  Private
 */
exports.updatePortfolioItem = asyncHandler(async (req, res, next) => {
  let portfolio = await Portfolio.findById(req.params.itemId);

  if (!portfolio) {
    return next(new ErrorResponse("Portfolio item not found", 404));
  }

  // Check if user owns the portfolio item
  if (portfolio.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("Not authorized to update this portfolio item", 401)
    );
  }

  portfolio = await Portfolio.findByIdAndUpdate(req.params.itemId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: portfolio,
  });
});

/**
 * @desc    Delete portfolio item
 * @route   DELETE /api/users/me/portfolio/:itemId
 * @access  Private
 */
exports.deletePortfolioItem = asyncHandler(async (req, res, next) => {
  const portfolio = await Portfolio.findById(req.params.itemId);

  if (!portfolio) {
    return next(new ErrorResponse("Portfolio item not found", 404));
  }

  // Check if user owns the portfolio item
  if (portfolio.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("Not authorized to delete this portfolio item", 401)
    );
  }

  // Use deleteOne() instead of remove()
  await portfolio.deleteOne();
  
  // Alternatively, you could use this method directly:
  // await Portfolio.findByIdAndDelete(req.params.itemId);

  res.status(200).json({
    success: true,
    data: {},
  });
});
/**
 * @desc    Get user skills
 * @route   GET /api/users/:userId/skills
 * @access  Public
 */
exports.getUserSkills = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId).populate("skills");

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: user.skills,
  });
});

/**
 * @desc    Add skill to user
 * @route   POST /api/users/me/skills
 * @access  Private
 */
exports.addSkill = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new ErrorResponse("Please provide a skill name", 400));
  }

  // Find or create skill
  let skill = await Skill.findOne({ name: name.toLowerCase() });

  if (!skill) {
    skill = await Skill.create({ name: name.toLowerCase() });
  }

  // Add to user if not already added
  const user = await User.findById(req.user.id);

  if (user.skills.includes(skill._id)) {
    return next(new ErrorResponse("Skill already added", 400));
  }

  user.skills.push(skill._id);
  await user.save();

  res.status(200).json({
    success: true,
    data: skill,
  });
});

/**
 * @desc    Remove skill from user
 * @route   DELETE /api/users/me/skills/:skillId
 * @access  Private
 */
exports.removeSkill = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Convert ObjectIds to strings for comparison
  const userSkillIds = user.skills.map(skill => skill.toString());
  
  // Check if user has the skill
  if (!userSkillIds.includes(req.params.skillId)) {
    return next(new ErrorResponse("Skill not found in user profile", 404));
  }

  // Remove skill from user
  user.skills = user.skills.filter(
    (skill) => skill.toString() !== req.params.skillId
  );

  await user.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Get user reviews
 * @route   GET /api/users/:userId/reviews
 * @access  Public
 */
exports.getUserReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ receiver: req.params.userId })
    .populate({
      path: "project",
      select: "title",
    })
    .populate({
      path: "sender",
      select: "name avatar",
    });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

/**
 * @desc    Save a user (like bookmark)
 * @route   POST /api/users/save/:userId
 * @access  Private
 */
exports.saveUser = asyncHandler(async (req, res, next) => {
  // Make sure user exists
  const userToSave = await User.findById(req.params.userId);
  if (!userToSave) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Check if already saved
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse("Authentication error", 401));
  }
  
  // Initialize savedUsers array if it doesn't exist
  if (!user.savedUsers) {
    user.savedUsers = [];
  }

  // Check if already saved - Convert ObjectIDs to strings for proper comparison
  const isAlreadySaved = user.savedUsers.some(
    (userId) => userId.toString() === req.params.userId
  );
  
  if (isAlreadySaved) {
    return next(new ErrorResponse("User already saved", 400));
  }

  user.savedUsers.push(req.params.userId);
  await user.save();

  // Return the saved users with populated data for better client usage
  const savedUsers = await User.find(
    { _id: { $in: user.savedUsers } },
    'name username avatar bio title role'
  );

  res.status(200).json({
    success: true,
    count: savedUsers.length,
    data: savedUsers
  });
});
/**
 * @desc    Unsave a user
 * @route   DELETE /api/users/save/:userId
 * @access  Private
 */
exports.unsaveUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorResponse("Authentication error", 401));
  }
  
  // Check if savedUsers exists and has items
  if (!user.savedUsers || user.savedUsers.length === 0) {
    return next(new ErrorResponse("No saved users found", 400));
  }

  // Debug logging to help identify the issue
  console.log("User ID to unsave:", req.params.userId);
  console.log("Saved user IDs:", user.savedUsers.map(id => id.toString()));
  
  // Check if the user is in the saved list
  const isUserSaved = user.savedUsers.some(
    (id) => id.toString() === req.params.userId
  );
  
  if (!isUserSaved) {
    return next(new ErrorResponse("User not found in saved list", 404));
  }

  // Remove the user from savedUsers
  user.savedUsers = user.savedUsers.filter(
    (id) => id.toString() !== req.params.userId
  );

  await user.save();

  res.status(200).json({
    success: true,
    message: "User removed from saved list",
    // Return updated list for client convenience
    data: await User.find(
      { _id: { $in: user.savedUsers } },
      'name username avatar bio title role'
    )
  });
});
/**
 * @desc    Get saved users
 * @route   GET /api/users/me/saved
 * @access  Private
 */
exports.getSavedUsers = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user || !user.savedUsers) {
    return res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  }
  
  // Fetch saved users separately since we can't populate
  const savedUsers = await User.find(
    { _id: { $in: user.savedUsers } },
    'name username avatar bio title role'
  );

  res.status(200).json({
    success: true,
    count: savedUsers.length,
    data: savedUsers
  });
});