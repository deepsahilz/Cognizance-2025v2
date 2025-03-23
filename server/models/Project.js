const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
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
    budget: {
      type: Number,
      required: [true, "Please add a budget"],
    },
    currency: {
      type: String,
      required: [true, "Please specify currency"],
      default: "USD",
    },
    deadline: {
      type: Date,
      required: [true, "Please add a deadline"],
    },
    status: {
      type: String,
      enum: ["draft", "open", "in-progress", "completed", "canceled"],
      default: "draft",
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tags: [String],
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    category: String,
    requirements: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    totalMilestones: {
      type: Number,
      default: 0,
    },
    completedMilestones: {
      type: Number,
      default: 0,
    },
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

module.exports = mongoose.model("Project", ProjectSchema);