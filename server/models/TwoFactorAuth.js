const mongoose = require("mongoose");

const TwoFactorAuthSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpires: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 3,
    },
  },
  { timestamps: true }
);

// Method to generate OTP
TwoFactorAuthSchema.statics.generateOTP = function () {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = mongoose.model("TwoFactorAuth", TwoFactorAuthSchema);
