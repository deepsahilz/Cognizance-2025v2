const mongoose = require("mongoose");
const WorkSubmission = require("../models/WorkSubmission");
const Milestone = require("../models/Milestone");
const Project = require("../models/Project");
const User = require("../models/User");
const aiVerificationService = require("../services/aiVerificationService");
const config = require("../config/env");
const bcrypt = require("bcryptjs");

async function testAIVerification() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find or create test user
    let testUser = await User.findOne({ email: "test.freelancer@example.com" });
    if (!testUser) {
      // Hash a test password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("TestPassword123!", salt);

      testUser = new User({
        name: "Test Freelancer",
        email: "test.freelancer@example.com",
        password: hashedPassword,
        role: "freelancer",
      });
      await testUser.save();
    }

    // Find or create employer user
    let employerUser = await User.findOne({
      email: "test.employer@example.com",
    });
    if (!employerUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("TestEmployerPass123!", salt);

      employerUser = new User({
        name: "Test Employer",
        email: "test.employer@example.com",
        password: hashedPassword,
        role: "employer",
      });
      await employerUser.save();
    }

    // Find or create test project
    let testProject = await Project.findOne({
      title: "Test AI Verification Project",
    });
    if (!testProject) {
      // Calculate deadline (30 days from now)
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 30);

      testProject = new Project({
        title: "Test AI Verification Project",
        description: "A project for testing AI verification",
        freelancerId: testUser._id,
        employerId: employerUser._id,
        status: "open",
        budget: 1000,
        currency: "USD",
        deadline: deadline,
        tags: ["test", "verification"],
        category: "Software Development",
      });
      await testProject.save();
    }

    // Find or create test milestone
    let testMilestone = await Milestone.findOne({
      projectId: testProject._id,
      title: "Test Milestone for AI Verification",
    });
    if (!testMilestone) {
      // Calculate due date (14 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      testMilestone = new Milestone({
        title: "Test Milestone for AI Verification",
        description: "A milestone to test AI verification process",
        projectId: testProject._id,
        order: 1, // First milestone
        dueDate: dueDate,
        amount: 250, // Milestone-specific budget
        status: "pending",
        requiredDeliverables: [
          "Detailed project report",
          "Source code",
          "Presentation slides",
        ],
      });
      await testMilestone.save();
    }

    // Directly use mongoose model to create submission
    const submissionData = {
      milestoneId: testMilestone._id,
      freelancerId: testUser._id,
      description:
        "Comprehensive project report demonstrating key deliverables",
      attachments: JSON.parse(
        JSON.stringify([
          {
            name: "project-report.pdf",
            url: "/uploads/test-report.pdf",
            type: "application/pdf",
            size: 2048,
          },
        ])
      ),
      status: "pending",
    };

    // Create and save submission using Mongoose model directly
    const testSubmission = new WorkSubmission(submissionData);
    await testSubmission.save();

    console.log("Test Submission Created:", testSubmission._id);

    // Trigger AI verification
    console.log("Starting AI Verification...");
    const verificationResult = await aiVerificationService.verifySubmission(
      testSubmission._id
    );

    console.log("AI Verification Complete");
    console.log(
      "Verification Result:",
      JSON.stringify(verificationResult, null, 2)
    );

    // Optional: Test manual override
    if (verificationResult.result === "uncertain") {
      console.log("Testing Manual Override...");
      const overrideResult =
        await aiVerificationService.manualVerificationOverride(
          testSubmission._id,
          "approved",
          "Manual override for testing purposes"
        );
      console.log("Override Result:", JSON.stringify(overrideResult, null, 2));
    }
  } catch (error) {
    console.error("AI Verification Test Failed:", error);
    // Log detailed error for debugging
    console.error(
      "Detailed Error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
  }
}

// Run the test
testAIVerification();
