const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Please add a rating between 1 and 5"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Please add a comment"],
      trim: true,
      minlength: [5, "Comment must be at least 5 characters"],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["employer-to-freelancer", "freelancer-to-employer"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per project per type
ReviewSchema.index({ projectId: 1, reviewerId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);