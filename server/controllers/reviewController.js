const Review = require("../models/Review");
const Project = require("../models/Project");
const User = require("../models/User");

// @desc    Create a review
// @route   POST /api/projects/:projectId/reviews
// @access  Private (Project participants only)
exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    // Check if project exists and is completed
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Check if project is completed
    if (project.status !== "completed") {
      return res.status(400).json({
        success: false,
        error: "Can only review completed projects",
      });
    }

    // Check if user is involved in the project
    const isEmployer = project.employerId.toString() === req.user.id;
    const isFreelancer =
      project.freelancerId && project.freelancerId.toString() === req.user.id;

    if (!isEmployer && !isFreelancer) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to review this project",
      });
    }

    // Determine review type and receiver
    let type, receiverId;

    if (isEmployer) {
      type = "employer-to-freelancer";
      receiverId = project.freelancerId;
    } else {
      type = "freelancer-to-employer";
      receiverId = project.employerId;
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      projectId: project._id,
      reviewerId: req.user.id,
      type,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: "You have already reviewed this project",
      });
    }

    // Create review
    const review = await Review.create({
      rating,
      comment,
      projectId: project._id,
      reviewerId: req.user.id,
      receiverId,
      type,
    });

    // Update user rating
    const receiver = await User.findById(receiverId);

    // Calculate new average rating
    const userReviews = await Review.find({ receiverId });
    const totalRating = userReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / userReviews.length;

    // Update user
    await User.findByIdAndUpdate(receiverId, {
      "rating.average": averageRating,
      "rating.count": userReviews.length,
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews for a project
// @route   GET /api/projects/:projectId/reviews
// @access  Public
exports.getProjectReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ projectId: req.params.projectId })
      .populate("reviewerId", "name profile")
      .populate("receiverId", "name profile");

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews for a user
// @route   GET /api/users/:userId/reviews
// @access  Public
exports.getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ receiverId: req.params.userId })
      .populate("reviewerId", "name profile")
      .populate("projectId", "title");

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("reviewerId", "name profile")
      .populate("receiverId", "name profile")
      .populate("projectId", "title");

    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Review owner or admin)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    // Check if user is the review owner or admin
    if (
      review.reviewerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this review",
      });
    }

    await review.remove();

    // Update user rating
    const userReviews = await Review.find({ receiverId: review.receiverId });

    if (userReviews.length > 0) {
      const totalRating = userReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRating / userReviews.length;

      await User.findByIdAndUpdate(review.receiverId, {
        "rating.average": averageRating,
        "rating.count": userReviews.length,
      });
    } else {
      // No reviews left
      await User.findByIdAndUpdate(review.receiverId, {
        "rating.average": 0,
        "rating.count": 0,
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};