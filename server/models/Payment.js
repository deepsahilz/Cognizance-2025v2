const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.ObjectId,
      ref: "Project",
      required: true,
    },
    milestone: {
      type: mongoose.Schema.ObjectId,
      ref: "Milestone",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "escrow",
        "released",
        "refunded",
        "cancelled",
        "failed",
      ],
      default: "pending",
    },

    // Payment participants
    employer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    // When payment was released from escrow
    releasedAt: {
      type: Date,
    },
    // For manual approval
    approvedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },

    // Add these blockchain-related fields
    blockchainTxHash: {
      type: String,
    },
    blockchainContractAddress: {
      type: String,
    },
    blockchainProjectId: {
      type: Number,
    },
    blockchainMilestoneId: {
      type: Number,
    },
    // Track gas costs
    gasCost: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", PaymentSchema);
