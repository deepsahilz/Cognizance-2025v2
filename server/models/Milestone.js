const mongoose = require("mongoose");

const MilestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "under-review", "completed", "disputed"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: [true, "Please add a due date"],
    },
    completedAt: {
      type: Date,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    order: {
      type: Number,
      required: true,
    },
    requiredDeliverables: {
      type: [String],
      default: [],
    },
    requirements: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Milestone", MilestoneSchema);