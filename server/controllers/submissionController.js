const WorkSubmission = require("../models/WorkSubmission");
const Milestone = require("../models/Milestone");
const Project = require("../models/Project");
const aiVerificationService = require("../services/aiVerificationService");

// Existing controller methods...

// Modify your createSubmission function to trigger AI verification
exports.createSubmission = async (req, res, next) => {

  try {
    req.body.milestoneId = req.params.milestoneId;
    req.body.freelancerId = req.user.id;

    const milestone = await Milestone.findById(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        error: "Milestone not found",
      });
    }

    if (milestone.status !== "in-progress") {
      return res.status(400).json({
        success: false,
        error: `Cannot submit work for a milestone with status: ${milestone.status}`,
      });
    }

    const project = await Project.findById(milestone.projectId);
    // if (
    //   project.freelancerId.toString() !== req.user.id &&
    //   req.user.role !== "admin"
    // ) {
    //   return res.status(403).json({
    //     success: false,
    //     error: "Not authorized to submit work for this milestone",
    //   });
    // }
    if (
      project.freelancerId.toString() == req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to submit work for this milestone",
      });
    }


    // Handle file uploads
    if (req.files) {
      const attachments = [];
      Object.keys(req.files).forEach((key) => {
        const file = req.files[key];
        const url = `/uploads/${file.name}`;
        attachments.push({
          name: file.name,
          url,
          type: file.mimetype,
          size: file.size,
        });
        file.mv(`./public/uploads/${file.name}`, (err) => {
          if (err) {
            console.error(`File upload error: ${err.message}`);
          }
        });
      });
      req.body.attachments = attachments;
    }

    // Create submission
    const submission = await WorkSubmission.create(req.body);

    // Update milestone status
    await Milestone.findByIdAndUpdate(req.params.milestoneId, {
      status: "under-review",
    });

    // Trigger AI verification in background
    if (process.env.AI_VERIFICATION_ENABLED === "true") {
      aiVerificationService
        .verifySubmission(submission._id)
        .catch((err) => console.error("AI Verification Error:", err));
    }

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSubmissions = async (req, res, next) => {
  try {
    // Default query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query based on user role and context
    let query = {};

    // If milestone context (from nested routes)
    if (req.params.milestoneId) {
      query.milestoneId = req.params.milestoneId;
    }

    // Role-based filtering
    if (req.user.role === "freelancer") {
      query.freelancerId = req.user.id;
    } else if (req.user.role === "employer") {
      // Find submissions for employer's projects
      const employerProjects = await Project.find({ employerId: req.user.id });
      const projectIds = employerProjects.map((project) => project._id);

      const milestones = await Milestone.find({
        projectId: { $in: projectIds },
      });
      const milestoneIds = milestones.map((milestone) => milestone._id);

      query.milestoneId = { $in: milestoneIds };
    }

    // Fetch submissions
    const submissions = await WorkSubmission.find(query)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "milestoneId",
        populate: {
          path: "projectId",
          select: "title",
        },
      })
      .sort({ createdAt: -1 });

    // Count total submissions
    const total = await WorkSubmission.countDocuments(query);

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
      data: submissions,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSubmission = async (req, res, next) => {
  try {
    const submission = await WorkSubmission.findById(req.params.id).populate({
      path: "milestoneId",
      populate: {
        path: "projectId",
        select: "title employerId freelancerId",
      },
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: "Submission not found",
      });
    }

    // Authorization check
    const milestone = await Milestone.findById(submission.milestoneId);
    const project = await Project.findById(milestone.projectId);

    const isEmployer = project.employerId.toString() === req.user.id;
    const isFreelancer = project.freelancerId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isEmployer && !isFreelancer && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to view this submission",
      });
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

exports.reviewSubmission = async (req, res, next) => {
  try {
    const { status, feedback } = req.body;

    if (
      !status ||
      !["approved", "rejected", "revision-requested"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Please provide a valid status (approved, rejected, or revision-requested)",
      });
    }

    const submission = await WorkSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: "Submission not found",
      });
    }

    const milestone = await Milestone.findById(submission.milestoneId);
    const project = await Project.findById(milestone.projectId);

    // Only employer or admin can review
    if (
      project.employerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to review this submission",
      });
    }

    // Check if AI verification has been completed
    const aiVerificationEnabled =
      process.env.AI_VERIFICATION_ENABLED === "true";
    const needsManualVerification =
      submission.aiVerification &&
      submission.aiVerification.result === "uncertain";

    // If approving and AI verification failed, warn the employer
    if (
      status === "approved" &&
      aiVerificationEnabled &&
      submission.aiVerification &&
      submission.aiVerification.result === "rejected" &&
      req.user.role !== "admin"
    ) {
      // Allow override with explicit acknowledgment
      if (!req.body.overrideAiVerification) {
        return res.status(400).json({
          success: false,
          error:
            "AI verification failed for this submission. Set overrideAiVerification to true to approve anyway.",
          aiVerification: submission.aiVerification,
        });
      }
    }

    // Update submission
    const updatedSubmission = await WorkSubmission.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNotes: feedback || "",
        reviewedAt: Date.now(),
      },
      { new: true }
    );

    // Update milestone status based on submission status
    if (status === "approved") {
      await Milestone.findByIdAndUpdate(milestone._id, {
        status: "completed",
        completedAt: Date.now(),
      });

      await Project.findByIdAndUpdate(project._id, {
        $inc: { completedMilestones: 1 },
      });
    } else if (status === "revision-requested" || status === "rejected") {
      // Set milestone back to in-progress for revisions
      await Milestone.findByIdAndUpdate(milestone._id, {
        status: "in-progress",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedSubmission,
    });
  } catch (err) {
    next(err);
  }
};

// Add new endpoint for manually triggering AI verification
exports.triggerAIVerification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const submission = await WorkSubmission.findById(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: "Submission not found",
      });
    }

    // Check authorization
    const milestone = await Milestone.findById(submission.milestoneId);
    const project = await Project.findById(milestone.projectId);

    const isEmployer = project.employerId.toString() === req.user.id;
    const isFreelancer = project.freelancerId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isEmployer && !isFreelancer && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to trigger verification for this submission",
      });
    }

    // Trigger AI verification
    const verification = await aiVerificationService.verifySubmission(id);

    res.status(200).json({
      success: true,
      data: verification,
    });
  } catch (err) {
    next(err);
  }
};

// Add endpoint for admins to override AI verification
exports.overrideAIVerification = async (req, res, next) => {
  try {
    // Only admins can override
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Only admins can override AI verification",
      });
    }

    const { id } = req.params;
    const { result, notes } = req.body;

    if (!result || !["approved", "rejected"].includes(result)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid result (approved/rejected)",
      });
    }

    const verification = await aiVerificationService.manualVerificationOverride(
      id,
      result,
      notes
    );

    res.status(200).json({
      success: true,
      data: verification,
    });
  } catch (err) {
    next(err);
  }
};
