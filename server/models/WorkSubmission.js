const mongoose = require("mongoose");

const WorkSubmissionSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Please add a description of your submission"],
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        size: Number,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "revision-requested"],
      default: "pending",
    },
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedback: String,
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: Date,
    reviewNotes: String,
    aiVerification: {
      result: {
        type: String,
        enum: ["approved", "rejected", "uncertain", "error"],
      },
      confidence: Number,
      feedback: {
        strengths: [String],
        issues: [String],
        suggestions: [String],
      },
      verifiedAt: Date,
      escalatedToManual: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WorkSubmission", WorkSubmissionSchema);