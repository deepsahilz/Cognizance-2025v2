// controllers/disputeController.js
const Dispute = require("../models/Dispute");
const Milestone = require("../models/Milestone");
const Project = require("../models/Project");

// @desc    Create a new dispute
// @route   POST /api/milestones/:milestoneId/disputes
exports.createDispute = async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const { description } = req.body;

    // Find the milestone
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    // Find the project
    const project = await Project.findById(milestone.project);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Create dispute
    const dispute = new Dispute({
      milestone: milestoneId,
      project: project._id,
      raiser: req.user._id,
      description,
      status: "open",
      messages: [
        {
          user: req.user._id,
          message: description,
          timestamp: new Date(),
        },
      ],
    });

    await dispute.save();

    res.status(201).json({
      success: true,
      data: dispute,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all disputes
// @route   GET /api/disputes
exports.getDisputes = async (req, res) => {
  try {
    let disputes;

    // If user is an admin, get all disputes
    if (req.user.role === "admin") {
      disputes = await Dispute.find()
        .populate("milestone")
        .populate("project")
        .populate("raiser", "name email");
    } else {
      // For other roles, get disputes related to their projects
      disputes = await Dispute.find({
        $or: [
          { raiser: req.user._id },
          { "project.employer": req.user._id },
          { "project.freelancer": req.user._id },
        ],
      })
        .populate("milestone")
        .populate("project")
        .populate("raiser", "name email");
    }

    res.status(200).json({
      success: true,
      count: disputes.length,
      data: disputes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get a single dispute
// @route   GET /api/disputes/:id
exports.getDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id)
      .populate("milestone")
      .populate("project")
      .populate("raiser", "name email")
      .populate("messages.user", "name email");

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: "Dispute not found",
      });
    }

    // Check if user has permission to view this dispute
    const isAuthorized =
      dispute.raiser._id.equals(req.user._id) ||
      req.user.role === "admin" ||
      dispute.project.employer.equals(req.user._id) ||
      dispute.project.freelancer.equals(req.user._id);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this dispute",
      });
    }

    res.status(200).json({
      success: true,
      data: dispute,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add a message to a dispute
// @route   POST /api/disputes/:id/messages
exports.addMessage = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: "Dispute not found",
      });
    }

    // Check if user has permission to add message
    const isAuthorized =
      dispute.raiser.equals(req.user._id) || req.user.role === "admin";

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add messages to this dispute",
      });
    }

    dispute.messages.push({
      user: req.user._id,
      message: req.body.message,
      timestamp: new Date(),
    });

    await dispute.save();

    res.status(200).json({
      success: true,
      data: dispute,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Resolve a dispute
// @route   PUT /api/disputes/:id/resolve
exports.resolveDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: "Dispute not found",
      });
    }

    dispute.status = "resolved";
    dispute.resolvedAt = new Date();
    dispute.resolvedBy = req.user._id;

    await dispute.save();

    // Optional: Update associated milestone or project status
    await Milestone.findByIdAndUpdate(dispute.milestone, {
      disputeStatus: "resolved",
    });

    res.status(200).json({
      success: true,
      data: dispute,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
