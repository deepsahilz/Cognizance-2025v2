const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["payment", "milestone", "message", "dispute", "system"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceModel",
    },
    referenceModel: {
      type: String,
      enum: [
        "Project",
        "Milestone",
        "Payment",
        "Dispute",
        "WorkSubmission",
        "User",
      ],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
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

// Index for quick lookup by user
NotificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", NotificationSchema);
