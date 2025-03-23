const Project = require("../models/Project");
const User = require("../models/User");

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    const reqQuery = { ...req.query };

    const removeFields = ["select", "sort", "page", "limit"];

    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    let query = Project.find(JSON.parse(queryStr));

    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Project.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Populate with employer and freelancer data
    query = query.populate([
      { path: "employerId", select: "name profile" },
      { path: "freelancerId", select: "name profile" },
    ]);

    const projects = await query;

    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      pagination,
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate([
      { path: "employerId", select: "name profile" },
      { path: "freelancerId", select: "name profile" },
    ]);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Employers only)
exports.createProject = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.employerId = req.user.id;

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Project owner only)
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Make sure user is project owner
    if (
      project.employerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this project",
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Project owner only)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Make sure user is project owner
    if (
      project.employerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this project",
      });
    }

    await Project.deleteOne({ _id: project._id });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Assign freelancer to project
// @route   PUT /api/projects/:id/assign
// @access  Private (Project owner only)
exports.assignFreelancer = async (req, res, next) => {
  try {
    const { freelancerId } = req.body;

    if (!freelancerId) {
      return res.status(400).json({
        success: false,
        error: "Please provide a freelancer ID",
      });
    }

    // Check if freelancer exists and has the role 'freelancer'
    const freelancer = await User.findById(freelancerId);

    if (!freelancer || freelancer.role !== "freelancer") {
      return res.status(404).json({
        success: false,
        error: "Freelancer not found",
      });
    }

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Make sure user is project owner
    if (
      project.employerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this project",
      });
    }

    // Update project with freelancer and change status to in-progress
    project = await Project.findByIdAndUpdate(
      req.params.id,
      { freelancerId, status: "in-progress" },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};